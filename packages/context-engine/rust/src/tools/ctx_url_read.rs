pub fn handle(url: &str, mode: &str) -> String {
    format!(
        "ctx_url_read — fetch and compress URL content\n\
         URL:  {url}\n\
         Mode: {mode}\n\n\
         Network fetching not yet enabled. Use:\n\
           ctx_shell(\"curl -sL '{url}' | head -200\")\n\
         for raw fetch, or ctx_shell with wget/lynx for text extraction."
    )
}
