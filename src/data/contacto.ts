import type { RedSocialId } from "@/types/contact";

// Los datos del footer se editan en el Studio, en "Contacto y redes". Estos
// son los valores con los que arranca ese documento y los que usa el sitio
// mientras no esté publicado.

export const REDES: { id: RedSocialId; nombre: string }[] = [
  { id: "instagram", nombre: "Instagram" },
  { id: "facebook", nombre: "Facebook" },
  { id: "youtube", nombre: "YouTube" },
  { id: "tiktok", nombre: "TikTok" },
  { id: "spotify", nombre: "Spotify" },
];

// Misma forma que el documento "contactInfo" de Sanity.
export const contactoInicial = {
  phones: ["818 275 71 12", "812 651 63 97"],
  email: "robertoeldiablomx@gmail.com",
  mgmtCompany: "MGMT LUNAR MUSIC",
  mgmtContact: "Fernando Luna",
  mgmtPhone: "52 55 4477 5254",
  socials: {
    instagram: {
      handle: "@robertoeldiablo.mx",
      url: "https://www.instagram.com/robertoeldiablo.mx",
    },
    facebook: {
      handle: "@robertoeldiablomx",
      url: "https://www.facebook.com/share/1JLNwm1nvB/",
    },
    youtube: {
      handle: "@robertoeldiablo1662",
      url: "https://www.youtube.com/@robertoeldiablo1662",
    },
    tiktok: {
      handle: "@robertoeldiablomx",
      url: "https://www.tiktok.com/@robertoeldiablomx",
    },
    spotify: { url: "https://open.spotify.com/artist/26cvfioUoHGNfAjZzaIWIA" },
  },
};
