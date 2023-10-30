import * as Sleet from "./vendor/sleet.mjs";
import arg from "./vendor/arg.cjs";
import kleur from "./vendor/kleur.cjs";
import rootArgs from "./util/args";
import log from "./util/log";
import todo from "./util/todo";
import { getFlakeInputs, upgradeFlakeInput } from "./util/nix";
import { getTargetUpgrade } from "./util/forge";
import help from "./help";
import * as Bun from "bun";
import path from "node:path";
import edit from "./util/edit";

const main = async () => {
  const args = arg(rootArgs, {
    permissive: true,
  });

  log.debug({ args });

  if (args["--help"]) {
    help();
    process.exit(0);
  }

  if (args["--dry-run"]) {
    log.info("Dry run enabled. No changes will be made.");
  }

  let flake: string =
    args["--flake"] ?? path.resolve(process.cwd(), "flake.nix");

  if (!path.isAbsolute(flake)) {
    flake = path.resolve(process.cwd(), flake);
  }

  if (!flake.endsWith("flake.nix")) {
    flake = path.join(flake, "flake.nix");
  }

  const inputs = await getFlakeInputs(flake);

  const names = args._.length > 0 ? args._ : Object.keys(inputs);

  for (const [name, input] of Object.entries(inputs)) {
    if (!names.includes(name)) {
      log.trace(kleur.dim(`Skipping input ${kleur.bold(name)}...`));
      continue;
    }

    log.trace(`Processing input ${kleur.bold().white(name)}...`);
    const target = await getTargetUpgrade(
      input,
      args["--major"],
      args["--init"],
    );

    if (target) {
      log.info(
        `Upgrading ${kleur.bold().white(name)} to ${kleur.bold(target)}`,
      );

      if (!args["--dry-run"]) {
        await upgradeFlakeInput(flake, input, target);
      }
    } else {
      log.info(
        kleur.dim(`No upgrade available for ${kleur.bold().white(name)}`),
      );
    }
  }
};

main().catch((error) => {
  log.error("An unexpected error occurred.");
  console.error(error);
});
