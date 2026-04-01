class LoopguardCtx < Formula
  desc "Token compression layer for AI engineering — MCP server, shell hook, Context Continuity Protocol"
  homepage "https://loopguard.vercel.app"
  version "2.6.0"

  on_macos do
    on_arm do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-aarch64-apple-darwin.tar.gz"
      sha256 "PLACEHOLDER_AARCH64_APPLE_DARWIN_SHA256"
    end
    on_intel do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-x86_64-apple-darwin.tar.gz"
      sha256 "PLACEHOLDER_X86_64_APPLE_DARWIN_SHA256"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-aarch64-unknown-linux-musl.tar.gz"
      sha256 "PLACEHOLDER_AARCH64_LINUX_SHA256"
    end
    on_intel do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-x86_64-unknown-linux-musl.tar.gz"
      sha256 "PLACEHOLDER_X86_64_LINUX_SHA256"
    end
  end

  license "MIT"

  def install
    bin.install "loopguard-ctx"
  end

  def post_install
    ohai "loopguard-ctx installed! Run setup for your AI agent:"
    ohai "  loopguard-ctx setup --agent=claude   # Claude Code"
    ohai "  loopguard-ctx setup --agent=cursor   # Cursor"
    ohai "  loopguard-ctx setup --agent=gemini   # Gemini CLI"
    ohai "  loopguard-ctx setup                  # All agents + shell aliases"
  end

  test do
    assert_match "loopguard-ctx", shell_output("#{bin}/loopguard-ctx --version")
  end
end
