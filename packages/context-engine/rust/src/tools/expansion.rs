use std::sync::Arc;

use rmcp::model::Tool;
use rmcp::ErrorData;
use serde_json::{Map, Value};

use crate::core::cache::SessionCache;

const EXPANSION_TOOLS: &[(&str, &str)] = &[
    ("ctx_url_read", "Fetch or prepare focused web page reads."),
    (
        "ctx_pdf",
        "Read local PDF metadata and prepare text extraction.",
    ),
    ("ctx_docs", "Find package documentation entry points."),
    ("ctx_facts", "Extract concise facts from long text."),
    ("ctx_quotes", "Extract short evidence quotes from text."),
    (
        "ctx_search_web",
        "Prepare web search queries for research workflows.",
    ),
    ("ctx_arxiv", "Prepare arXiv abstract and PDF lookup links."),
    (
        "ctx_changelog_pkg",
        "Find package changelog and release information.",
    ),
    ("ctx_symbols", "Extract symbols from a source file."),
    ("ctx_references", "Search references to a symbol."),
    ("ctx_imports", "Summarize import relationships."),
    ("ctx_unused", "Flag likely unused code from a file."),
    ("ctx_diagnostics", "Run local diagnostics command hints."),
    ("ctx_hover", "Show nearby source context for a position."),
    ("ctx_refactor", "Plan a local refactor operation."),
    ("ctx_rename", "Plan a rename operation across files."),
    ("ctx_pr_pack", "Pack pull request context."),
    (
        "ctx_pr_review",
        "Prepare a focused pull request review summary.",
    ),
    ("ctx_blame", "Compact git blame output."),
    (
        "ctx_stash",
        "Store and retrieve LoopGuard helper snapshots.",
    ),
    (
        "ctx_commit_msg",
        "Draft a commit message from git diff context.",
    ),
    ("ctx_diff_apply", "Inspect or prepare a patch application."),
    ("ctx_git_log", "Compact git log output."),
    (
        "ctx_expand",
        "Retrieve original content from a reversible context store.",
    ),
    ("ctx_retrieve", "Retrieve saved context by key."),
    (
        "ctx_proof",
        "Produce proof metadata for current cached context.",
    ),
    (
        "ctx_verify",
        "Check context against verification questions.",
    ),
    ("ctx_pkg_create", "Create a portable context package."),
    ("ctx_pkg_load", "Load a portable context package."),
    ("ctx_handoff", "Create a handoff note for another agent."),
    ("ctx_share", "Share local context slots between agents."),
    ("ctx_broadcast", "Record a local broadcast message."),
    ("ctx_sync", "Report or prepare local sync state."),
    ("ctx_harness", "Manage lightweight agent harness runs."),
    ("ctx_merge", "Merge local context sources."),
    ("ctx_archive", "Archive a block of output locally."),
    ("ctx_fts", "Search locally archived output."),
    ("ctx_semantic", "Plan semantic search over a workspace."),
    ("ctx_index", "Index a workspace for later lookup."),
    ("ctx_scan", "Scan files with compact context."),
    ("ctx_similar", "Find files similar to a target file."),
    ("ctx_gain", "Summarize token savings gain."),
    ("ctx_watch", "Prepare a local watch loop."),
    ("ctx_ledger", "Maintain a local savings ledger."),
    ("ctx_budget", "Set and check a token budget."),
    ("ctx_report", "Generate a local savings report."),
    ("ctx_compare", "Compare two sessions or summaries."),
    (
        "ctx_alert",
        "Record or list local token and workflow alerts.",
    ),
    ("ctx_facts_graph", "Extract facts as graph-like nodes."),
    ("ctx_graph_query", "Query the local graph layer."),
    ("ctx_graph_diff", "Compare graph snapshots."),
    ("ctx_graph_update", "Record graph update operations."),
];

pub fn tool_defs() -> Vec<Tool> {
    EXPANSION_TOOLS
        .iter()
        .map(|(name, description)| Tool::new(*name, *description, Arc::new(common_schema(*name))))
        .collect()
}

pub fn handle_tool(
    name: &str,
    args: &Option<Map<String, Value>>,
    cache: &SessionCache,
) -> Result<Option<String>, ErrorData> {
    let result = match name {
        "ctx_url_read" => crate::tools::ctx_url_read::handle(
            &required_str(args, "url")?,
            &str_arg(args, "mode", "text"),
        ),
        "ctx_pdf" => crate::tools::ctx_pdf::handle(
            &required_str(args, "path")?,
            get_str(args, "pages").as_deref(),
        ),
        "ctx_docs" => crate::tools::ctx_docs::handle(
            &required_str(args, "package")?,
            &str_arg(args, "registry", "npm"),
            get_str(args, "version").as_deref(),
        ),
        "ctx_facts" => crate::tools::ctx_facts::handle(
            &required_str(args, "text")?,
            int_arg(args, "limit", 10) as usize,
        ),
        "ctx_quotes" => crate::tools::ctx_quotes::handle(
            &required_str(args, "text")?,
            int_arg(args, "limit", 8) as usize,
        ),
        "ctx_search_web" => crate::tools::ctx_search_web::handle(
            &required_str(args, "query")?,
            int_arg(args, "limit", 5) as usize,
        ),
        "ctx_arxiv" => crate::tools::ctx_arxiv::handle(&required_str(args, "id")?),
        "ctx_changelog_pkg" => crate::tools::ctx_changelog_pkg::handle(
            &required_str(args, "package")?,
            &str_arg(args, "registry", "npm"),
        ),
        "ctx_symbols" => crate::tools::ctx_symbols::handle(
            &required_str(args, "path")?,
            &str_arg(args, "kind", "all"),
        ),
        "ctx_references" => crate::tools::ctx_references::handle(
            &required_str(args, "symbol")?,
            &str_arg(args, "search_path", "."),
        ),
        "ctx_imports" => crate::tools::ctx_imports::handle(
            &required_str(args, "path")?,
            int_arg(args, "depth", 2) as usize,
        ),
        "ctx_unused" => crate::tools::ctx_unused::handle(&required_str(args, "path")?),
        "ctx_diagnostics" => crate::tools::ctx_diagnostics::handle(
            &str_arg(args, "path", "."),
            &str_arg(args, "tool", "auto"),
        ),
        "ctx_hover" => crate::tools::ctx_hover::handle(
            &required_str(args, "path")?,
            int_arg(args, "line", 1),
            int_arg(args, "col", 1),
        ),
        "ctx_refactor" => crate::tools::ctx_refactor::handle(
            &str_arg(args, "action", "plan"),
            &required_str(args, "path")?,
            int_arg(args, "line", 1),
            get_str(args, "new_name").as_deref(),
        ),
        "ctx_rename" => crate::tools::ctx_rename::handle(
            &required_str(args, "old_name")?,
            &required_str(args, "new_name")?,
            &str_arg(args, "search_path", "."),
            get_str(args, "ext").as_deref(),
        ),
        "ctx_pr_pack" => crate::tools::ctx_pr_pack::handle(
            &str_arg(args, "base", "HEAD~1"),
            bool_arg(args, "include_tests", true),
        ),
        "ctx_pr_review" => crate::tools::ctx_pr_review::handle(
            get_str(args, "pr").as_deref(),
            &str_arg(args, "base", "main"),
        ),
        "ctx_blame" => crate::tools::ctx_blame::handle(
            &required_str(args, "path")?,
            get_int(args, "line_start"),
            get_int(args, "line_end"),
        ),
        "ctx_stash" => crate::tools::ctx_stash::handle(
            &str_arg(args, "action", "list"),
            get_str(args, "name").as_deref(),
        ),
        "ctx_commit_msg" => crate::tools::ctx_commit_msg::handle(
            &str_arg(args, "base", "HEAD~1"),
            &str_arg(args, "style", "conventional"),
        ),
        "ctx_diff_apply" => crate::tools::ctx_diff_apply::handle(
            &required_str(args, "diff")?,
            get_str(args, "path").as_deref(),
        ),
        "ctx_git_log" => crate::tools::ctx_git_log::handle(
            get_str(args, "path").as_deref(),
            int_arg(args, "limit", 20) as usize,
            get_str(args, "author").as_deref(),
            get_str(args, "since").as_deref(),
        ),
        "ctx_expand" => crate::tools::ctx_expand::handle(
            get_str(args, "hash").as_deref(),
            get_str(args, "path").as_deref(),
        ),
        "ctx_retrieve" => crate::tools::ctx_retrieve::handle(&required_str(args, "key")?),
        "ctx_proof" => crate::tools::ctx_proof::handle(get_str(args, "path").as_deref(), cache),
        "ctx_verify" => crate::tools::ctx_verify::handle(
            &required_str(args, "path")?,
            &str_array(args, "questions"),
        ),
        "ctx_pkg_create" => crate::tools::ctx_pkg_create::handle(
            &str_array(args, "paths"),
            get_str(args, "output").as_deref(),
        ),
        "ctx_pkg_load" => crate::tools::ctx_pkg_load::handle(&required_str(args, "path")?),
        "ctx_handoff" => crate::tools::ctx_handoff::handle(
            &required_str(args, "to")?,
            &required_str(args, "summary")?,
            bool_arg(args, "include_session", true),
        ),
        "ctx_share" => crate::tools::ctx_share::handle(
            &str_arg(args, "action", "list"),
            get_str(args, "slot").as_deref(),
            get_str(args, "content").as_deref(),
        ),
        "ctx_broadcast" => crate::tools::ctx_broadcast::handle(
            &required_str(args, "message")?,
            &str_arg(args, "level", "info"),
        ),
        "ctx_sync" => crate::tools::ctx_sync::handle(&str_arg(args, "direction", "status")),
        "ctx_harness" => crate::tools::ctx_harness::handle(
            &str_arg(args, "action", "status"),
            get_str(args, "agent").as_deref(),
            get_str(args, "task").as_deref(),
        ),
        "ctx_merge" => crate::tools::ctx_merge::handle(&str_array(args, "sources")),
        "ctx_archive" => crate::tools::ctx_archive::handle(
            &required_str(args, "content")?,
            get_str(args, "label").as_deref(),
            &str_array(args, "tags"),
        ),
        "ctx_fts" => crate::tools::ctx_fts::handle(
            &required_str(args, "query")?,
            int_arg(args, "limit", 10) as usize,
            get_str(args, "tag").as_deref(),
        ),
        "ctx_semantic" => crate::tools::ctx_semantic::handle(
            &required_str(args, "query")?,
            &str_arg(args, "search_path", "."),
            int_arg(args, "limit", 10) as usize,
        ),
        "ctx_index" => crate::tools::ctx_index::handle(
            &str_arg(args, "path", "."),
            bool_arg(args, "force", false),
        ),
        "ctx_scan" => crate::tools::ctx_scan::handle(
            &required_str(args, "pattern")?,
            &str_arg(args, "search_path", "."),
            int_arg(args, "context_lines", 2) as usize,
        ),
        "ctx_similar" => crate::tools::ctx_similar::handle(
            &required_str(args, "path")?,
            int_arg(args, "limit", 10) as usize,
        ),
        "ctx_gain" => crate::tools::ctx_gain::handle(&str_arg(args, "format", "text")),
        "ctx_watch" => crate::tools::ctx_watch::handle(int_arg(args, "interval", 10)),
        "ctx_ledger" => crate::tools::ctx_ledger::handle(
            &str_arg(args, "action", "tail"),
            get_int(args, "amount"),
            get_str(args, "note").as_deref(),
        ),
        "ctx_budget" => crate::tools::ctx_budget::handle(
            &str_arg(args, "action", "check"),
            get_int(args, "tokens"),
            int_arg(args, "warn_pct", 80),
        ),
        "ctx_report" => crate::tools::ctx_report::handle(
            &str_arg(args, "period", "week"),
            &str_arg(args, "format", "text"),
        ),
        "ctx_compare" => crate::tools::ctx_compare::handle(
            get_str(args, "session_a").as_deref(),
            get_str(args, "session_b").as_deref(),
        ),
        "ctx_alert" => crate::tools::ctx_alert::handle(
            &str_arg(args, "action", "list"),
            get_str(args, "message").as_deref(),
            get_int(args, "threshold"),
        ),
        "ctx_facts_graph" => crate::tools::ctx_facts_graph::handle(
            &required_str(args, "text")?,
            get_str(args, "project").as_deref(),
        ),
        "ctx_graph_query" => crate::tools::ctx_graph_query::handle(
            &required_str(args, "query")?,
            int_arg(args, "limit", 10) as usize,
        ),
        "ctx_graph_diff" => crate::tools::ctx_graph_diff::handle(
            &str_arg(args, "base", "main"),
            &str_arg(args, "head", "HEAD"),
        ),
        "ctx_graph_update" => crate::tools::ctx_graph_update::handle(
            &str_arg(args, "action", "list"),
            get_str(args, "node").as_deref(),
            get_str(args, "edge").as_deref(),
            get_str(args, "value").as_deref(),
        ),
        _ => return Ok(None),
    };

    Ok(Some(result))
}

fn common_schema(_name: &str) -> Map<String, Value> {
    let string_fields = [
        "action",
        "agent",
        "author",
        "base",
        "content",
        "diff",
        "direction",
        "edge",
        "ext",
        "format",
        "hash",
        "head",
        "id",
        "key",
        "kind",
        "label",
        "message",
        "mode",
        "name",
        "new_name",
        "node",
        "note",
        "old_name",
        "output",
        "package",
        "pages",
        "path",
        "period",
        "pr",
        "project",
        "query",
        "registry",
        "search_path",
        "session_a",
        "session_b",
        "since",
        "slot",
        "style",
        "summary",
        "symbol",
        "tag",
        "task",
        "text",
        "to",
        "tool",
        "url",
        "value",
        "version",
    ];
    let integer_fields = [
        "amount",
        "col",
        "context_lines",
        "interval",
        "limit",
        "line",
        "line_end",
        "line_start",
        "threshold",
        "tokens",
        "warn_pct",
    ];
    let bool_fields = ["force", "include_session", "include_tests"];
    let array_fields = ["paths", "questions", "sources", "tags"];

    let mut properties = Map::new();
    for field in string_fields {
        properties.insert(field.to_string(), typed("string"));
    }
    for field in integer_fields {
        properties.insert(field.to_string(), typed("integer"));
    }
    for field in bool_fields {
        properties.insert(field.to_string(), typed("boolean"));
    }
    for field in array_fields {
        let mut item = Map::new();
        item.insert("type".to_string(), Value::String("string".to_string()));
        let mut array = Map::new();
        array.insert("type".to_string(), Value::String("array".to_string()));
        array.insert("items".to_string(), Value::Object(item));
        properties.insert(field.to_string(), Value::Object(array));
    }

    let mut schema = Map::new();
    schema.insert("type".to_string(), Value::String("object".to_string()));
    schema.insert("properties".to_string(), Value::Object(properties));
    schema
}

fn typed(kind: &str) -> Value {
    let mut value = Map::new();
    value.insert("type".to_string(), Value::String(kind.to_string()));
    Value::Object(value)
}

fn required_str(args: &Option<Map<String, Value>>, key: &str) -> Result<String, ErrorData> {
    get_str(args, key).ok_or_else(|| ErrorData::invalid_params(format!("{key} is required"), None))
}

fn str_arg(args: &Option<Map<String, Value>>, key: &str, default: &str) -> String {
    get_str(args, key).unwrap_or_else(|| default.to_string())
}

fn int_arg(args: &Option<Map<String, Value>>, key: &str, default: i64) -> i64 {
    get_int(args, key).unwrap_or(default)
}

fn bool_arg(args: &Option<Map<String, Value>>, key: &str, default: bool) -> bool {
    args.as_ref()
        .and_then(|m| m.get(key))
        .and_then(Value::as_bool)
        .unwrap_or(default)
}

fn str_array(args: &Option<Map<String, Value>>, key: &str) -> Vec<String> {
    args.as_ref()
        .and_then(|m| m.get(key))
        .and_then(Value::as_array)
        .map(|arr| {
            arr.iter()
                .filter_map(|v| v.as_str().map(str::to_string))
                .collect()
        })
        .unwrap_or_default()
}

fn get_str(args: &Option<Map<String, Value>>, key: &str) -> Option<String> {
    args.as_ref()?.get(key)?.as_str().map(str::to_string)
}

fn get_int(args: &Option<Map<String, Value>>, key: &str) -> Option<i64> {
    args.as_ref()?.get(key)?.as_i64()
}
