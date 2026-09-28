import { useState, useSyncExternalStore, type ComponentProps } from "react";

import { useSelector } from "@tanstack/react-store";

import { isError, isFunction, isUndefined } from "es-toolkit";
import { cn } from "cn";
import { cva, type VariantProps } from "class-variance-authority";
import type { System } from "#/system/types.ts";
import { store } from "#/system/process/store.ts";
import { identifier } from "#/system/process/identifier.ts";
import { recorder } from "#/system/process/devtools/recorder.ts";
import { diff } from "#/system/process/devtools/diff.ts";

const time = (date: number) =>
  new Date(date).toLocaleTimeString("id-ID", { hour12: false, fractionalSecondDigits: 3 });

const stringify = (value: unknown, space?: number): string => {
  const seen = new WeakSet<object>();

  try {
    return (
      JSON.stringify(
        value,
        (_, current: unknown) => {
          if (isUndefined(current)) return "__undefined__";
          if (isFunction(current)) return `[Function ${current.name || "anonymous"}]`;
          if (isError(current)) return `${current.name}: ${current.message}`;
          if (typeof current === "object" && current !== null) {
            if (seen.has(current)) return "[Repeated]";
            seen.add(current);
          }
          return current;
        },
        space,
      ) ?? "undefined"
    );
  } catch {
    return String(value);
  }
};

const restore = (snapshot: System.Process.Store) => {
  store.setState(() => snapshot);
  identifier.sync(Object.keys(snapshot.processes));
};

const badgeVariants = cva(
  "inline-flex items-center rounded-sm px-1.5 py-0.5 font-mono text-[10px] leading-none",
  {
    variants: {
      variant: {
        muted: "bg-muted text-muted-foreground",
        info: "bg-info/10 text-info-foreground",
        success: "bg-success/10 text-success-foreground",
        warning: "bg-warning/10 text-warning-foreground",
        destructive: "bg-destructive/10 text-destructive-foreground",
      },
    },
    defaultVariants: { variant: "muted" },
  },
);

function Badge({
  className,
  variant,
  ...props
}: ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={badgeVariants({ variant, className })} {...props} />;
}

function Button({ className, type = "button", ...props }: ComponentProps<"button">) {
  return (
    <button
      type={type}
      className={cn(
        "border-input bg-secondary text-secondary-foreground hover:bg-accent focus-visible:outline-ring rounded-md border px-2 py-1 text-xs transition-colors focus-visible:outline-2 disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

function Code({ children }: { children: unknown }) {
  return (
    <pre className="border-border bg-muted text-foreground scrollbar-thin overflow-auto rounded-md border p-2 font-mono text-[11px] leading-relaxed">
      {stringify(children, 2)}
    </pre>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex min-w-0 flex-col gap-1.5">
      <h4 className="text-muted-foreground text-xs font-medium">{title}</h4>
      {children}
    </section>
  );
}

function ActionsTab() {
  const { entries, paused } = useSyncExternalStore(
    recorder.subscribe,
    recorder.getSnapshot,
    recorder.getSnapshot,
  );

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [hideNoop, setHideNoop] = useState(false);

  const visible = hideNoop ? entries.filter((entry) => entry.changed) : entries;
  const selected = visible.find((entry) => entry.id === selectedId) ?? visible[0];

  return (
    <div className="grid h-full grid-cols-[minmax(240px,320px)_1fr]">
      <div className="border-border flex min-h-0 flex-col border-r">
        <div className="border-border flex flex-wrap items-center gap-1.5 border-b px-2 py-1.5">
          <span className="text-muted-foreground mr-auto text-xs">{visible.length} actions</span>
          <Button onClick={() => recorder.setPaused(!paused)}>{paused ? "Resume" : "Pause"}</Button>
          <Button onClick={() => setHideNoop((value) => !value)} aria-pressed={hideNoop}>
            {hideNoop ? "show no-op" : "hide no-op"}
          </Button>
          <Button onClick={recorder.clear}>Clear</Button>
        </div>

        <ul className="min-h-0 flex-1 scrollbar-thin overflow-auto">
          {visible.length === 0 && (
            <li className="text-muted-foreground p-3 text-xs">
              {paused ? "Recording paused." : "No actions have been recorded yet."}
            </li>
          )}
          {visible.map((entry) => {
            const args: readonly unknown[] = entry.args;

            return (
              <li key={entry.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(entry.id)}
                  className={cn(
                    "border-border hover:bg-accent flex w-full items-center gap-2 border-b px-2 py-1.5 text-left transition-colors",
                    selected?.id === entry.id && "bg-accent",
                  )}>
                  <span className="text-foreground font-mono text-xs font-medium">
                    {entry.name}
                  </span>
                  <span className="text-muted-foreground truncate font-mono text-[11px]">
                    ({args.map((arg) => stringify(arg)).join(", ")})
                  </span>
                  <span className="ml-auto flex shrink-0 items-center gap-1.5">
                    {entry.outcome.status === "error" && <Badge variant="destructive">error</Badge>}
                    {!entry.changed && <Badge>no-op</Badge>}
                    <span className="text-muted-foreground font-mono text-[10px]">
                      {time(entry.at)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="min-h-0 scrollbar-thin overflow-auto p-3">
        {selected ? <ActionDetail entry={selected} /> : null}
      </div>
    </div>
  );
}

function ActionDetail({ entry }: { entry: System.Devtools.Entry }) {
  const difference = diff(entry.before, entry.after);
  const args: readonly unknown[] = entry.args;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <h3 className="font-mono text-sm font-semibold">{entry.name}</h3>
        <Badge variant={entry.changed ? "success" : "muted"}>
          {entry.changed ? "state changes" : "without changes"}
        </Badge>
        <Badge>{entry.duration.toFixed(2)} ms</Badge>
        <div className="ml-auto flex gap-1.5">
          <Button
            title="Kembalikan state ke sebelum aksi ini (identifier PID ikut disinkronkan)"
            onClick={() => restore(entry.before)}>
            Restore before
          </Button>
          <Button
            title="Kembalikan state ke sesudah aksi ini (identifier PID ikut disinkronkan)"
            onClick={() => restore(entry.after)}>
            Restore after
          </Button>
        </div>
      </div>

      <Section title="Argumen">
        <Code>{args}</Code>
      </Section>

      <Section title={entry.outcome.status === "success" ? "Return value" : "Error"}>
        <Code>
          {entry.outcome.status === "success" ? entry.outcome.value : entry.outcome.error}
        </Code>
      </Section>

      <Section title="Diff">
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            {difference.pid && (
              <Badge variant="info">
                pid: {String(difference.pid.from)} → {String(difference.pid.to)}
              </Badge>
            )}
            {difference.orders && <Badge variant="info">orders changes</Badge>}
            {difference.added.map((pid) => (
              <Badge key={`+${pid}`} variant="success">
                + {pid}
              </Badge>
            ))}
            {difference.removed.map((pid) => (
              <Badge key={`-${pid}`} variant="destructive">
                − {pid}
              </Badge>
            ))}
            {!entry.changed && <span className="text-muted-foreground">Nothing changes</span>}
          </div>

          {difference.changed.map(({ pid, fields }) => (
            <div key={pid} className="border-border rounded-md border p-2">
              <Badge variant="warning">~ {pid}</Badge>
              <ul className="mt-1.5 flex flex-col gap-0.5 font-mono text-[11px]">
                {fields.map((field) => (
                  <li key={field.path}>
                    <span className="text-muted-foreground">{field.path}:</span>{" "}
                    {stringify(field.from)} → {stringify(field.to)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <div className="grid grid-cols-2 gap-3">
        <Section title="Before">
          <Code>{entry.before}</Code>
        </Section>
        <Section title="After">
          <Code>{entry.after}</Code>
        </Section>
      </div>
    </div>
  );
}

function StateTab() {
  const state = useSelector(store, (state) => state);

  return (
    <div className="h-full scrollbar-thin overflow-auto p-3">
      <Code>{state}</Code>
    </div>
  );
}

function ProcessesTab() {
  const state = useSelector(store, (state) => state);
  const pids = [...state.orders].reverse();

  return (
    <div className="h-full scrollbar-thin overflow-auto p-3">
      <div className="text-muted-foreground mb-3 flex items-center gap-2 text-xs">
        Focus:
        <Badge variant="info">{state.pid ?? "none"}</Badge>
        <span>· {pids.length} processes</span>
      </div>

      <ul className="flex flex-col gap-2">
        {pids.map((pid, index) => {
          const process = state.processes[pid];
          if (!process) return null;

          const { window } = process;
          const focused = state.pid === pid;

          return (
            <li
              key={pid}
              className={cn(
                "bg-card text-card-foreground rounded-lg border p-2.5",
                focused ? "border-ring" : "border-border",
              )}>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-medium">{pid}</span>
                <span className="text-muted-foreground text-[10px]">{process.title}</span>
                <span className="text-muted-foreground text-[10px]">
                  order #{pids.length - index}
                </span>
                <span className="ml-auto flex gap-1">
                  {focused && <Badge variant="info">focused</Badge>}
                  {window.minimized && <Badge variant="warning">minimized</Badge>}
                  {window.maximized && <Badge variant="success">maximized</Badge>}
                  {window.closed && <Badge variant="destructive">closed</Badge>}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap gap-1.5">
                <Button onClick={() => store.actions.focus(pid)}>Focus</Button>
                <Button onClick={() => store.actions.minimize(pid)}>Minimize</Button>
                <Button onClick={() => store.actions.maximize(pid)}>Maximize</Button>
                <Button
                  className="text-destructive-foreground"
                  onClick={() => store.actions.close(pid)}>
                  Close
                </Button>
                <Button
                  className="text-destructive-foreground"
                  onClick={() => store.actions.close(pid, true)}>
                  Force close
                </Button>
              </div>
            </li>
          );
        })}
        {pids.length === 0 && (
          <li className="text-muted-foreground text-xs">There is no process.</li>
        )}
      </ul>
    </div>
  );
}

const TABS: ReadonlyArray<{ id: System.Devtools.Tab; label: string }> = [
  { id: "actions", label: "Actions" },
  { id: "state", label: "State" },
  { id: "processes", label: "Processes" },
];

export function ProcessDevtoolsPanel() {
  const [tab, setTab] = useState<System.Devtools.Tab>("actions");

  return (
    <div className="bg-background text-foreground flex h-full min-h-0 flex-col font-sans">
      <div role="tablist" className="border-border flex gap-1 border-b px-2 pt-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "-mb-px rounded-t-md border-b-2 px-3 py-1.5 text-xs transition-colors",
              tab === t.id
                ? "border-primary text-foreground"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1">
        {tab === "actions" && <ActionsTab />}
        {tab === "state" && <StateTab />}
        {tab === "processes" && <ProcessesTab />}
      </div>
    </div>
  );
}
