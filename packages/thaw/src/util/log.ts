import littlelog, {
  configure,
  LogLevel,
  parseLogLevelNumber,
} from "../vendor/littlelog.cjs";
import arg from "../vendor/arg.cjs";
import rootArgs from "./args";

const args = arg(rootArgs, {
  permissive: true,
});

if (args["--verbose"]) {
  const level =
    args["--verbose"] > 2
      ? LogLevel.Trace
      : parseLogLevelNumber(args["--verbose"]);

  configure({
    level,
  });
}

export default littlelog.child("Thaw");
