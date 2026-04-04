class LoopguardCtx < Formula
  desc "Local helper for focused reads, MCP setup, and smaller shell output"
  homepage "https://loopguard.vercel.app"
  version "0.1.12"

  on_macos do
    on_arm do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-aarch64-apple-darwin.tar.gz"
      sha256 "2516cdf528d2fa67a72a3adf3cb1079f5156547b0231a373d684d5e789cddab4"
    end
    on_intel do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-x86_64-apple-darwin.tar.gz"
      sha256 "ed488d6b066d77b80f5c701ee0fd5588a701bfd23d9e80e2735688ce919754c8"
    end
  end

  on_linux do
    on_arm do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-aarch64-unknown-linux-gnu.tar.gz"
      sha256 "4b7c788e6fea6bb14debbe6b0c51782c313c7da0ba019d1a20d5315044cb6a51"
    end
    on_intel do
      url "https://github.com/rodthenewcomer/loopguard/releases/download/v#{version}/loopguard-ctx-x86_64-unknown-linux-musl.tar.gz"
      sha256 "939489d0222e56ac56996fe561717055923d0392ca53c661523f3070eccf5eb1"
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
