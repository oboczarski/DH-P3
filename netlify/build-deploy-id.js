/**
 * Netlify build helper.
 *
 * Goal: ensure every deploy gets a unique "build id" that the Service Worker can
 * use to version caches. This makes re-deploys reliably invalidate ALL cached
 * app assets (HTML/JS/CSS/images/fonts) for clients on their next load.
 *
 * This file runs during Netlify builds via `netlify.toml` and writes:
 *   DH_P2.53/sw-build-id.js
 */

const fs = require('fs');
const path = require('path');

const publishDir = path.join(__dirname, '..', 'DH_P2.53');
const outFile = path.join(publishDir, 'sw-build-id.js');

// Netlify provides a unique deploy id per deploy/re-deploy.
// Fallbacks are for local/dev builds (no Netlify environment variables).
const deployId =
  process.env.DEPLOY_ID
  || process.env.DEPLOYMENT_ID
  || process.env.COMMIT_REF
  || 'local-dev';

const generatedAtIso = new Date().toISOString();

const contents = `// AUTO-GENERATED at deploy time by netlify/build-deploy-id.js
// Used by DH_P2.53/service-worker.js to version caches per deploy.
// deployId: ${deployId}
// generatedAt: ${generatedAtIso}
self.__DH_SW_BUILD_ID = ${JSON.stringify(deployId)};
`;

fs.mkdirSync(publishDir, { recursive: true });
fs.writeFileSync(outFile, contents, 'utf8');
console.log(`[netlify] wrote ${path.relative(process.cwd(), outFile)} (deployId=${deployId})`);

