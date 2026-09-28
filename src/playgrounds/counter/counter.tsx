import { useCounter } from "#/playgrounds/counter/counter.context.tsx";

export default function Counter() {
  const { count, onIncrement, onDecrement } = useCounter();

  return (
    <div className="bg-card text-card-foreground border-border w-full max-w-xs rounded-(--radius) border p-6 shadow-sm">
      <div className="flex flex-col items-center justify-center space-y-2 pb-6">
        <p className="text-muted-foreground text-sm font-medium">Current Count</p>
        <p className="text-5xl font-bold tracking-tighter">{count}</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onIncrement}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center rounded-[calc(var(--radius)-2px)] px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
          Increment Counter
        </button>
        <button
          onClick={onDecrement}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-ring inline-flex h-10 w-full items-center justify-center rounded-[calc(var(--radius)-2px)] px-4 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50">
          Decrement Counter
        </button>
      </div>
    </div>
  );
}
declare module "#/system/types.ts" {
  namespace System {
    interface Registries {
      Counter: {
        current: number;
      };
    }
  }
}
