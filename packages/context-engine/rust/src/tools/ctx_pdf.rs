use std::path::Path;

pub fn handle(path: &str, pages: Option<&str>) -> String {
    let p = Path::new(path);
    if !p.exists() {
        return format!("ctx_pdf — file not found: {path}");
    }
    let size = std::fs::metadata(path).map(|m| m.len()).unwrap_or(0);
    let pages_str = pages.unwrap_or("all");
    format!(
        "ctx_pdf — local PDF reader\n\
         File:  {path}\n\
         Pages: {pages_str}\n\
         Size:  {size} bytes\n\n\
         PDF text extraction not yet enabled. Use:\n\
           ctx_shell(\"pdftotext '{path}' - | head -200\")\n\
         or install pdftotext (poppler-utils) for text extraction."
    )
}
