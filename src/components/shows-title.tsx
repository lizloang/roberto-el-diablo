type ShowsTitleProps = {
  id: string;
  // h1 en /shows, h2 en la portada.
  as?: "h1" | "h2";
};

// Título "Próximos shows": trazo fino, mayúsculas espaciadas y rojo vivo, sin
// brillo. Siempre en una línea: el tamaño crece con el ancho de la pantalla.
// El padding izquierdo compensa el espacio que el tracking deja tras la
// última letra, para que quede centrado de verdad.
export function ShowsTitle({ id, as: Tag = "h2" }: ShowsTitleProps) {
  return (
    <Tag
      id={id}
      className="pl-[0.3em] text-center font-accent text-[clamp(1.125rem,5.5vw,3.25rem)] leading-none tracking-[0.3em] whitespace-nowrap text-rojo-vivo uppercase"
    >
      Próximos shows
    </Tag>
  );
}
