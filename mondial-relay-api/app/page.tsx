"use client";

// import Image from "next/image";
import SearchForm from "@/components/SearchForm";
import NavResults from "@/components/NavResults";

import { useState } from "react";
import dynamic from "next/dynamic";
import { convertXML } from "simple-xml-to-json";

const Map = dynamic(() => import("@/components/Map"), {
  loading: () => <p>A map is loading</p>,
  ssr: false,
});

export default function Home() {
  const [results, setResults] = useState("");

  const jsonResults = convertXML(results);

  const polishedResults =
    jsonResults?.["soap:Envelope"]?.children?.[0]?.["soap:Body"]
      ?.children?.[0]?.["WSI4_PointRelais_RechercheResponse"]?.children?.[0]?.[
      "WSI4_PointRelais_RechercheResult"
    ]?.children[0] || [];

  return (
    <main className="app-shell min-h-screen p-4 md:p-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1500px] flex-col gap-5 rounded-[2rem] border border-white/50 bg-white/20 p-4 md:p-6">
        <section className="glass-panel overflow-hidden rounded-[1.75rem]">
          <div className="flex flex-col gap-8 px-5 py-6 md:px-8 md:py-8">
            <div className="flex flex-col gap-3">
              <span className="w-fit rounded-full border border-[var(--border)] bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
                Mondial Relay Finder
              </span>
              <div className="max-w-3xl">
                <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  Trouve un point relais rapidement, dans une interface plus
                  claire.
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--text-muted)] md:text-base">
                  Recherche par pays, ville et code postal, puis explore les
                  relais trouvés dans la liste et sur la carte.
                </p>
              </div>
            </div>
            <SearchForm setResults={setResults} />
          </div>
        </section>

        <section className="grid flex-1 gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
          <div className="glass-panel min-h-[420px] overflow-hidden rounded-[1.75rem]">
            <NavResults results={polishedResults} />
          </div>
          <div className="glass-panel min-h-[420px] overflow-hidden rounded-[1.75rem]">
            <Map results={polishedResults} />
          </div>
        </section>
      </div>
    </main>
  );
}
