import { execSync } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";

const outDir = path.resolve("out");
const enterpriseHold = path.resolve(".build-enterprise-out");
const communityBasePath = "/docs/magistrala/community";
const communitySegments = communityBasePath.split("/").filter(Boolean);

function run(command, env = {}) {
  execSync(command, { stdio: "inherit", env: { ...process.env, ...env } });
}

async function clean(target) {
  await fs.rm(target, { recursive: true, force: true });
}

// 1. Build Enterprise Edition — default env, identical to today's single build.
await clean(".next");
await clean(outDir);
run("next build", { NEXT_PUBLIC_EDITION: "enterprise" });
run("node scripts/nest-static-export.mjs");
await clean(enterpriseHold);
await fs.rename(outDir, enterpriseHold);

// 2. Build Community Edition into a fresh out/, nested under its own base path.
await clean(".next");
await clean(outDir);
run("next build", {
  NEXT_PUBLIC_EDITION: "community",
  NEXT_PUBLIC_BASE_PATH: communityBasePath,
  NEXT_PUBLIC_BASE_URL: `https://absmach.eu${communityBasePath}`,
});
run("node scripts/nest-static-export.mjs", {
  NEXT_PUBLIC_BASE_PATH: communityBasePath,
});

// 3. Merge Community's nested output into the Enterprise tree — no filename
// collisions are possible since Enterprise has no existing "community" section.
const communityNested = path.join(outDir, ...communitySegments);
const communityTarget = path.join(enterpriseHold, ...communitySegments);
await clean(communityTarget);
await fs.cp(communityNested, communityTarget, { recursive: true });

// 4. Finalize the combined output as out/
await clean(outDir);
await fs.rename(enterpriseHold, outDir);

console.log(
  `Built Enterprise (out/docs/magistrala) + Community (out${communityBasePath}) editions`,
);
