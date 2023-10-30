import arg from "../vendor/arg.cjs";

const args = {
  "--help": Boolean,
  "-h": "--help",

  "--verbose": arg.COUNT,
  "-v": "--verbose",

  "--flake": String,
  "-f": "--flake",

  "--major": Boolean,
  "-M": "--major",

  "--dry-run": Boolean,
  "-d": "--dry-run",

  "--init": Boolean,
  "-i": "--init",
};

export default args;
