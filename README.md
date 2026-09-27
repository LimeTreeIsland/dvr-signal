# DVR Signal

**Washington Vocational Rehabilitation Process Watch**

Independent civic-tech project comparing Washington DVR's intended process with
anonymous participant experiences, practical procedural tools, and aggregate data.
The design can be adapted to other states using separately reviewed authorities.

**Status: foundation specifications.** The website, participant tools, survey,
data pipeline, and deployment are not yet implemented. Legal seed records are
disabled pending complete review. This project is independent of DVR and DSHS.

## Start here

| Specification | Purpose |
| --- | --- |
| [Agent instructions](AGENTS.md) | Boundaries for contributors and coding agents |
| [Project](docs/PROJECT.md) | Phase 1 scope, milestones, acceptance criteria |
| [Architecture](docs/ARCHITECTURE.md) | Shared tool engine and data separation |
| [Legal baseline](docs/LEGAL-BASELINE.md) | Healthy process and source verification |
| [Procedural rules](docs/PROCEDURAL-RULES.md) | Triggers, exceptions, calculation safety |
| [Data dictionary](docs/DATA-DICTIONARY.md) | Survey fields and metric definitions |
| [Privacy model](docs/PRIVACY-MODEL.md) | Minimal collection and public release controls |
| [Design system](docs/DESIGN-SYSTEM.md) | Brand, colors, typography, accessibility |
| [Tool safety](docs/TOOL-SAFETY.md) | Participant-facing behavior and release gates |
| [GitHub permissions](docs/GITHUB-PERMISSIONS.md) | Implemented safeguards and owner settings |
| [Build backlog](docs/BACKLOG.md) | Small, ordered implementation tasks |

## Planned participant experience

1. Understand the healthy process: application → eligibility → assessment → IPE
   → services → employment → closure, with conditional branches and review loops.
2. Use Pathway Navigator, Records Router, Accommodation Builder, Written Decision
   + Deadline Checker, or Challenge a DVR Decision.
3. Optionally complete a separate anonymous 3–5 minute survey.
4. View privacy-reviewed aggregate results with sample limitations and sources.

No individual report automatically establishes a legal violation. A voluntary
sample cannot establish statewide prevalence. Small public cells are suppressed.

## Repository layout and validation

`docs/` contains the specifications; `data/washington/` the authority and rule
seeds; `tools/` five tool definitions; `schemas/` their contracts; `src/` future
application code; `tests/` future behavior tests; `.github/` review and CI files.

Structured `.yaml` files deliberately use the JSON subset of YAML 1.2 so the
foundation can validate without installing dependencies. Preserve that format
until an approved parser/schema migration changes the validator and CI together.

Run with Node.js 22 or later:

```sh
node scripts/validate-foundation.mjs
```

The foundation check validates required files, seed contracts, references, disabled
rule status, and workflow safeguards. It does not establish legal correctness,
anonymity, or application accessibility.

## Contributing and licensing

Read [CONTRIBUTING.md](CONTRIBUTING.md) and [SECURITY.md](SECURITY.md).
Public issues are for software and methodology, never personal case intake.

The existing [MIT license](LICENSE) covers project software and its associated
documentation. It does not authorize disclosure of participant information or
license third-party material. No participant dataset is distributed here. Any
future public dataset or separate content license requires an explicit decision.
