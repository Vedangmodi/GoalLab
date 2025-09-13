import React from "react";

export default function JourneyBreakdown({ weeks = 12 }) {
  const items = [];
  for (let i = 1; i <= weeks; i++) {
    items.push({ title: `Week ${i}`, objective: `Objective for week ${i}` });
  }

  return (
    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((it, idx) => (
        <div key={idx} className="p-3 border rounded bg-gray-50">
          <div className="font-semibold">{it.title}</div>
          <div className="text-sm text-gray-600 mt-1">{it.objective}</div>
        </div>
      ))}
    </div>
  );
}
