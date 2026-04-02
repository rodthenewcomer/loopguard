# Changelog

Notable changes to `loopguard-ctx` are tracked here in product language rather than internal protocol names.

## [2.7.0] - 2026-04-01

### Improved

- Single-agent setup now better matches how people actually install LoopGuard for Claude Code, Cursor, Windsurf, and Codex.
- Agent-facing rule files were cleaned up so they focus on focused reads, smaller shell output, and session restore.
- Public docs were aligned with the current repo and install paths.

### Fixed

- Agent setup wording and file-path guidance were brought back in line with the helper’s real behavior.

## [2.6.0] - 2026-03-27

### Added

- Better project overviews and file-selection helpers for larger repos.
- Smarter focused-read selection across more file types.
- More feedback about token savings and session impact.

### Improved

- Large-project scans became more selective.
- Read modes became more practical for real coding tasks instead of raw file dumps.

## [2.5.0] - 2026-03-27

### Added

- `loopguard-ctx setup` for simpler agent onboarding.
- Broader MCP coverage across supported tools.
- More complete diagnostic checks through `loopguard-ctx doctor`.

### Improved

- Installation moved closer to a one-command workflow.
- Agent setup became easier to repeat across machines and projects.

## Earlier History

Earlier releases included the first MCP tools, shell helper flows, and session restore support.

For detailed line-by-line history before this cleanup, use git history:

```bash
git log -- packages/context-engine
```
