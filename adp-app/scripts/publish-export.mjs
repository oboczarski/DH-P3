import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const appDirectory = path.resolve(scriptDirectory, "..");
const exportDirectory = path.join(appDirectory, "out");
const dynastyHubDirectory = path.resolve(appDirectory, "../DH_P2.53");
const destinationDirectory = path.join(dynastyHubDirectory, "adp");

// Static export publisher: replace only DH_P2.53/adp with the newly generated
// Next.js output so the Vanilla site can serve the isolated dashboard at /adp/.
if (!destinationDirectory.startsWith(`${dynastyHubDirectory}${path.sep}`)) {
  throw new Error("Refusing to publish the ADP export outside DH_P2.53.");
}

await rm(destinationDirectory, { recursive: true, force: true });
await mkdir(destinationDirectory, { recursive: true });
await cp(exportDirectory, destinationDirectory, { recursive: true });

console.log(`Published the ADP static export to ${destinationDirectory}`);
