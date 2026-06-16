"use client";

import DashboardChat from "@/components/DashboardChat";

export default function WorkerChat() {
  return (
    <div className="p-6 md:p-10 h-[calc(100vh-96px)]">
      <DashboardChat variant="worker" />
    </div>
  );
}
