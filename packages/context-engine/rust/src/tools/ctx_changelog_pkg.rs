pub fn handle(package: &str, registry: &str) -> String {
    let (url, fetch_cmd) = match registry {
        "crates" => (
            format!("https://crates.io/crates/{package}"),
            format!("cargo search {package} --limit 1"),
        ),
        "pypi" => (
            format!("https://pypi.org/pypi/{package}/json"),
            format!("curl -sL 'https://pypi.org/pypi/{package}/json' | jq '.info.description' | head -50"),
        ),
        _ => (
            format!("https://registry.npmjs.org/{package}"),
            format!("npm view {package} changelog --json 2>/dev/null || npm view {package} description"),
        ),
    };
    format!(
        "ctx_changelog_pkg — package changelog fetch\n\
         Package:  {package}\n\
         Registry: {registry}\n\
         URL:      {url}\n\n\
         Fetch changelog with:\n\
           ctx_shell(\"{fetch_cmd}\")"
    )
}
