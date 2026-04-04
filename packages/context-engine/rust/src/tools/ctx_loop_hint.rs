//! ctx_loop_hint — Root cause hint engine for loop detection.
//!
//! Analyzes an error message and returns a specific diagnosis + suggestion.
//! Runs entirely locally — no LLM call. Available to all CLI/MCP tools
//! (Claude Code, Cursor, Codex CLI, Windsurf) not just the VS Code extension.

struct HintPattern {
    name: &'static str,
    /// All substrings must appear in lowercased error text to match
    matches: &'static [&'static str],
    diagnosis: &'static str,
    suggestion: &'static str,
    weight: f32,
}

const PATTERNS: &[HintPattern] = &[
    // ── Null / undefined ────────────────────────────────────────────
    HintPattern {
        name: "null_access",
        matches: &["cannot read properties of undefined"],
        diagnosis: "A value is undefined before it is accessed.",
        suggestion: "Add optional chaining (?.) or a null guard before the access.",
        weight: 1.0,
    },
    HintPattern {
        name: "null_access",
        matches: &["cannot read property"],
        diagnosis: "A property is being read on an undefined or null value.",
        suggestion: "Add optional chaining (?.) or check the value exists before accessing it.",
        weight: 0.9,
    },
    HintPattern {
        name: "null_access",
        matches: &["object is possibly"],
        diagnosis: "TypeScript caught a potential null/undefined access at compile time.",
        suggestion: "Use optional chaining (?.) or narrow the type with an explicit guard.",
        weight: 1.0,
    },
    // ── TypeScript type errors ───────────────────────────────────────
    HintPattern {
        name: "type_mismatch",
        matches: &["is not assignable to type"],
        diagnosis: "The value type does not match the declared type.",
        suggestion: "Check the interface definition — a missing field or wrong shape is the usual cause.",
        weight: 1.0,
    },
    HintPattern {
        name: "missing_property",
        matches: &["does not exist on type"],
        diagnosis: "A property is accessed on a type that does not include it.",
        suggestion: "Narrow the union with a type guard or check the interface — the property may have been renamed.",
        weight: 0.95,
    },
    HintPattern {
        name: "overload_error",
        matches: &["no overload matches"],
        diagnosis: "No overload of this function accepts the given argument types.",
        suggestion: "Check the function signature — the argument type or order is likely wrong.",
        weight: 0.9,
    },
    // ── Async / Promise ─────────────────────────────────────────────
    HintPattern {
        name: "unhandled_rejection",
        matches: &["unhandledpromiserejection"],
        diagnosis: "A rejected Promise has no catch handler.",
        suggestion: "Add .catch(err => ...) or wrap with try/catch inside an async function.",
        weight: 1.0,
    },
    HintPattern {
        name: "async_misuse",
        matches: &["promise", "not awaited"],
        diagnosis: "An async call is not awaited — the code may be using a Promise object instead of its resolved value.",
        suggestion: "Add 'await' before the async call and ensure the containing function is marked 'async'.",
        weight: 0.75,
    },
    // ── Import / module ─────────────────────────────────────────────
    HintPattern {
        name: "missing_module",
        matches: &["cannot find module"],
        diagnosis: "A module cannot be resolved — wrong path, missing package, or build output missing.",
        suggestion: "Check the import path (case-sensitive on Linux), run npm install, and verify tsconfig paths aliases.",
        weight: 1.0,
    },
    HintPattern {
        name: "missing_module",
        matches: &["module not found"],
        diagnosis: "The bundler or Node.js cannot locate the required module.",
        suggestion: "Check the import path, verify the package is installed, and confirm the file extension is correct.",
        weight: 1.0,
    },
    HintPattern {
        name: "missing_export",
        matches: &["has no exported member"],
        diagnosis: "The imported name does not exist in the target module.",
        suggestion: "Check the exact export name — it may have been renamed, moved, or not yet exported.",
        weight: 1.0,
    },
    // ── Not a function ───────────────────────────────────────────────
    HintPattern {
        name: "not_a_function",
        matches: &["is not a function"],
        diagnosis: "A value expected to be callable is not a function at runtime.",
        suggestion: "Log the value before calling it to see its actual type — it may be undefined or an object.",
        weight: 0.85,
    },
    // ── Rust borrow checker ──────────────────────────────────────────
    HintPattern {
        name: "borrow_conflict",
        matches: &["cannot borrow", "already borrowed"],
        diagnosis: "A conflicting borrow was detected by the Rust borrow checker.",
        suggestion: "Introduce an explicit scope, clone the value, or avoid holding a mutable reference while an immutable one is alive.",
        weight: 1.0,
    },
    HintPattern {
        name: "lifetime_error",
        matches: &["does not live long enough"],
        diagnosis: "A borrowed value is used after it may have been dropped.",
        suggestion: "Move the binding earlier, return an owned value instead of a reference, or use Arc/Rc.",
        weight: 1.0,
    },
    // ── React ────────────────────────────────────────────────────────
    HintPattern {
        name: "react_key",
        matches: &["each child in a list"],
        diagnosis: "React requires a unique 'key' prop on each element in a rendered list.",
        suggestion: "Add key={item.id} to each element in .map() — never use array index if the list can reorder.",
        weight: 1.0,
    },
    HintPattern {
        name: "react_hooks",
        matches: &["rendered fewer hooks", "rules of hooks"],
        diagnosis: "A React hook is being called conditionally or in a different order between renders.",
        suggestion: "Move the hook call outside of any if/loop — hooks must be called unconditionally at the top level.",
        weight: 1.0,
    },
    // ── Python ───────────────────────────────────────────────────────
    HintPattern {
        name: "attribute_error",
        matches: &["attributeerror", "has no attribute"],
        diagnosis: "A Python object does not have the expected attribute.",
        suggestion: "Check the object type with type() or dir() before the error line — it may be None or a different type.",
        weight: 0.9,
    },
    HintPattern {
        name: "index_error",
        matches: &["indexerror", "list index out of range"],
        diagnosis: "An index is out of bounds for the list or array.",
        suggestion: "Check the length before indexing, or use get() / slicing with bounds checking.",
        weight: 0.95,
    },
    // ── Go ────────────────────────────────────────────────────────────
    HintPattern {
        name: "nil_pointer",
        matches: &["nil pointer dereference"],
        diagnosis: "A nil pointer is being dereferenced in Go.",
        suggestion: "Add a nil check before accessing the pointer: if ptr == nil { return ... }",
        weight: 1.0,
    },
    // ── Generic build / syntax ───────────────────────────────────────
    HintPattern {
        name: "syntax_error",
        matches: &["syntaxerror", "unexpected token", "parse error"],
        diagnosis: "A syntax error is preventing the code from parsing.",
        suggestion: "Check the line reported and the line above it — the actual mistake is often one line earlier than reported.",
        weight: 0.9,
    },
];

pub struct Hint {
    pub pattern: &'static str,
    pub diagnosis: &'static str,
    pub suggestion: &'static str,
    pub confidence: f32,
}

pub fn analyze(error_text: &str) -> Option<Hint> {
    let lower = error_text.to_lowercase();
    let mut best: Option<(&HintPattern, f32)> = None;

    for p in PATTERNS {
        if p.matches.is_empty() {
            continue;
        }
        let hits = p.matches.iter().filter(|m| lower.contains(**m)).count();
        if hits == 0 {
            continue;
        }
        let score = (hits as f32 / p.matches.len() as f32) * p.weight;
        if best.as_ref().is_none_or(|(_, s)| score > *s) {
            best = Some((p, score));
        }
    }

    best.filter(|(_, score)| *score >= 0.5).map(|(p, confidence)| Hint {
        pattern: p.name,
        diagnosis: p.diagnosis,
        suggestion: p.suggestion,
        confidence,
    })
}

pub fn handle(error_text: &str, crp_mode: crate::tools::CrpMode) -> String {
    let Some(hint) = analyze(error_text) else {
        return format!(
            "No specific pattern matched for this error.\n\
            General advice: stop fixing the symptom — find where the bad value originates.\n\
            Error: {}",
            error_text.chars().take(120).collect::<String>()
        );
    };

    if crp_mode.is_tdd() {
        format!(
            "§hint [{:.0}%] {}\n  Δ {}\n  → {}",
            hint.confidence * 100.0,
            hint.pattern,
            hint.diagnosis,
            hint.suggestion,
        )
    } else {
        format!(
            "ctx_loop_hint — {:.0}% confidence · pattern: {}\n\
             ─────────────────────────────────────────\n\
             Diagnosis:   {}\n\
             Suggestion:  {}\n\
             ─────────────────────────────────────────\n\
             Run ctx_memory(action=\"record\", error_text=..., fix_file=...) after resolving.",
            hint.confidence * 100.0,
            hint.pattern,
            hint.diagnosis,
            hint.suggestion,
        )
    }
}
