export type Command = "validate" | "still" | "render" | "doctor" | "probe";
export const parseOptions = (args: string[]) => {
  const [command, input, ...rest] = args;
  if (!["validate", "still", "render", "doctor", "probe"].includes(command)) throw new Error("Usage: video <validate|still|render> <project.json> [--canvas=vertical|square|landscape] [--frame=N] [--out=file] [--log=verbose]; video doctor; video probe <media>");
  if (command !== "doctor" && (!input || input.startsWith("--"))) throw new Error("An input file is required.");
  if (command === "doctor" && input) throw new Error("doctor takes no arguments.");
  const flags: Record<string, string> = {};
  const allowed = command === "still" ? ["canvas", "frame", "out", "log"] : command === "render" ? ["canvas", "out", "log"] : command === "validate" ? ["canvas"] : [];
  for (const arg of rest) {
    const separator = arg.indexOf("=");
    if (!arg.startsWith("--") || separator < 3) throw new Error(`Expected --name=value, got ${arg}`);
    const key = arg.slice(2, separator);
    const value = arg.slice(separator + 1);
    if (!allowed.includes(key)) throw new Error(`Unsupported flag --${key} for ${command}`);
    if (!value || key in flags) throw new Error(`Empty or repeated --${key}`);
    flags[key] = value;
  }
  if (flags.canvas && !["vertical", "square", "landscape"].includes(flags.canvas)) throw new Error("Invalid --canvas");
  if (flags.log && !["verbose", "info", "warn", "error"].includes(flags.log)) throw new Error("Invalid --log");
  if (flags.frame && !/^\d+$/.test(flags.frame)) throw new Error("--frame must be a nonnegative integer");
  const frame = Number(flags.frame ?? 0);
  if (!Number.isSafeInteger(frame)) throw new Error("--frame is too large");
  return {command: command as Command, input, flags, frame};
};
