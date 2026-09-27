# GitHub permissions and repository safeguards

Prepared 2026-09-26. This document distinguishes configuration files from actual
GitHub account settings. The repository is public and owned by LimeTreeIsland.
At inspection, `main` was unprotected and the repository rulesets list was empty.
The initial write attempt returned HTTP 403, “Resource not accessible by
integration.” The account authorization page then showed the app was not
installed on any accessible account. The owner installed it before this retry.
Administrative-settings writes are unavailable through the connected tools.

## Connection setup and troubleshooting

Account authorization and app installation are separate. If the authorization
page says the app is not installed, install ChatGPT Codex Connector on the
repository owner's account before looking for Configure.

In GitHub Settings → Applications → Installed GitHub Apps, inspect the app used
by the ChatGPT/Codex connection. Scope its repository selection to `dvr-signal`.
Approve any requested permission update needed for Contents read/write and
Workflows write (for `.github/workflows/` files). Installers cannot invent scopes
the app developer has not requested. If the installed app does not offer write
access, a supported write-capable connection or a local authenticated git client
is required. Do not paste tokens into chat. Reconnect if needed after the grant.

This is distinct from the read-only GITHUB_TOKEN used inside CI. Do not increase
CI permissions to try to repair the external connection's HTTP 403.

Reference: [GitHub App permissions](https://docs.github.com/en/apps/creating-github-apps/registering-a-github-app/choosing-permissions-for-a-github-app).

## Included in the foundation

| Control | Effect | Limit |
| --- | --- | --- |
| `.github/CODEOWNERS` | Assigns LimeTreeIsland review ownership | Does not grant access or enforce review by itself |
| Foundation workflow | `contents: read`; other token permissions unspecified/none | Does not alter repository-wide workflow defaults |
| Pinned checkout and no persisted credentials | Limits dependency drift and checkout credential persistence | Review future action updates |
| Pull-request template | Records source/privacy/test impact | Checklist is not automated legal review |
| Ignore patterns | Excludes common credentials and private-data locations | Cannot prevent force-adds or remove history |
| SECURITY / CONTRIBUTING / AGENTS | Defines workflow and handling expectations | Human/agent instructions are not access controls |

All foundation files use normal non-executable git mode 100644. Read permission
for a public repo is public; file modes cannot make a folder in it private.
No collaborator or organization access has been granted by this commit.

## Owner settings to apply in GitHub

Open repository **Settings → Rules → Rulesets** and create an active branch
ruleset for `main`: require a pull request; require the successful `Foundation
validation` check after it has run; require resolved conversations; block force
pushes and deletion. Add application checks when they exist.

For this single-owner repository, start with **zero required approvals** unless
a second trusted reviewer exists. GitHub does not let an author approve their own
PR; requiring sole CODEOWNER approval can block owner-authored work. The owner
still reviews and merges PRs. When a second maintainer is added, consider one
required approval and required code-owner review. Document any owner bypass
explicitly; do not grant automated actors a bypass merely to avoid review.

Under **Settings → Actions → General**, select read-only workflow permissions
and leave “Allow GitHub Actions to create and approve pull requests” disabled.
Retain approval for outside-contributor workflows. Do not run untrusted PR code
with secrets or a write token; avoid `pull_request_target` for code execution.

Under **Settings → Collaborators**, keep access limited to people who need write
access. A personal repository does not offer the full organization role matrix.
Public contributors can submit fork PRs without collaborator access. Select only
this repository for coding-app installation access where supported. Do not grant
organization-wide or account-wide access just to build this project.

Cloudflare access and production deployment are not configured. When connecting,
scope access to this repository; keep production secrets away from preview PRs
and all private survey stores. No token is needed in this repository's foundation
workflow. Enable available secret scanning/push protection in repository security
settings and verify its coverage rather than assuming it is active.

## Official references

- [Code owners](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners)
- [Workflow token permissions](https://docs.github.com/en/actions/tutorials/authenticate-with-github_token)
- [Protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

The first two references were checked during preparation. Recheck the current UI
and plan availability when applying administrative settings. Do not report these
settings as enforced until their live state has been verified.
