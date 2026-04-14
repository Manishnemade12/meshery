## [Server] Add lifecycle pruning for database reset archives

**Notes for Reviewers**

- This PR fixes #

**[Signed commits](https://github.com/meshery/meshery/blob/master/CONTRIBUTING.md#signing-off-on-commits-developer-certificate-of-origin)**
- [x] Yes, I signed my commits.

### Description
This change adds archive lifecycle management to `ResetSystemDatabase` in `server/handlers/database_handlers.go`.

Previously, each reset created a new backup in `.archive/` and retained all backups forever, which could cause unbounded disk growth.

Now, after a successful reset response, an asynchronous pruning routine runs and:
- removes archive files older than 30 days,
- keeps at most the 5 newest backup files,
- logs each archive file that was successfully removed,
- logs warnings when prune operations fail (non-fatal).

### Implementation Summary
- Added retention constants:
  - `maxDatabaseArchives = 5`
  - `maxDatabaseArchiveAge = 30 * 24 * time.Hour`
  - `databaseArchiveDirectory = ".archive"`
- Added `pruneDatabaseBackups(archiveDir string, maxBackups int, maxAge time.Duration)` helper.
- Triggered pruning asynchronously at the end of `ResetSystemDatabase`:
  - `go h.pruneDatabaseBackups(...)`
- Pruning filters only Meshery SQL backups (`mesherydb*.sql`), then applies age and count retention.

### Why async?
Pruning is intentionally asynchronous so reset API latency remains unaffected while cleanup still happens automatically after each reset.

### Scope
- File changed: `server/handlers/database_handlers.go`
- Diff line count: `73` lines changed

### Validation
- Editor diagnostics for changed file: no errors.
- Runtime/compile verification command was prepared (`go test ./handlers -run '^$'`) but terminal execution was interrupted in this session.

### Risk / Compatibility
- Backward compatible.
- Only affects local archive cleanup behavior after successful DB reset.
- If archive directory read/delete fails, handler does not fail reset and logs warning instead.
