# High-assurance evidence policy

The public score answers whether a scanner identified the vulnerable and safe
controls. Qualification answers whether a product can also support authoritative
runtime, build, coverage, and clean-state claims.

Qualification requires, as applicable:

- vulnerable, safe, unknown, and unsupported observations;
- the category's declared evidence grade;
- exact runtime and framework coordinates;
- execution through the ordinary product path;
- `FINAL` publication and closed coverage;
- zero failed requests, unexpected facts, or unresolved obligations;
- verified sealed transcripts and authenticated readback;
- deterministic, hostile-input, and resource-budget controls; and
- independently governed held-out applications.

A tool that cannot produce these fields can still receive a complete public
accuracy score. Missing assurance evidence never becomes a clean or promoted
qualification result.

## Capability-gap controls

An expected `UNKNOWN` control does not claim that Rig sent a request to an
`/unknown` route. It verifies a narrower product behavior: when the runtime or
controller lacks the exact semantic capability named by the control, the signed
`node-capability-controls.json` artifact must retain that gap with the exact
reason code from `truth-v1.json`. The observation location
`qualification/runtime-capability-contract#<category>` names that signed
declaration; it is not application source code.

This distinction prevents a declared limitation from being presented as an
executed negative test. A real safe application behavior must instead produce a
`CLEAN` observation backed by closed route and sink coverage.
