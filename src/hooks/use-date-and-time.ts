import React from "react";

const useDateAndTime = (interval?: number) => {
  const [date, setDate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), interval || 1000);

    return () => clearInterval(timer);
  }, [setDate, interval]);
  return date;
};

export default useDateAndTime;
