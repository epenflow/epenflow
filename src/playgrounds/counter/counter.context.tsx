import { createContext, use, useCallback, useMemo, useState, type PropsWithChildren } from "react";

interface CounterContextValues {
  count: number;
  onIncrement: VoidFunction;
  onDecrement: VoidFunction;
}

const CounterContext = createContext<CounterContextValues | null>(null);

export function useCounter() {
  const context = use(CounterContext);
  if (!context) {
    throw new Error("useCounter() should be used within <CounterProvider/>");
  }

  return context;
}

export default function CounterProvider({ children }: PropsWithChildren) {
  const [count, setCount] = useState<number>(0);

  const onIncrement = useCallback(() => setCount((prev) => prev + 1), []);
  const onDecrement = useCallback(() => setCount((prev) => prev - 1), []);

  const context: CounterContextValues = useMemo(
    () => ({ count, onIncrement, onDecrement }),
    [count, onIncrement, onDecrement],
  );

  return <CounterContext value={context}>{children}</CounterContext>;
}
