pub fn handle(query: &str, limit: usize) -> String {
    let encoded: String = query
        .chars()
        .map(|c| if c == ' ' { '+' } else { c })
        .collect();
    format!(
        "ctx_search_web — web search with compressed results\n\
         Query: {query}\n\
         Limit: {limit}\n\n\
         Live web search not yet enabled. Alternatives:\n\
           ctx_shell(\"curl -sL 'https://lite.duckduckgo.com/lite/?q={encoded}' | grep -o '<a[^>]*>[^<]*</a>' | head -20\")\n\
           ctx_shell(\"curl -sG 'https://api.duckduckgo.com/' --data-urlencode 'q={query}' -d 'format=json' | jq '.RelatedTopics[:{limit}]'\")"
    )
}
