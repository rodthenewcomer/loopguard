pub fn handle(action: &str, path: &str, line: i64, new_name: Option<&str>) -> String {
    let content = std::fs::read_to_string(path).unwrap_or_default();
    let line_content = content
        .lines()
        .nth((line - 1).max(0) as usize)
        .unwrap_or("");
    let new_name_str = new_name.unwrap_or("<new_name>");

    match action {
        "rename" => format!(
            "ctx_refactor rename — dry run\n\
             File:     {path}:{line}\n\
             Line:     {line_content}\n\
             New name: {new_name_str}\n\n\
             LSP-powered rename not yet connected.\n\
             Use ctx_rename(old_name='...', new_name='{new_name_str}', path='.') for a codebase-wide rename."
        ),
        "extract" => format!(
            "ctx_refactor extract — dry run\n\
             File:  {path}:{line}\n\
             Line:  {line_content}\n\n\
             LSP extract-function not yet connected.\n\
             Manually: select lines to extract, create new function, replace with call."
        ),
        "inline" => format!(
            "ctx_refactor inline — dry run\n\
             File:  {path}:{line}\n\
             Line:  {line_content}\n\n\
             LSP inline not yet connected.\n\
             Manually: find usages with ctx_references, replace each call site with the function body."
        ),
        _ => format!("ctx_refactor — unknown action '{action}'. Use: rename, extract, inline"),
    }
}
