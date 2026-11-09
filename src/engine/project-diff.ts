export type ProjectChange = {path: string; before: unknown; after: unknown; allowed: boolean};

/** Compare parsed snapshots. Array positions remain significant; exact strings survive. */
export const compareProjectData = (before: unknown, after: unknown, allowedPaths: string[] = []): ProjectChange[] => {
  const changes: ProjectChange[] = [];
  const visit = (a: unknown, b: unknown, field: string) => {
    if (Object.is(a, b)) return;
    if (Array.isArray(a) && Array.isArray(b)) {
      for (let i = 0; i < Math.max(a.length, b.length); i++) visit(a[i], b[i], `${field}[${i}]`);
      return;
    }
    if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
      const old = a as Record<string, unknown>, next = b as Record<string, unknown>;
      for (const key of [...new Set([...Object.keys(old), ...Object.keys(next)])].sort()) visit(old[key], next[key], field ? `${field}.${key}` : key);
      return;
    }
    const allowed = allowedPaths.some((prefix) => field === prefix || field.startsWith(`${prefix}.`) || field.startsWith(`${prefix}[`));
    changes.push({path: field, before: a ?? null, after: b ?? null, allowed});
  };
  visit(before, after, "");
  return changes;
};
