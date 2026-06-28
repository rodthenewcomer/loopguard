pub fn handle(path: &str, line: i64, col: i64) -> String {
    let content = std::fs::read_to_string(path).unwrap_or_default();
    let line_content = content
        .lines()
        .nth((line - 1).max(0) as usize)
        .unwrap_or("");
    let col_usize = col.max(0) as usize;
    let word_start = line_content[..col_usize.min(line_content.len())]
        .rfind(|c: char| !c.is_alphanumeric() && c != '_')
        .map(|i| i + 1)
        .unwrap_or(0);
    let word_end = line_content[col_usize.min(line_content.len())..]
        .find(|c: char| !c.is_alphanumeric() && c != '_')
        .map(|i| i + col_usize.min(line_content.len()))
        .unwrap_or(line_content.len());
    let symbol = &line_content[word_start..word_end.min(line_content.len())];

    format!(
        "ctx_hover — type info at position\n\
         File:   {path}:{line}:{col}\n\
         Line:   {line_content}\n\
         Symbol: {symbol}\n\n\
         LSP hover not yet connected. Use:\n\
           ctx_references(symbol='{symbol}', path='.')\n\
         to find all usages and infer the type from context."
    )
}
