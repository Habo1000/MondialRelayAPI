"use server";

import crypto from "crypto";

const ENDPOINT = process.env.MR_ENDPOINT!;
const ENSEIGNE = process.env.MR_ENSEIGNE!;
const PRIVATE_KEY = process.env.MR_PRIVATE_KEY!;

type SearchParams = {
  Enseigne: string;
  Pays: string;
  NumPointRelais: string;
  Ville: string;
  CP: string;
  Latitude: string;
  Longitude: string;
  Taille: string;
  Poids: string;
  Action: string;
  DelaiEnvoi: string;
  RayonRecherche: string;
  TypeActivite: string;
  NACE: string;
  NombreResultats: string;
};

function computeSignature(params: SearchParams, privateKey: string) {
  const concat =
    [
      params.Enseigne,
      params.Pays,
      params.NumPointRelais,
      params.Ville,
      params.CP,
      params.Latitude,
      params.Longitude,
      params.Taille,
      params.Poids,
      params.Action,
      params.DelaiEnvoi,
      params.RayonRecherche,
      params.TypeActivite,
      params.NACE,
      params.NombreResultats,
    ]
      .map((v) => v ?? "")
      .join("") + privateKey;

  return crypto.createHash("md5").update(concat).digest("hex").toUpperCase();
}

export async function searchPointRelais(formData: FormData) {
  const cp = formData.get("cp") as string;
  const country = formData.get("country") as string;
  const limit = parseInt(formData.get("limit") as string, 10);
  const city = formData.get("city") as string;

  const security = computeSignature(
    {
      Enseigne: ENSEIGNE,
      Pays: country,
      NumPointRelais: "",
      Ville: city,
      CP: cp,
      Latitude: "",
      Longitude: "",
      Taille: "",
      Poids: "",
      Action: "",
      DelaiEnvoi: "0",
      RayonRecherche: "20",
      TypeActivite: "",
      NACE: "",
      NombreResultats: limit.toString(),
    },
    PRIVATE_KEY,
  );

  try {
    const response = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "text/xml; charset=utf-8",
        SOAPAction:
          "http://www.mondialrelay.fr/Web_Services.asmx/WSI4_PointRelais_Recherche",
      },
      body: `<?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
              <soap:Body>
                <WSI4_PointRelais_Recherche xmlns="http://www.mondialrelay.fr/webservice/">
                  <Enseigne>${ENSEIGNE}</Enseigne>
                  <Pays>${country}</Pays>
                  <NumPointRelais></NumPointRelais>
                  <Ville>${city}</Ville>
                  <CP>${cp}</CP>
                  <Latitude></Latitude>
                  <Longitude></Longitude>
                  <Taille></Taille>
                  <Poids></Poids>
                  <Action></Action>
                  <DelaiEnvoi>0</DelaiEnvoi>
                  <RayonRecherche>20</RayonRecherche>
                  <TypeActivite></TypeActivite>
                  <NACE></NACE>
                  <NombreResultats>${limit}</NombreResultats>
                  <Security>${security}</Security>
                 </WSI4_PointRelais_Recherche>
              </soap:Body>
          </soap:Envelope>`,
    });

    const data = await response.text();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
