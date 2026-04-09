# Login Screen - Page Override

> Inherits all rules from MASTER.md. Only deviations listed here.

## Layout Override

The login screen is a standalone view — no sidebar, no header.

```
+--------------------------------------------------------------+
|                                                              |
|                                                              |
|              +--- Login Card (400px max) ---+                |
|              | [App Logo]                   |                |
|              | RDAdmin                      |                |
|              |                              |                |
|              | Username  [_______________]  |                |
|              | Password  [_______________]  |                |
|              |                              |                |
|              | [        Log In        ]     |                |
|              |                              |                |
|              | (error message area)         |                |
|              +------------------------------+                |
|                                                              |
|              v0.0.1 — Rivendell Admin                        |
+--------------------------------------------------------------+
```

- Full viewport, centered
- Background: `--bg-primary`
- Card: `--bg-secondary` background, `--border-default` border, 12px radius
- Card shadow: subtle (0 4px 24px rgba(0,0,0,0.4))
- Max width: 400px

## Interaction Override

- Auto-focus username field on load
- Enter key submits form
- Error message: slides in below button area, `--status-error` text
- Login button: disabled during authentication (shows spinner)
- Failed login: shake animation on card (150ms, 3 cycles), then error message

## Error States

| Error | Message | Behavior |
|-------|---------|----------|
| Invalid credentials | "Login Failed — invalid username or password" | Shake + red error text |
| Insufficient privileges | "Insufficient Privileges — admin access required" | Error text, no retry |
| Database unreachable | "Cannot connect to database" | Error text + retry button |
