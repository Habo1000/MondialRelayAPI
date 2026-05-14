// ============================================================
//  Types
// ============================================================

export type TimeRange = { open: string; close: string };

export type DaySchedule = {
  closed: boolean;
  morning: TimeRange | null;
  afternoon: TimeRange | null;
};

export type WeekSchedule = {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
};

export type PointRelais = {
  status: string; // STAT - "0" = OK
  num: string; // identifiant unique du point relais
  name: string; // ex: "TABAC LE GAMBETTA"
  address: string; // ligne principale d'adresse
  addressComplement?: string;
  postalCode: string;
  city: string;
  country: string; // code ISO ex: "FR"
  location: { lat: number; lng: number };
  activityType: string;
  nace: string; // code NACE de l'activité
  distance: number; // en mètres
  photoUrl?: string;
  mapUrl?: string;
  hours: WeekSchedule;
};

// ============================================================
//  Helpers
// ============================================================

/**
 * Le SOAP→JSON casté donne `children: [{ Key: { content: "..." } }, ...]`
 * On reconvertit ça en objet plat: { Key: { content: "..." }, ... }
 */
function flattenChildren(children: unknown[]): Record<string, any> {
  return children.reduce<Record<string, any>>((acc, item) => {
    if (item && typeof item === "object") {
      const [key, value] = Object.entries(item)[0] ?? [];
      if (key) acc[key] = value;
    }
    return acc;
  }, {});
}

/** "0930" -> "09:30" */
function formatTime(hhmm: string): string {
  if (!hhmm || hhmm.length !== 4) return "00:00";
  return `${hhmm.slice(0, 2)}:${hhmm.slice(2)}`;
}

/**
 * Parse un noeud Horaires_Xxx.
 * Le tableau contient toujours 4 strings: [ouv. matin, ferm. matin, ouv. aprem, ferm. aprem]
 * "0000" sur une plage = pas d'ouverture sur cette plage.
 * Tous "0000" = fermé toute la journée.
 */
function parseDaySchedule(node: any): DaySchedule {
  const times: string[] = (node?.children ?? []).map(
    (c: any) => c?.string?.content ?? "0000",
  );

  // Padding défensif au cas où l'API renverrait moins de 4 entrées
  while (times.length < 4) times.push("0000");

  const [oM, cM, oA, cA] = times;
  const isClosed = times.every((t) => t === "0000");

  if (isClosed) {
    return { closed: true, morning: null, afternoon: null };
  }

  const morning =
    oM !== "0000" || cM !== "0000"
      ? { open: formatTime(oM), close: formatTime(cM) }
      : null;

  const afternoon =
    oA !== "0000" || cA !== "0000"
      ? { open: formatTime(oA), close: formatTime(cA) }
      : null;

  return { closed: false, morning, afternoon };
}

// ============================================================
//  Parser principal
// ============================================================

export function parsePointRelais(raw: any): PointRelais {
  const root = raw?.PointRelais_Details ?? raw;
  const data = flattenChildren(root.children ?? []);

  const get = (key: string): string | undefined => data[key]?.content;

  return {
    status: get("STAT") ?? "",
    num: get("Num") ?? "",
    name: get("LgAdr1") ?? "",
    address: get("LgAdr3") ?? "",
    addressComplement: get("LgAdr2") || get("LgAdr4") || undefined,
    postalCode: get("CP") ?? "",
    city: get("Ville") ?? "",
    country: get("Pays") ?? "",
    location: {
      lat: parseFloat(get("Latitude") ?? "0"),
      lng: parseFloat(get("Longitude") ?? "0"),
    },
    activityType: get("TypeActivite") ?? "",
    nace: get("NACE") ?? "",
    distance: parseInt(get("Distance") ?? "0", 10),
    photoUrl: get("URL_Photo"),
    mapUrl: get("URL_Plan"),
    hours: {
      monday: parseDaySchedule(data.Horaires_Lundi),
      tuesday: parseDaySchedule(data.Horaires_Mardi),
      wednesday: parseDaySchedule(data.Horaires_Mercredi),
      thursday: parseDaySchedule(data.Horaires_Jeudi),
      friday: parseDaySchedule(data.Horaires_Vendredi),
      saturday: parseDaySchedule(data.Horaires_Samedi),
      sunday: parseDaySchedule(data.Horaires_Dimanche),
    },
  };
}

// ============================================================
//  Bonus: helper d'affichage (utile pour ta UI Next.js)
// ============================================================

export function formatDayLabel(day: DaySchedule): string {
  if (day.closed) return "Fermé";
  const parts: string[] = [];
  if (day.morning) parts.push(`${day.morning.open} - ${day.morning.close}`);
  if (day.afternoon)
    parts.push(`${day.afternoon.open} - ${day.afternoon.close}`);
  return parts.join(" / ");
}
