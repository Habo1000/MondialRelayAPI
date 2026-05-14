"use client";
import { searchPointRelais } from "@/app/api/actions/actions";
import { z } from "zod";

export default function SearchForm({
  setResults,
}: {
  setResults: (results: any) => void;
}) {
  async function handleSubmit(formData: FormData) {
    const searchSchema = z.object({
      country: z.string(),
      city: z.string().optional(),
      cp: z
        .string()
        .min(5, "Le code postal doit comporter au moins 5 caractères"),
      limit: z.string(),
    });

    const validatedData = searchSchema.safeParse({
      cp: formData.get("cp") as string,
      country: formData.get("country") as string,
      city: formData.get("city") as string,
      limit: formData.get("limit") as string,
    });

    if (!validatedData.success) {
      alert(
        "Veuillez vérifier les champs du formulaire : " +
          validatedData.error.message,
      );
      return;
    }

    const results = await searchPointRelais(formData);

    if (!results) {
      alert(
        "Une erreur est survenue lors de la recherche. Veuillez réessayer.",
      );
      return;
    }

    setResults(results);
  }

  return (
    <form
      className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.1fr_1fr_180px_auto]"
      action={handleSubmit}
    >
      <select
        className="h-12 rounded-2xl border border-[var(--border)] bg-white/85 px-4 text-sm text-[var(--foreground)] shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[#a1173c]/15"
        name="country"
      >
        <option value="FR">France</option>
        <option value="BE">Belgique</option>
        <option value="ES">Espagne</option>
        <option value="IT">Italie</option>
        <option value="DE">Allemagne</option>
        <option value="LU">Luxembourg</option>
        <option value="PT">Portugal</option>
        <option value="PL">Pologne</option>
        <option value="NL">Pays-Bas</option>
      </select>
      <input
        type="text"
        placeholder="Ville"
        name="city"
        className="h-12 rounded-2xl border border-[var(--border)] bg-white/85 px-4 text-sm text-[var(--foreground)] shadow-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[#a1173c]/15"
      />
      <input
        type="text"
        placeholder="Code postal"
        name="cp"
        className="h-12 rounded-2xl border border-[var(--border)] bg-white/85 px-4 text-sm text-[var(--foreground)] shadow-sm outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[#a1173c]/15"
      />
      <select
        className="h-12 rounded-2xl border border-[var(--border)] bg-white/85 px-4 text-sm text-[var(--foreground)] shadow-sm outline-none transition focus:border-[var(--primary)] focus:ring-2 focus:ring-[#a1173c]/15"
        name="limit"
      >
        <option value="5">5 résultats</option>
        <option value="10">10 résultats</option>
        <option value="20">20 résultats</option>
      </select>
      <button className="h-12 rounded-2xl bg-[var(--primary)] px-6 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(161,23,60,0.28)] transition hover:bg-[var(--primary-hover)]">
        Rechercher
      </button>
    </form>
  );
}
