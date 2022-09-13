import { loadAuthorizedKeys, writeAuthorizedKeys } from "./authorizedKeys";
import { loadGithubPublicKeys } from "./loadPublicKeys";

async function evaluate(
  promisedKeys: Promise<string[]> | string[]
): Promise<void> {
  const [authorizedKeys, keys] = await Promise.all([
    loadAuthorizedKeys(),
    promisedKeys,
  ]);
  const newKeys = [...new Set([...authorizedKeys, ...keys])];
  await writeAuthorizedKeys(newKeys);
}

async function main() {
  const log = console.log;
  const [source, blob] = process.argv.slice(2);

  let keys: Promise<string[]> | void;

  switch (source?.toLowerCase()) {
    case "github":
    case "gh":
      keys = loadGithubPublicKeys(blob);
      console.log("Loading keys from GitHub...");
      break;

    default:
      log("Usage:");
      log("\tssh-import-id github|gh <username>");
      return;
  }

  await evaluate(keys);

  console.log(`Saved ${(await keys)?.length ?? 0} keys`);
}

if (require.main === module) {
  main();
}
