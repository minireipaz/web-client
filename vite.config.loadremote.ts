import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { Redis } from "@upstash/redis";

export default defineConfig(async ({ mode }: any) => {
  let envs = loadEnv(mode, process.cwd(), "");
  const remoteEnvs = await getRemoteEnvs(envs);
  envs = { ...remoteEnvs };
  console.log("ENVS=" + JSON.stringify(envs));
  return {
    define: envs,
    plugins: [react()],
  };
});

async function getRemoteEnvs(envs: Record<string, string>) {
  const newEnvs = await getFromVault(envs);
  const envsVITE = setupOnlyEnvsVITE(newEnvs);
  return envsVITE;
}

async function getFromVault(envs: Record<string, string>) {
  const redis = new Redis({
    url: envs["VAULT_REST_URL"],
    token: envs["VAULT_REST_TOKEN"],
  });

  const data = (await redis.get(envs["VAULT_KEY_FRONTEND_ENVS"])) as string;
  const parsedEnvs = parseEnvString(data);
  return parsedEnvs;
}

function parseEnvString(envString: string): Record<string, string> {
  const lines = envString.split("\n");
  const envs: Record<string, string> = {};

  for (const line of lines) {
    if (!line.trim()) continue;
    if (line.startsWith("#")) continue;

    const [key, value] = line.split("=");
    envs[key.trim()] = value ? value.trim() : "";
  }

  return envs;
}

function setupOnlyEnvsVITE(envs: Record<string, string>) {
  let envsOnlyVITE: Record<string, string> = {};
  for (let key in envs) {
    if (key.includes("VITE_")) {
      envsOnlyVITE[key] = envs[key];
    }
  }
  return envsOnlyVITE;
}
