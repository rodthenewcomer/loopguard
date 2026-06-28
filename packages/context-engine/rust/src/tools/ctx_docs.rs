pub fn handle(package: &str, registry: &str, version: Option<&str>) -> String {
    let ver = version.unwrap_or("latest");
    let url = match registry {
        "crates" => format!("https://docs.rs/{package}/{ver}"),
        "pypi" => format!("https://pypi.org/project/{package}/{ver}/"),
        _ => format!("https://www.npmjs.com/package/{package}/v/{ver}"),
    };
    format!(
        "ctx_docs — package documentation lookup\n\
         Package:  {package}\n\
         Registry: {registry}\n\
         Version:  {ver}\n\
         URL:      {url}\n\n\
         Fetch docs with:\n\
           ctx_shell(\"curl -sL '{url}' | head -300\")\n\
         or ctx_url_read(url='{url}') once network is enabled."
    )
}
