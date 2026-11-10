import { cacheLife } from "next/cache";
import { SocialIcon } from "@/components/social-icon";
import { siteConfig } from "@/config/site";
import { credito } from "@/data/contacto";
import { getContactInfo } from "@/sanity/queries";

// Enlaces de texto: pasan al rojo vivo (el acento legible sobre negro) con
// el cursor o con el foco de teclado.
const LINK =
  "rounded-sm transition-colors duration-200 hover:text-rojo-vivo focus-visible:text-rojo-vivo focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-rojo-vivo motion-reduce:transition-none";

// Títulos de columna: la misma letra de "Próximos shows" (trazo fino,
// mayúsculas espaciadas), a tamaño de footer.
const HEADING =
  "font-accent text-lg leading-none tracking-[0.3em] uppercase md:text-xl";

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;

// Año del copyright. Con cacheComponents un new Date() suelto rompe el
// prerender; en caché se recalcula a diario y el año cambia solo.
async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

// Los datos salen de "Contacto y redes" en el Studio. Lo que se deje vacío
// no se muestra.
export async function SiteFooter() {
  const { telefonos, correo, management, redes } = await getContactInfo();
  // Instagram y Facebook también van con su usuario en Contacto.
  const redesConUsuario = redes.filter(
    (red) => (red.id === "instagram" || red.id === "facebook") && red.usuario,
  );
  const hayMgmt =
    management.empresa || management.contacto || management.telefono;

  return (
    <footer className="bg-negro px-5 pb-10 text-crema md:px-16">
      <div className="mx-auto max-w-6xl border-t border-crema/15 pt-14 md:pt-16">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Contacto */}
          <section aria-labelledby="footer-contacto">
            <h2 id="footer-contacto" className={`${HEADING} text-rojo-vivo`}>
              Contacto
            </h2>
            <div className="mt-6 flex flex-col gap-8 text-sm sm:flex-row sm:gap-14">
              {(telefonos.length > 0 || correo) && (
                <address className="space-y-2 not-italic">
                  {telefonos.length > 0 && (
                    <p>
                      T.{" "}
                      {telefonos.map((tel, i) => (
                        <span key={tel.href}>
                          {i > 0 && " / "}
                          <a
                            href={tel.href}
                            className={`${LINK} whitespace-nowrap`}
                          >
                            {tel.display}
                          </a>
                        </span>
                      ))}
                    </p>
                  )}
                  {correo && (
                    <p>
                      <a href={correo.href} className={LINK}>
                        {correo.display}
                      </a>
                    </p>
                  )}
                </address>
              )}

              {redesConUsuario.length > 0 && (
                <ul className="space-y-2">
                  {redesConUsuario.map((red) => (
                    <li key={red.id}>
                      <a
                        href={red.href}
                        {...EXTERNAL}
                        className={`${LINK} inline-flex items-center gap-2.5`}
                      >
                        <SocialIcon id={red.id} className="size-4 shrink-0" />
                        <span>
                          <span className="sr-only">{red.nombre}: </span>
                          {red.usuario}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Management y booking */}
          {hayMgmt && (
            <section aria-labelledby="footer-mgmt">
              <h2 id="footer-mgmt" className={HEADING}>
                <span className="text-rojo-vivo">MGMT</span> &amp; Booking
              </h2>
              <address className="mt-6 text-sm not-italic">
                {management.empresa && (
                  <p className="text-xs font-bold tracking-[0.3em] uppercase">
                    {management.empresa}
                  </p>
                )}
                <p className="mt-3 flex flex-wrap gap-x-8 gap-y-2">
                  {management.contacto && <span>{management.contacto}</span>}
                  {management.telefono && (
                    <span>
                      Tel:{" "}
                      <a
                        href={management.telefono.href}
                        className={`${LINK} whitespace-nowrap`}
                      >
                        {management.telefono.display}
                      </a>
                    </span>
                  )}
                </p>
              </address>
            </section>
          )}
        </div>

        {redes.length > 0 && (
          <ul className="mt-14 flex flex-wrap justify-center gap-6">
            {redes.map((red) => (
              <li key={red.id}>
                <a
                  href={red.href}
                  {...EXTERNAL}
                  aria-label={`${red.nombre} de ${siteConfig.name}`}
                  className="block rounded-sm p-1 transition duration-200 hover:-translate-y-0.5 hover:text-rojo-vivo focus-visible:-translate-y-0.5 focus-visible:text-rojo-vivo focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rojo-vivo motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0"
                >
                  <SocialIcon id={red.id} className="size-7 md:size-8" />
                </a>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-10 space-y-1 text-center text-xs text-crema/60">
          <p>
            © <CurrentYear /> {siteConfig.name}
          </p>
          <p>
            Diseño y desarrollo:{" "}
            {credito.href ? (
              <a href={credito.href} {...EXTERNAL} className={LINK}>
                {credito.nombre}
              </a>
            ) : (
              credito.nombre
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
