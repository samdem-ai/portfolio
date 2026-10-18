"use client";

import { useEffect, useState } from "react";

const format = () =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Algiers", hour: "2-digit", minute: "2-digit" }).format(new Date());

/** Current time in Algiers, rendered after mount so server and client HTML match. */
export function LocalTime() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the clock only exists in the browser
    setTime(format());
    const id = window.setInterval(() => setTime(format()), 20_000);
    return () => window.clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{time ?? "--:--"} GMT+1</span>;
}
