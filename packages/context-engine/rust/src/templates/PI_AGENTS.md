# loopguard-ctx — Token Optimization for Pi

loopguard-ctx is installed as a Pi Package. All bash, read, grep, find, and ls calls are automatically routed through loopguard-ctx for 60-90% token savings.

## How it works

- **bash** commands are compressed via loopguard-ctx's 90+ shell patterns
- **read** uses smart mode selection (full/map/signatures) based on file type and size
- **grep** results are grouped and compressed
- **find** and **ls** output is compressed and .gitignore-aware

## No manual prefixing needed

The Pi extension handles routing automatically. Just use tools normally:

```bash
git status          # automatically compressed
cargo test          # automatically compressed
kubectl get pods    # automatically compressed
```

## Project knowledge

Store and retrieve facts, decisions, and conventions any agent can access:

```text
ctx_knowledge(action="set", key="arch.auth", value="Supabase JWT + RLS", category="architecture")
ctx_knowledge(action="get", key="arch.auth")
ctx_knowledge(action="list")
```

## Multi-agent handoff

Hand off work between agents (Pi, Claude Code, Cursor, Codex):

```text
ctx_agent(action="write", agent="pi", label="current-task", content="stopped at auth middleware line 84")
ctx_agent(action="read",  label="current-task")
ctx_agent(action="list")
```

## Checking status

Use `/loopguard-ctx` in Pi to verify which binary is active.

## Dashboard

Run `loopguard-ctx dashboard` in a separate terminal to see real-time token savings.
