"use client";

import { useState } from "react";
import { formatDayLabel, type PointRelais } from "@/lib/parse";
import { daysOfWeek } from "@/lib/days";

export default function Result({ pointRelais }: { pointRelais: PointRelais }) {
  const [isOpen, setIsOpen] = useState(false);

  const jourActuel = new Date()
    .toLocaleDateString("en-EN", {
      weekday: "long",
    })
    .toLowerCase();

  // if (pointRelais.num === "061247") {
  //   pointRelais.hours.saturday.closed = true;
  // }

  function colorPerDay() {
    const { hours } = pointRelais;

    const { closed } = hours[jourActuel as keyof typeof hours];

    return closed ? "border-red-500" : "border-green-500";
  }

  return (
    <article
      id={pointRelais.num}
      onClick={() => setIsOpen((prev) => !prev)}
      className={`cursor-pointer rounded-[1.4rem] border ${colorPerDay()} bg-[var(--surface-strong)] p-4 shadow-[0_16px_36px_rgba(73,31,40,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_44px_rgba(73,31,40,0.12)]`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-muted)]">
            Point relais
          </p>
          <h3 className="mt-1 text-base font-semibold leading-6">
            {pointRelais.name}
          </h3>
        </div>
        <span className="shrink-0 rounded-full bg-[#f7df96] px-3 py-1 text-xs font-semibold text-[#6b4312]">
          {pointRelais.distance ?? 0} m
        </span>
      </div>

      <div className="mt-4 space-y-2 text-sm text-[var(--text-muted)]">
        <p className="leading-6">
          {pointRelais.address}
          {pointRelais.addressComplement &&
            `, ${pointRelais.addressComplement}`}
        </p>
        <p className="font-medium text-[var(--foreground)]">
          {pointRelais.postalCode} {pointRelais.city} {pointRelais.country}
        </p>

        {isOpen && (
          <div>
            {Object.entries(pointRelais.hours).map(([day, schedule]) => (
              <div key={day}>
                {daysOfWeek[day] ?? day} : {formatDayLabel(schedule)}
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
