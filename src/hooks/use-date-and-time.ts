import { useIsomorphicLayoutEffect } from "motion/react";
import React from "react";

const useDateAndTime = (interval?: number) => {
  const [date, setDate] = React.useState<Date>(new Date());

  useIsomorphicLayoutEffect(() => {
    const timer = setInterval(() => setDate(new Date()), interval || 1000);

    return () => clearInterval(timer);
  }, [setDate]);
  return date;
};

export default useDateAndTime;
