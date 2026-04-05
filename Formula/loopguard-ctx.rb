class LoopguardCtx < Formula
  desc "Local MCP context server for focused reads, shell compression, and AI agent handoff"
  homepage "https://loopguard.vercel.app"
  version "2.8.0"
  license "MIT"

  on_macos do
    on_arm do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-aarch64-apple-darwin.tar.gz"
      sha256 "PLACEHOLDER_AARCH64_APPLE"
    end
    on_intel do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-x86_64-apple-darwin.tar.gz"
      sha256 "PLACEHOLDER_X86_64_APPLE"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-aarch64-unknown-linux-gnu.tar.gz"
      sha256 "PLACEHOLDER_AARCH64_LINUX"
    end
    on_intel do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-x86_64-unknown-linux-musl.tar.gz"
      sha256 "PLACEHOLDER_X86_64_LINUX"
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
