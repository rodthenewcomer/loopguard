pub fn handle(query: &str, limit: usize) -> String {
    format!(
        "ctx_graph_query - graph search\n\
         Query: {query}\n\
         Limit: {limit}\n\n\
         Query planning is available as an early-access stub. Use ctx_graph for current \
         file-level graph extraction and ctx_knowledge for persisted facts."
    )
}
