'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// drops a site-wide heartbeat so /api/stats knows who's actually around.
// session id lives in sessionStorage — dies when the tab closes, never a cookie.

function sessionId(): string {
  try {
    const k = "btl_sid";
    let v = sessionStorage.getItem(k);
    if (!v) {
      // crypto.randomUUID is everywhere we care about; fall back just in case
      v = (crypto?.randomUUID?.() || `s-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`);
      sessionStorage.setItem(k, v);
    }
    return v;
  } catch {
    return "";
  }
}

export default function PresenceBeacon() {
  const pathname = usePathname();

  useEffect(() => {
    const sid = sessionId();
    if (!sid) return;

    let stopped = false;
    const ping = () => {
      // skip while the tab is hidden so background tabs don't count as "online"
      if (document.visibilityState === "hidden") return;
      fetch("/api/presence", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ sessionId: sid, path: pathname }),
        keepalive: true,
      }).catch(() => {});
    };

    ping();
    const id = window.setInterval(() => { if (!stopped) ping(); }, 20_000);
    const onVis = () => { if (document.visibilityState === "visible") ping(); };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stopped = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [pathname]);

  return null;
}
