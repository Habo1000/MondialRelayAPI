import { parsePointRelais } from "@/lib/parse";
import Result from "./Result";

export default function NavResults({ results }: { results: any }) {
  return (
    <nav className="flex h-full flex-col">
      <div className="border-b border-[var(--border)] px-5 py-5 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
          Liste
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Résultats de recherche
        </h2>
        <p className="mt-1 text-sm text-[var(--text-muted)]">
          Parcours les points relais trouvés et compare rapidement les adresses.
        </p>
      </div>

      {results && Object.keys(results).length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="max-w-sm text-center">
            <p className="text-base font-medium">Aucun résultat trouvé.</p>
            <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
              Lance une recherche pour voir apparaître les points relais
              disponibles.
            </p>
          </div>
        </div>
      ) : (
        <ul className="result-scrollbar flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-5 md:py-5">
          {results?.["PointsRelais"]?.children.map(
            (result: any, index: number) => {
              const pointRelais = parsePointRelais(
                result["PointRelais_Details"],
              );

              return (
                <li key={index}>
                  <Result pointRelais={pointRelais} />
                </li>
              );
            },
          )}
        </ul>
      )}
    </nav>
  );
}
