"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import Image from "next/image";
import type { Show } from "@/types/show";

type ShowListProps = {
  shows: Show[];
};

// Entrada: cada fila aparece con un fade corto, una tras otra.
const list: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const row: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

// Lista de gira impresa, compacta y sin líneas entre fechas:
// FECHA  CIUDAD ············ LUGAR  EVENTO
// En móvil: fecha, puntos y ciudad arriba; abajo el lugar y el evento.
// Si hay boletos, el lugar es la liga. Sin fechas, "Espéranos pronto" con la
// cara del diablo del cursor.
export function ShowList({ shows }: ShowListProps) {
  const reduceMotion = useReducedMotion();

  if (shows.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 font-mono text-lg tracking-[0.02em] uppercase md:text-xl md:tracking-[0.08em]">
        {/* El diablo se mece de un lado a otro, apoyado en la barbilla. Quieto
            si el sistema pide reducir movimiento. */}
        <motion.div
          className="origin-bottom"
          initial={{ rotate: -8 }}
          animate={reduceMotion ? { rotate: 0 } : { rotate: 8 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 1.2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "mirror",
                }
          }
        >
          <Image
            src="/images/cursor/diablo@2x.png"
            alt=""
            width={72}
            height={80}
          />
        </motion.div>
        <p>Espéranos pronto</p>
      </div>
    );
  }

  return (
    <motion.ul
      variants={list}
      initial={reduceMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="font-mono text-lg md:text-xl"
    >
      {shows.map((show) => {
        const cancelled = show.status === "cancelled";
        // Boletos solo si la fecha sigue en pie y hay a dónde mandarlos.
        const ticketUrl = show.status === "scheduled" ? show.ticketUrl : null;
        // Con boletos, al pasar el cursor (o con el foco) toda la fila se
        // pinta de rojo vivo, puntos incluidos. Sin boletos no reacciona.
        const leaderHover = ticketUrl
          ? "group-hover:border-rojo-vivo group-focus-within:border-rojo-vivo"
          : "";
        const venue = (
          <>
            {show.venue}
            {show.eventName && (
              <>
                {" "}
                <span className="max-md:block md:ml-2">{show.eventName}</span>
              </>
            )}
          </>
        );

        return (
          <motion.li
            key={show.id}
            variants={row}
            className={`group relative py-3 md:py-1.5 ${ticketUrl ? "transition-colors focus-within:text-rojo-vivo hover:text-rojo-vivo motion-reduce:transition-none" : ""}`}
          >
            {/* En móvil, sin puntos y con el tracking más cerrado:
                FECHA          CIUDAD
                LUGAR
                EVENTO */}
            <p
              className={`flex flex-wrap items-baseline gap-x-3 tracking-[0.02em] uppercase md:tracking-[0.08em] ${cancelled ? "line-through" : ""}`}
            >
              {/* Fecha de ancho fijo en desktop (12 caracteres, cabe "sept")
                  para que las ciudades queden en columna. En móvil, fecha a
                  la izquierda, puntos y ciudad a la derecha. */}
              <span className="flex items-baseline gap-x-3 max-md:basis-full">
                <time
                  dateTime={show.date}
                  className="shrink-0 whitespace-nowrap tabular-nums md:w-[calc(12*(1ch+0.08em))]"
                >
                  {show.day} {show.month} {show.year}
                </time>
                <span
                  aria-hidden="true"
                  className={`min-w-4 flex-1 border-b-[3px] border-dotted border-crema/60 transition-colors motion-reduce:transition-none md:hidden ${leaderHover}`}
                />
                <span className="min-w-0 max-md:text-right md:whitespace-nowrap">
                  {show.city}
                  {/* El estado solo en desktop: en móvil no cabe junto a la
                      fecha sin partir la ciudad. */}
                  {show.state && (
                    <span className="hidden md:inline">, {show.state}</span>
                  )}
                </span>
              </span>

              {/* Puntos que se estiran hasta el lugar; solo en desktop. */}
              <span
                aria-hidden="true"
                className={`hidden min-w-8 flex-1 border-b-[3px] border-dotted border-crema/60 transition-colors motion-reduce:transition-none md:block ${leaderHover}`}
              />

              {/* Lugar y evento: a la derecha en desktop; en móvil cada uno
                  en su línea, a la izquierda. Si no caben, bajan de renglón
                  sin salirse de la fila. */}
              <span className="min-w-0 max-md:mt-1 max-md:basis-full md:max-w-[55%] md:text-right">
                {/* El link del lugar se estira (::after) sobre toda la fila:
                    se puede picar en cualquier parte del show. El foco de
                    teclado enmarca la fila completa. */}
                {ticketUrl ? (
                  <a
                    href={ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="after:absolute after:-inset-x-2 after:inset-y-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-crema"
                  >
                    {venue}
                    <span className="sr-only">
                      {" "}
                      — comprar boletos para {show.venue}, {show.longDate}
                    </span>
                  </a>
                ) : (
                  venue
                )}
                {show.status === "soldOut" ? (
                  <span className="inline-block bg-rojo px-1.5 no-underline max-md:mt-1 max-md:table md:ml-3">
                    {show.statusLabel}
                  </span>
                ) : (
                  show.status !== "scheduled" && (
                    <>
                      {" "}
                      <span className="max-md:block md:ml-2">
                        {show.statusLabel}
                      </span>
                    </>
                  )
                )}
              </span>
            </p>
            {show.notes && (
              <p className="mt-0.5 text-xs md:text-right">{show.notes}</p>
            )}
          </motion.li>
        );
      })}
    </motion.ul>
  );
}
