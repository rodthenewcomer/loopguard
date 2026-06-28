pub fn handle(id: &str) -> String {
    let clean_id = id.trim_start_matches("arXiv:").trim_start_matches("arxiv:");
    let abs_url = format!("https://arxiv.org/abs/{clean_id}");
    let pdf_url = format!("https://arxiv.org/pdf/{clean_id}");
    format!(
        "ctx_arxiv — academic paper fetch\n\
         ID:  {clean_id}\n\
         Abstract: {abs_url}\n\
         PDF:      {pdf_url}\n\n\
         Fetch abstract with:\n\
           ctx_shell(\"curl -sL 'https://export.arxiv.org/abs/{clean_id}' | grep -A5 'Abstract'\")\n\
         or ctx_url_read(url='{abs_url}') once network is enabled."
    )
}
