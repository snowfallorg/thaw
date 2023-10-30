import kleur from "./vendor/kleur.cjs";

export default function help() {
  // prettier-ignore
  const message = `
${kleur.bold().blue("thaw")}

${kleur.bold("DESCRIPTION")}

  Upgrade Nix Flake inputs using SemVer.

${kleur.bold("USAGE")}

  ${kleur.dim("$")} ${kleur.bold("thaw")} [options] [...inputs]

${kleur.bold("OPTIONS")}

  --flake, -f               Choose a flake other than the current directory
  --major, -M               Allow major version upgrades
  --init, -i                Initialize inputs to the latest version
  --dry-run, -d             Show available upgrades without applying them

  --help, -h                Show this help message
  --verbose                 Increase logging verbosity, up to 3 times
	`;

  console.log(message);
}
