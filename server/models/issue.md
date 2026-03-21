# [Feature] Add Missing Content-Type Header to Multiple API Response Handlers

## Description

Several API handlers write JSON response bodies using `json.NewEncoder(w).Encode()` or `json.Marshal()` + `w.Write()` but never set the `Content-Type: application/json` header. This means clients relying on content negotiation receive `text/plain` or the Go default `text/html`, making it harder for API consumers to programmatically process responses.

## Affected Handlers

| Handler | File | Line |
|---|---|---|
| `SaveConnection` | `connections_handlers.go` | 182 |
| `DeleteConnection` | `connections_handlers.go` | 600 |
| `GetConnectionByID` | `connections_handlers.go` | 362 |
| `GetConnections` | `connections_handlers.go` | 288 |
| `UserHandler` | `user_handler.go` | 19 |
| `SaveUserCredential` | `credentials_handlers.go` | 45 |
| `UpdateUserCredential` | `credentials_handlers.go` | 130 |
| `DeleteUserCredential` | `credentials_handlers.go` | 145 |

## Proposed Change

Add `w.Header().Set("Content-Type", "application/json")` before any `json.Encode` or `w.Write` calls in these handlers.

Example for `GetConnectionByID`:
```go
w.Header().Set("Content-Type", "application/json")
if err := json.NewEncoder(w).Encode(connection); err != nil {
```
