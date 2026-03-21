## [Server] Set missing JSON Content-Type header in selected API handlers

### Description
This PR adds missing `Content-Type: application/json` response headers in specific server handlers that return JSON payloads or JSON-oriented responses.

Without this header, clients may receive default content types (for example, `text/plain` or `text/html`), which can break content negotiation and JSON parsing expectations.

### Scope
Only the handlers requested in the issue were updated.

#### Updated handlers
- `SaveConnection`
- `GetConnections`
- `GetConnectionByID`
- `DeleteConnection`
- `UserHandler`
- `SaveUserCredential`
- `UpdateUserCredential`
- `DeleteUserCredential`

### Files changed
- `server/handlers/connections_handlers.go`
- `server/handlers/credentials_handlers.go`
- `server/handlers/user_handler.go`

### What changed
Added:
- `w.Header().Set("Content-Type", "application/json")`

Placed before response writes in the handlers listed above.

### Why this change
- Ensures API responses are explicitly typed as JSON.
- Improves compatibility for API clients that rely on `Content-Type` for response handling.
- Avoids default Go HTTP content-type behavior causing ambiguous response parsing.

### Non-goals / intentionally not changed
- No business logic changes.
- No route changes.
- No payload/schema changes.
- No broad refactor across unrelated handlers.

### Testing
Executed:
- `go test ./server/handlers/...`

Result:
- Pass

### Notes on test files
- No existing tests currently target these exact eight handlers.
- Since this PR is a header-only behavioral correction with no logic changes, no test files were modified in this change.

### Checklist
- [x] Added JSON `Content-Type` header to all requested handlers
- [x] Kept changes minimal and scoped
- [x] Verified handler package tests pass
- [x] Avoided unrelated code changes
