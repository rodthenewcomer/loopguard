pub fn handle(diff: &str, path: Option<&str>) -> String {
    let len = diff.len();
    let lines = diff.lines().count();
    let adds = diff
        .lines()
        .filter(|l| l.starts_with('+') && !l.starts_with("+++"))
        .count();
    let dels = diff
        .lines()
        .filter(|l| l.starts_with('-') && !l.starts_with("---"))
        .count();
    let target = path.unwrap_or("<inferred from diff header>");

    format!(
        "ctx_diff_apply — patch application\n\
         Target: {target}\n\
         Diff:   {len} chars, {lines} lines (+{adds} -{dels})\n\n\
         To apply:\n\
           ctx_shell(\"patch -p1 < /tmp/patch.diff\")\n\
         Or write diff to file first:\n\
           Write('/tmp/patch.diff', diff_content)\n\
           ctx_shell(\"git apply /tmp/patch.diff\")\n\n\
         Preview (first 10 lines of diff):\n{}",
        diff.lines().take(10).collect::<Vec<_>>().join("\n")
    )
}
