import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { EOL, homedir } from "node:os";
import { inspect } from "node:util";

export function getAuthorizedKeysPath(): string {
  return join(homedir(), ".ssh", "authorized_keys");
}

export function isError(err: unknown): err is NodeJS.ErrnoException {
  return err instanceof Error;
}

export async function loadAuthorizedKeys(): Promise<string[]> {
  try {
    const path = getAuthorizedKeysPath();
    const file = await readFile(path, "utf8");
    return file.split(EOL);
  } catch (err) {
    if (isError(err) && err.code !== "ENOENT") {
      throw new Error("Failed to load authorized_keys");
    }
    return [];
  }
}

export async function writeAuthorizedKeys(keys: string[]): Promise<void> {
  try {
    const path = getAuthorizedKeysPath();
    await writeFile(path, keys.join(EOL) + EOL);
  } catch (err) {
    console.log("error", inspect(err));
  }
}

/* An example of an authorized_keys file:
# Comments allowed at start of line
ssh-rsa AAAAB3Nza...LiPk== user@example.net 
from="*.sales.example.net,!pc.sales.example.net" ssh-rsa AAAAB2...19Q== john@example.net
command="dump /home",no-pty,no-port-forwarding ssh-dss AAAAC3...51R== example.net
permitopen="192.0.2.1:80",permitopen="192.0.2.2:25" ssh-dss AAAAB5...21S==
ssh-rsa AAAA...==jane@example.net
zos-key-ring-label="KeyRingOwner/SSHAuthKeysRing uniq-ssh-rsa"
from="*.example.com",zos-key-ring-label="KeyRingOwner/SSHAuthKeysRing uniq-ssh-dsa"
*/
