class LoopguardCtx < Formula
  desc "Local MCP context server for focused reads, shell compression, and AI agent handoff"
  homepage "https://loopguard.vercel.app"
  version "2.8.1"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-aarch64-apple-darwin.tar.gz"
      sha256 "44827043d5591ca1fae895784a4b1f10302da768798b8327e70b7a717983296f"
    end
    on_intel do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-x86_64-apple-darwin.tar.gz"
      sha256 "b693c5ef38f21ff594750b137a1155099847ff3ae7e7ffb899bbdabfe24ba435"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-aarch64-unknown-linux-gnu.tar.gz"
      sha256 "a937497969ccf6596ba24d5a4d9bafdbd1237c6a021f3ea4f3c77448b10726bd"
    end
    on_intel do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-x86_64-unknown-linux-musl.tar.gz"
      sha256 "8075dda1ac3c4a04482956c408b8f3353defecc1685e1060904e849e0e6f79a5"
    end
  end

  def install
    bin.install "loopguard-ctx"
  end

  test do
    assert_match version.to_s, shell_output("#{bin}/loopguard-ctx --version")
    assert_match "ctx_read", shell_output("#{bin}/loopguard-ctx --help")
  end
end
