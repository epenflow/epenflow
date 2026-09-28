import type { JSONValue } from "es-toolkit/types";
import { difference, intersection, isEqual, isPlainObject, union } from "es-toolkit";
import type { System } from "#/system/types.ts";

function toJSONValue(value: unknown): JSONValue {
  if (typeof value === "function") {
    return `[Function ${value.name || "anonymous"}]`;
  }
  if (typeof value === "undefined") {
    return "[undefined]";
  }

  if (isPlainObject(value)) {
    const isReact = "$$typeof" in value || ("_payload" in value && "_init" in value);

    if (isReact) {
      return "[React Component]";
    }
  }
  return value as JSONValue;
}

export function fieldChanges(
  before: object,
  after: object,
  prefix = "",
): System.Devtools.FieldChange[] {
  const a = before as Record<string, JSONValue>;
  const b = after as Record<string, JSONValue>;
  const changes: System.Devtools.FieldChange[] = [];

  for (const key of union(Object.keys(a), Object.keys(b))) {
    const from = a[key];
    const to = b[key];

    if (Object.is(from, to)) continue;

    const path = prefix ? `${prefix}.${key}` : key;

    const fromValue = toJSONValue(from);
    const toValue = toJSONValue(to);

    if (fromValue === "[React Component]" && toValue === "[React Component]") continue;

    if (
      isPlainObject(from) &&
      isPlainObject(to) &&
      fromValue !== "[React Component]" &&
      toValue !== "[React Component]"
    ) {
      changes.push(...fieldChanges(from, to, path));
    } else {
      changes.push({ path, from: fromValue, to: toValue });
    }

    // if (isPlainObject(from) && isPlainObject(to)) {
    //   const isReactElement = "$$typeof" in from || "$$typeof" in to;
    //   if (isReactElement) {
    //     changes.push({ path, from, to });
    //   } else {
    //     changes.push(...fieldChanges(from, to, path));
    //   }
    // } else {
    //   changes.push({ path, from, to });
    // }
  }

  return changes;
}

export function diff(
  before: System.Process.Store,
  after: System.Process.Store,
): System.Devtools.Diff {
  const beforeIds = Object.keys(before.processes);
  const afterIds = Object.keys(after.processes);

  const changed = intersection(afterIds, beforeIds).flatMap(
    (pid): System.Devtools.Diff["changed"] => {
      const prev = before.processes[pid];
      const next = after.processes[pid];

      if (!prev || !next || prev === next) return [];

      const fields = fieldChanges(prev, next);

      return fields.length > 0 ? [{ pid, fields }] : [];
    },
  );

  return {
    pid: before.pid === after.pid ? null : { from: before.pid, to: after.pid },
    orders: !isEqual(before.orders, after.orders),
    added: difference(afterIds, beforeIds),
    removed: difference(beforeIds, afterIds),
    changed,
  };
}
