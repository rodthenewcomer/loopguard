pub fn handle(base: &str, head: &str) -> String {
    format!(
        "ctx_graph_diff - compare graph snapshots\n\
         Base: {base}\n\
         Head: {head}\n\n\
         Snapshot diffing is an early-access tool. Use ctx_graph(action=\"summary\") \
         and ctx_graph_query to inspect the current graph state."
    )
}
