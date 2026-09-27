# Design system

Name: **DVR Signal**
Descriptor: **Washington Vocational Rehabilitation Process Watch**

Accessible civic-tech; investigative, hopeful, nonpartisan and factual. Avoid
sensational language, official agency impersonation, flashing warnings and visual
claims that an unverified participant report proves a legal violation.

## Tokens

| Token | Hex | Role |
| --- | --- | --- |
| ink | #121417 | Primary text / dark surface |
| paper | #F4F2ED | Light background |
| healthy | #48C7B6 | Teal healthy/legal baseline |
| neutral | #56616B | Slate neutral/unknown |
| warning | #FF7A00 | Neon orange delay/warning |
| review | #FFD84D | Yellow needs review |
| serious | #FF5C42 | Coral-red serious breakdown |

Use ink text on bright status fills. Do not assume white text on neon fills or
bright text on paper meets contrast. Check each real foreground/background pair.
Every status needs a label and distinguishable icon/pattern; color alone is never
meaning. A serious breakdown can describe an evidenced process failure without
asserting a legal finding; the evidence label remains visible.

Typography: Space Grotesk for headings and display numbers; Inter for body,
navigation and forms; system sans-serif fallbacks. Self-host fonts when practical
and retain their license files. Prefer 16–18px body text, 1.5–1.7 line height,
short paragraphs, 65–75 character reading width and generous section spacing.

Use a 4px-based spacing scale: 4, 8, 12, 16, 24, 32, 48, 64. Prefer at least 44px
interactive targets. Phone-first single-column forms; short steps, explicit labels,
visible progress, back/edit controls, no forced session timeout.

## Baseline and overlay

Keep the teal reference visible whenever a case path is displayed. Align stages,
show uncertainty and branching, include a legend, and offer an equivalent ordered
text/table view. Label synthetic examples prominently. Distinguish source type,
evidence quality and process status instead of overloading a single color.

Do not use exaggerated chart scales or hide denominators. Show collection maturity
and suppression plainly. Unknown is slate; it is not success, zero, or failure.

## Release review

Target WCAG 2.2 AA. Verify keyboard operation; semantic headings/landmarks;
screen-reader labels and errors; visible focus; reduced motion; 200% text zoom and
400%/320-CSS-pixel reflow; mobile use; contrast; and large touch targets. Offer
static representations for interactions. No claim of accessibility conformance
until the implemented flows have been tested.
