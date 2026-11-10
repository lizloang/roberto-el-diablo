// Enlace de álbum de Spotify → URL del reproductor embebido.
// Acepta links con parámetros (?si=…) o con prefijo de idioma
// (open.spotify.com/intl-es/album/…). Si no es un álbum, regresa null.
const ALBUM_ID = /open\.spotify\.com\/(?:intl-[a-z-]+\/)?album\/([A-Za-z0-9]+)/;

export function spotifyAlbumEmbedUrl(url: string | null): string | null {
  const id = url?.match(ALBUM_ID)?.[1];
  // theme=0: tema oscuro del reproductor, para el fondo negro del sitio.
  return id ? `https://open.spotify.com/embed/album/${id}?theme=0` : null;
}
