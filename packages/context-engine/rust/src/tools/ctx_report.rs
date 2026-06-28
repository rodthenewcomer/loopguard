pub fn handle(period: &str, format: &str) -> String {
    let wrapped = crate::tools::ctx_wrapped::handle(match period {
        "today" => "week",
        "month" => "month",
        "all" => "all",
        _ => "week",
    });

    if format == "compact" {
        let summary: String = wrapped.lines().take(8).collect::<Vec<_>>().join("\n");
        format!("ctx_report [{period}] (compact)\n{summary}")
    } else {
        format!("ctx_report [{period}]\n{wrapped}")
    }
}
