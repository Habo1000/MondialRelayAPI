"use client";

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { parsePointRelais, formatDayLabel } from "@/lib/parse";
import { daysOfWeek } from "@/lib/days";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map({ results }: { results: any }) {
  return (
    <div className="relative h-full min-h-[420px] overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[500] flex items-start justify-between p-4 md:p-5">
        <div className="rounded-2xl border border-white/60 bg-white/88 px-4 py-3 shadow-[0_14px_38px_rgba(56,24,32,0.16)] backdrop-blur-md">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--text-muted)]">
            Carte
          </p>
          <h2 className="mt-1 text-lg font-semibold tracking-tight">
            Vue géographique
          </h2>
        </div>
      </div>

      <MapContainer
        center={[48.8566, 2.3522] as [number, number]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {results &&
          results?.["PointsRelais"]?.children.map(
            (result: any, index: number) => {
              const pointRelais = parsePointRelais(
                result["PointRelais_Details"],
              );

              console.log(pointRelais);

              return (
                <Marker
                  key={index}
                  position={[
                    pointRelais.location.lat,
                    pointRelais.location.lng,
                  ]}
                  icon={defaultIcon}
                >
                  <Popup>
                    <div className="map-popup">
                      <h3>{pointRelais.name}</h3>
                      <p>{pointRelais.address}</p>
                      {Object.entries(pointRelais.hours).map(
                        ([day, schedule]) => {
                          return (
                            <div key={day}>
                              {daysOfWeek[day] ?? day} :{" "}
                              {formatDayLabel(schedule)}
                            </div>
                          );
                        },
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            },
          )}
      </MapContainer>
    </div>
  );
}
