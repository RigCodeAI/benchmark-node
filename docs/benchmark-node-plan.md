# BenchmarkNode qualification plan

BenchmarkNode is the public, independent accuracy authority for Node.js support.
Its locked denominator contains 40 categories and four controls per category.

Qualification proceeds in this order:

1. close all vulnerable, safe, unknown, and unsupported controls on Koa 3;
2. repeat framework discovery and instrumentation on Koa 2 and native ESM;
3. qualify NestJS 10 and 11 on Express and Fastify;
4. qualify Aurelia 1 and 2 browser-to-backend journeys;
5. repeat the matrix on Node 22, 24, and 26;
6. pass three independently governed held-out applications; and
7. publish signed, reproducible artifacts for the exact matrix.

No single passing coordinate qualifies the family. Missing framework hooks,
unsupported package behavior, partial traffic, failed requests, or missing
evidence keep the result out of promotion.
