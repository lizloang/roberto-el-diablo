export type RedSocialId =
  "instagram" | "facebook" | "youtube" | "tiktok" | "spotify";

// Lo que se ve y a dónde lleva (tel:, mailto: o https:).
export type ContactLink = {
  display: string;
  href: string;
};

export type RedSocial = {
  id: RedSocialId;
  nombre: string;
  // Usuario visible (con @). Vacío si no aplica.
  usuario: string;
  href: string;
};

// Datos del footer, ya listos para mostrar.
export type ContactInfo = {
  telefonos: ContactLink[];
  correo: ContactLink | null;
  management: {
    empresa: string;
    contacto: string;
    telefono: ContactLink | null;
  };
  // Solo las redes con link, en orden.
  redes: RedSocial[];
};
