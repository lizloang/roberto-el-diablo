export type ShowStatus = "scheduled" | "soldOut" | "postponed" | "cancelled";

export type Show = {
  id: string;
  // ISO, para el atributo dateTime de <time>.
  date: string;
  // Fecha ya formateada en la hora de Monterrey: "08", "nov", "2026".
  day: string;
  month: string;
  year: string;
  // "8 de noviembre de 2026", para lectores de pantalla.
  longDate: string;
  time: string;
  eventName: string | null;
  venue: string;
  city: string;
  // Estado de la república, abreviado (N.L.). Opcional.
  state: string | null;
  country: string;
  status: ShowStatus;
  statusLabel: string;
  ticketUrl: string | null;
  notes: string | null;
};
