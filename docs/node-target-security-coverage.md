# Node.js security coverage

## Locked coordinates

- Node.js 22.17.1, 22.23.2, 24.19.0, and 26.7.0;
- Koa 2.16.4 and 3.2.1 with `@koa/router` 14 and 15;
- CommonJS and native ESM;
- NestJS 10.4.22 and 11.2.1 with Express and Fastify;
- Aurelia 1.4.1 and 2.0.0-rc.2; and
- adapter family `node-v8-loader-v2`.

The exact dependency lockfiles are part of benchmark truth. A tool that does not
support one of these coordinates must report `UNSUPPORTED`; it cannot infer a
clean result from missing observations.

## Shared categories

The 34 shared categories cover HTTP headers and output encoding; XSS and SSTI;
sensitive responses, outbound data, and logs; filesystem, process, SQL, NoSQL,
LDAP, XPath, XML, SSRF, redirect, and code execution; hashing, randomness,
deserialization, cookies, and resource exhaustion; plus authorization,
authentication, CSRF, tenant isolation, workflow, concurrency, and multi-service
behavior.

## Node-specific categories

- CWE-1321 generic prototype pollution;
- Node object-path prototype pollution;
- event-loop starvation;
- package lifecycle-script execution;
- JavaScript regex-engine denial of service; and
- VM context escape.

## Evidence ownership

Runtime categories require observed value flow, semantics, properties, or effects.
Authorization and stateful behavior require differential controller journeys.
Unknown semantics remain capability gaps. Unsupported coordinates remain explicit
and block a clean qualification result.

## Promotion proof

The public Koa application is category-complete. Framework integration fixtures
exercise Koa 2/3, CommonJS/ESM, NestJS 10/11 with Express/Fastify, and Aurelia
1/2. Rig's product CI runs the category denominator on every locked Node runtime
and the framework matrix separately. Promotion then requires independently
governed Koa, NestJS, and Aurelia evidence as described in
[qualification.md](qualification.md).
