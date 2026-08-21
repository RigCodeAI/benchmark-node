# Held-out applications

Held-out applications are governed separately and are not stored in this public
development corpus. Promotion requires three distinct repository identities and
three distinct independent-truth digests. They must include Koa, NestJS, and
Aurelia, each must contain at least one vulnerable and one safe control, and
together they must close all 40 vulnerable and all 40 safe categories using the
same evidence contract.

ARL, Sivere, and benchmark implementers must not use held-out truth to tune models,
instrumentation, traffic, or expected results. Failures are classified and fixed
against general semantics before the held-out suite is rerun.
