export type Command = "validate" | "still" | "render" | "doctor" | "probe" | "prepare" | "studio" | "plan";
const COMMANDS: Command[] = ["validate", "still", "render", "doctor", "probe", "prepare", "studio", "plan"];
const VALUE_FLAGS: Record<Command, string[]> = {
  plan: ["canvas", "direction", "out"],
  still: ["canvas", "frame", "out", "log"],
  render: ["canvas", "out", "log"],
  validate: ["canvas"],
  prepare: [],
  studio: ["canvas", "port"],
  doctor: [],
  probe: [],
};
/** Flags written bare (`--check`), meaning true. */
const SWITCH_FLAGS: Record<Command, string[]> = {
  plan: [],
  prepare: ["check", "accept-changes"],
  studio: ["no-open"],
  still: [], render: [], validate: [], doctor: [], probe: [],
};

export const parseOptions = (args: string[]) => {
  const [command, input, ...rest] = args as [Command, string, ...string[]];
  if (!COMMANDS.includes(command)) throw new Error("Usage: video <validate|still|render|prepare|studio|plan> <project.json> [--canvas=vertical|square|landscape]; video plan <project.json> [--direction=direction.json] [--out=review-plan.json]; video still <project.json> [--frame=N] [--out=file.png]; video render <project.json> [--out=file.mp4]; video prepare <project.json> [--check] [--accept-changes]; video doctor; video probe <media>");
  if (command !== "doctor" && (!input || input.startsWith("--"))) throw new Error("An input file is required.");
  if (command === "doctor" && input) throw new Error("doctor takes no arguments.");
  const flags: Record<string, string> = {};
  for (const arg of rest) {
    if (!arg.startsWith("--")) throw new Error(`Expected --name=value, got ${arg}`);
    const separator = arg.indexOf("=");
    if (separator === -1) {
      const key = arg.slice(2);
      if (!SWITCH_FLAGS[command].includes(key)) throw new Error(`Unsupported flag --${key} for ${command}`);
      if (key in flags) throw new Error(`Repeated --${key}`);
      flags[key] = "true";
      continue;
    }
    if (separator < 3) throw new Error(`Expected --name=value, got ${arg}`);
    const key = arg.slice(2, separator);
    const value = arg.slice(separator + 1);
    if (!VALUE_FLAGS[command].includes(key)) throw new Error(`Unsupported flag --${key} for ${command}`);
    if (!value || key in flags) throw new Error(`Empty or repeated --${key}`);
    flags[key] = value;
  }
  if (flags.canvas && !["vertical", "square", "landscape"].includes(flags.canvas)) throw new Error("Invalid --canvas");
  if (flags.log && !["verbose", "info", "warn", "error"].includes(flags.log)) throw new Error("Invalid --log");
  if (flags.port && !/^\d{2,5}$/.test(flags.port)) throw new Error("--port must be a number");
  if (flags.frame && !/^\d+$/.test(flags.frame)) throw new Error("--frame must be a nonnegative integer");
  if (flags.check && flags["accept-changes"]) throw new Error("--check is read-only; it cannot be combined with --accept-changes");
  const frame = Number(flags.frame ?? 0);
  if (!Number.isSafeInteger(frame)) throw new Error("--frame is too large");
  return {command, input, flags, frame};
};
