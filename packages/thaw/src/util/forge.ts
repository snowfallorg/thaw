import * as github from "./forges/github";
import semver from "semver";
import log from "./log";
import kleur from "../vendor/kleur.cjs";

export async function getTargetUpgrade(input, major, init) {
  let current: string | null = null;
  let protocol: string | null = null;

  if (input.ref) {
    current = input.ref;
    protocol = `${input.type}:`;
  } else {
    const url = new URL(input.url);

    current = url.searchParams.get("ref");
    protocol = url.protocol;
  }

  if (!current && init) {
    current = "v0.0.0";
  }

  if (!current || !semver.valid(semver.clean(current))) {
    return null;
  }

  let versions = [];

  switch (protocol) {
    default:
      log.warn(
        `Protocol ${kleur.bold(
          protocol.replace(/:$/, ""),
        )} is not currently supported...`,
      );
      return null;
    case "github:":
      versions = await github.fetchVersions(input);
      break;
  }

  const next = versions.reduce((latest, version) => {
    const kind = semver.diff(semver.clean(latest), semver.clean(version));

    if (
      semver.gt(semver.clean(version), semver.clean(latest)) &&
      (kind !== "major" || major || init)
    ) {
      return version;
    } else {
      return latest;
    }
  }, current);

  if (next === current) {
    return null;
  }

  return next;
}
