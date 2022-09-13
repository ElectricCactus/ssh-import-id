import { httpRequest } from "../modules/mini-http/src/client";

export async function loadGithubPublicKeys(
  username: string
): Promise<string[]> {
  const response = await httpRequest(
    new URL(`https://api.github.com/users/${username}/keys`),
    "GET",
    undefined,
    {
      "user-agent": "node",
    }
  );

  if (response.status != 200) {
    throw new Error(`Failed to load keys for ${username}`);
  }

  if ("body" in response && typeof response.body === "string") {
    const keys = JSON.parse(response.body) as { id: number; key: string }[];
    return keys.map(({ key }) => key);
  }

  return [];
}
