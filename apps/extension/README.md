# LoopGuard

LoopGuard is a VS Code extension that helps you notice repeated error loops and copy a smaller, focused context snapshot from the current file.

## Features

- Watches VS Code diagnostics and highlights repeated error patterns
- Tracks loop count and elapsed time for the current session
- Adds a status bar entry and dashboard command for quick inspection
- Copies focused context from the active editor
- Uses a local TypeScript fallback when the optional native helper is unavailable

## Commands

- `LoopGuard: Show Dashboard`
- `LoopGuard: Reset Session`
- `LoopGuard: Toggle Detection`
- `LoopGuard: Copy Optimized Context`
- `LoopGuard: Sign In`
- `LoopGuard: Sign Out`

## Settings

- `loopguard.sensitivity`
- `loopguard.enableContextEngine`
- `loopguard.enableNotifications`
- `loopguard.loopThreshold`

## Sign In

Sign-in is optional. If you sign in, LoopGuard can sync anonymized session metrics to your account dashboard.

## Privacy

LoopGuard processes diagnostics and context locally in the extension. When sync is enabled, only anonymized session metrics are sent to the backend. Source code and file contents are not uploaded.

## Resources

- Homepage: [loopguard.vercel.app](https://loopguard.vercel.app)
- Issues: [github.com/rodthenewcomer/loopguard/issues](https://github.com/rodthenewcomer/loopguard/issues)
- Repository: [github.com/rodthenewcomer/loopguard](https://github.com/rodthenewcomer/loopguard)
