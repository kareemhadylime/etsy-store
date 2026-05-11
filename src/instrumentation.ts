/**
 * Next.js instrumentation hook. Runs once per server-instance boot,
 * before the server starts handling requests.
 *
 * Per Next.js 16 docs (node_modules/next/dist/docs/01-app/03-api-reference/
 * 03-file-conventions/instrumentation.md): the file must live in the
 * project root or inside `src/`. The exported `register()` function
 * is invoked once at server initiation and must complete before the
 * server is ready to handle requests.
 *
 * What we do here: validate the env-var schema. Missing boot-severity
 * vars throw and prevent the server from starting (better than a
 * cryptic crash on first request). Missing prod/feature vars log
 * warnings/info so an operator can scan one log line and verify the
 * deploy's integration footprint.
 */

import { validateEnvAtBoot } from './lib/env'

export function register() {
  validateEnvAtBoot()
}
