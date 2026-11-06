import { useId, type CSSProperties } from "react";

// Llamitas alrededor del triángulo de play (demo play-llamas).
const FLAMES = [
  "M22.6,12.4 Q23.9,3.7 27.4,-2.1 Q29.1,8.3 29.5,16.3Z",
  "M35.4,19.7 Q37.4,9.2 37.9,0.0 Q41.2,13.5 40.7,22.8Z",
  "M52.0,29.3 Q53.2,21.1 53.3,13.9 Q58.2,25.6 58.7,33.1Z",
  "M65.5,37.0 Q68.0,24.0 82.1,20.3 Q71.7,28.8 70.8,40.1Z",
  "M79.7,45.2 Q81.6,34.3 81.6,24.5 Q86.4,39.3 86.3,49.0Z",
  "M78.2,55.6 Q83.0,52.5 83.8,51.7 Q77.0,56.0 71.6,59.5Z",
  "M35.6,80.2 Q40.7,76.8 37.6,78.3 Q34.1,80.7 28.4,84.3Z",
  "M22.0,73.2 Q18.2,69.5 15.1,58.9 Q18.9,63.7 22.0,64.9Z",
  "M22.0,32.5 Q17.5,27.8 13.7,24.9 Q18.3,23.3 22.0,25.7Z",
];

// Ruido que mueve las llamas: a saltos (seed discreto). "hervor" en reposo;
// "hervor2", más rápido e intenso, al pasar el mouse o con el foco.
function Boil({ id, dur, scale }: { id: string; dur: string; scale: number }) {
  return (
    <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
      <feTurbulence
        type="turbulence"
        baseFrequency="0.05 0.12"
        numOctaves={2}
        seed={1}
        result="n"
      >
        <animate
          attributeName="seed"
          dur={dur}
          values="1;2;3;4;5;6;7;8"
          calcMode="discrete"
          repeatCount="indefinite"
        />
      </feTurbulence>
      <feDisplacementMap
        in="SourceGraphic"
        in2="n"
        scale={scale}
        xChannelSelector="R"
        yChannelSelector="G"
      />
    </filter>
  );
}

type PlayFlameIconProps = {
  className?: string;
};

// Play con llamitas, en currentColor. Solo las llamas llevan filtro; el
// triángulo queda limpio. Se aviva cuando el link que lo contiene (con clase
// "group") tiene el mouse encima o el foco. Con movimiento reducido, las
// llamas sin filtro. overflow visible: las llamas salen del viewBox.
export function PlayFlameIcon({ className = "" }: PlayFlameIconProps) {
  // Ids únicos por instancia; useId trae caracteres que no sirven en url(#…).
  const id = useId().replace(/[^\w-]/g, "");
  const calm = `hervor-${id}`;
  const lively = `hervor2-${id}`;

  return (
    <svg
      viewBox="-8 -16 126 132"
      aria-hidden="true"
      className={`overflow-visible ${className}`}
      style={{ "--llamas-vivas": `url(#${lively})` } as CSSProperties}
    >
      <defs>
        <Boil id={calm} dur="0.9s" scale={3} />
        <Boil id={lively} dur="0.5s" scale={5} />
      </defs>
      <g
        filter={`url(#${calm})`}
        className="fill-current group-hover:[filter:var(--llamas-vivas)] group-focus-visible:[filter:var(--llamas-vivas)] motion-reduce:filter-none!"
      >
        {FLAMES.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <path
        d="M22,12 L88,50 L22,88Z"
        strokeLinejoin="round"
        strokeWidth={7}
        stroke="currentColor"
        fill="currentColor"
      />
    </svg>
  );
}
