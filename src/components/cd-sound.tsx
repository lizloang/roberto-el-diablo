"use client";

import { useReducedMotion } from "motion/react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

const FADE_MS = 500;
// Preferencia de sonido: solo dura la sesión.
const STORAGE_KEY = "red-sonido-cd";

// Análisis del ritmo: con fftSize 1024 a 44.1 kHz cada banda mide ~43 Hz;
// las bandas 1–4 (~40–200 Hz) son bombo y bajo.
const FFT_SIZE = 1024;
const BASS_BANDS = [1, 2, 3, 4];

type CdSoundProps = {
  // Fragmento en MP3 (Sanity: "Nuevo lanzamiento" → "Audio del CD del home").
  src: string;
  // El CD del home.
  children: ReactNode;
};

// Grafo de Web Audio: audio → volumen (fades) → analizador → bocinas.
type AudioGraph = {
  context: AudioContext;
  gain: GainNode;
  analyser: AnalyserNode;
};

// Sonido del CD del home. Nunca suena sin que se active con el botón. Con
// el sonido activado: en escritorio suena mientras el mouse está sobre el
// CD (fade-in y fade-out de 500 ms, retoma donde se quedó); en pantallas
// sin hover empieza a sonar al activarlo, y tocar el CD pausa o reanuda en
// vez de ir a /musica. Mientras
// suena, el disco se enciende con un halo rojo que late con los graves de
// la canción. Se detiene al salir de vista, al ocultar la pestaña o al
// cambiar de página.
//
// El latido necesita leer el audio, y eso solo se permite si el dominio
// está en los orígenes CORS del proyecto de Sanity. Si no, el audio se
// recarga sin análisis: suena igual y el halo queda fijo.
export function CdSound({ src, children }: CdSoundProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const pulseRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<AudioGraph | null>(null);
  const fadeRef = useRef(0);
  const fadeDoneRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const beatRef = useRef(0);
  const wantsPlayRef = useRef(false);
  const pointerTypeRef = useRef("");
  const [soundOn, setSoundOn] = useState(false);
  const [playing, setPlaying] = useState(false);
  const reduceMotion = useReducedMotion();

  // La preferencia guardada se lee después de hidratar: el servidor siempre
  // pinta el sonido apagado.
  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sessionStorage solo existe en el cliente.
      setSoundOn(sessionStorage.getItem(STORAGE_KEY) === "1");
    } catch {}
  }, []);

  // Lleva el volumen a `target` en `ms` y luego llama a `done`. Un fade
  // nuevo cancela el anterior (y su `done`). Con el grafo armado el fade va
  // en el GainNode, que también funciona en iPhone (ahí audio.volume no se
  // puede cambiar).
  const fadeTo = useCallback(
    (target: number, ms: number, done?: () => void) => {
      const audio = audioRef.current;
      if (!audio) return;
      cancelAnimationFrame(fadeRef.current);
      clearTimeout(fadeDoneRef.current);

      const graph = graphRef.current;
      if (graph) {
        const { gain, context } = graph;
        const now = context.currentTime;
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(gain.gain.value, now);
        gain.gain.linearRampToValueAtTime(target, now + ms / 1000);
        if (done) fadeDoneRef.current = setTimeout(done, ms);
        return;
      }

      const from = audio.volume;
      const start = performance.now();
      const step = (now: number) => {
        // El tiempo del cuadro puede ser anterior a `start`, y volume fuera
        // de 0–1 lanza un error: se limita todo a ese rango.
        const progress = Math.min(1, Math.max(0, (now - start) / ms));
        const volume = from + (target - from) * progress;
        audio.volume = Math.min(1, Math.max(0, volume));
        if (progress < 1) fadeRef.current = requestAnimationFrame(step);
        else done?.();
      };
      fadeRef.current = requestAnimationFrame(step);
    },
    [],
  );

  // Arma el grafo la primera vez que el audio carga con permiso de CORS. Se
  // conecta una sola vez y para siempre: por eso solo con el contexto ya
  // activo (si no, el audio saldría mudo).
  const connectGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || graphRef.current || !audio.crossOrigin) return;
    let context: AudioContext;
    try {
      context = new AudioContext();
    } catch {
      return;
    }
    if (context.state !== "running") {
      context.close();
      return;
    }
    const source = context.createMediaElementSource(audio);
    const gain = context.createGain();
    const analyser = context.createAnalyser();
    analyser.fftSize = FFT_SIZE;
    analyser.smoothingTimeConstant = 0.5;
    source.connect(gain).connect(analyser).connect(context.destination);
    // El nivel actual pasa del elemento al GainNode, sin saltos, y el fade
    // en curso sigue ahí.
    cancelAnimationFrame(fadeRef.current);
    gain.gain.value = audio.volume;
    audio.volume = 1;
    graphRef.current = { context, gain, analyser };
    if (wantsPlayRef.current) fadeTo(1, FADE_MS / 2);
    else if (!audio.paused) fadeTo(0, FADE_MS / 2, () => audio.pause());
  }, [fadeTo]);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    wantsPlayRef.current = true;
    // Si cargó antes sin poder armar el grafo (contexto sin activar), otro
    // intento ahora.
    if (audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) connectGraph();
    const graph = graphRef.current;
    if (audio.paused) {
      if (graph) graph.gain.gain.value = 0;
      else audio.volume = 0;
    }
    graph?.context.resume().catch(() => {});
    setPlaying(true);
    audio.play().catch((error: unknown) => {
      // NotSupported/Abort: falló la carga con CORS y onError lo reintenta
      // sin análisis. Lo demás (p. ej. el navegador no deja reproducir
      // todavía): no suena.
      const name = error instanceof DOMException ? error.name : "";
      if (name !== "NotSupportedError" && name !== "AbortError") {
        setPlaying(false);
      }
    });
    fadeTo(1, FADE_MS);
  }, [fadeTo, connectGraph]);

  // Con fade-out (al quitar el mouse) o de golpe (al salir de vista o de
  // la página). Pausa sin regresar al inicio.
  const stop = useCallback(
    (fade = true) => {
      const audio = audioRef.current;
      if (!audio) return;
      wantsPlayRef.current = false;
      setPlaying(false);
      if (fade && !audio.paused) {
        fadeTo(0, FADE_MS, () => audio.pause());
      } else {
        cancelAnimationFrame(fadeRef.current);
        clearTimeout(fadeDoneRef.current);
        audio.pause();
      }
    },
    [fadeTo],
  );

  // El audio cargó con CORS: se puede analizar.
  const onLoadedData = () => connectGraph();

  // Sin permiso de CORS para este dominio el archivo no carga en ese modo:
  // se recarga normal (sin análisis) y, si estaba sonando, sigue.
  const onError = () => {
    const audio = audioRef.current;
    if (!audio || !audio.crossOrigin) return;
    audio.removeAttribute("crossorigin");
    audio.load();
    if (wantsPlayRef.current) {
      audio.volume = 0;
      audio
        .play()
        .then(() => {
          if (!wantsPlayRef.current) return audio.pause();
          setPlaying(true);
          fadeTo(1, FADE_MS);
        })
        .catch(() => setPlaying(false));
    }
  };

  // Latido del halo: mide los graves cada cuadro mientras suena. Sube
  // rápido con cada golpe y baja más lento; se compara con el promedio
  // reciente para que marque los golpes aunque la canción sea fuerte. Con
  // movimiento reducido el halo queda fijo.
  useEffect(() => {
    const halo = pulseRef.current;
    if (!playing || reduceMotion || !halo) return;
    const bins = new Uint8Array(FFT_SIZE / 2);
    let envelope = 0;
    let average = 0;
    const frame = () => {
      const analyser = graphRef.current?.analyser;
      if (analyser) {
        analyser.getByteFrequencyData(bins);
        const bass =
          BASS_BANDS.reduce((sum, band) => sum + bins[band], 0) /
          (BASS_BANDS.length * 255);
        envelope += (bass - envelope) * (bass > envelope ? 0.6 : 0.15);
        average += (envelope - average) * 0.03;
        const pulse = Math.min(1, Math.max(0, (envelope - average) * 5 + 0.35));
        halo.style.opacity = String(0.45 + 0.55 * pulse);
        halo.style.transform = `scale(${1 + 0.05 * pulse})`;
      }
      beatRef.current = requestAnimationFrame(frame);
    };
    beatRef.current = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(beatRef.current);
      halo.style.opacity = "";
      halo.style.transform = "";
    };
  }, [playing, reduceMotion]);

  // Se detiene al salir de vista con el scroll y al ocultar la pestaña.
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) stop(false);
    });
    observer.observe(area);
    const onHide = () => {
      if (document.visibilityState === "hidden") stop(false);
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [stop]);

  // Al cambiar de página el componente se desmonta: corta el audio y
  // libera el contexto de Web Audio.
  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      cancelAnimationFrame(fadeRef.current);
      clearTimeout(fadeDoneRef.current);
      audio?.pause();
      graphRef.current?.context.close().catch(() => {});
      graphRef.current = null;
    };
  }, []);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    if (!next) stop();
    // Sin hover (celular, tablet) no hay forma de "pasar" sobre el CD:
    // activar el sonido ya lo pone a sonar. El toque en el botón es el
    // permiso que pide el navegador para reproducir.
    else if (window.matchMedia("(hover: none)").matches) play();
    try {
      sessionStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {}
  };

  // Hover: solo con mouse. Los toques también disparan pointerenter.
  const onPointerEnter = (event: PointerEvent) => {
    if (soundOn && event.pointerType === "mouse") play();
  };
  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType === "mouse") stop();
  };

  // Toque en pantallas táctiles: play/pausa en vez de navegar. Va en fase
  // de captura para ganarle al enlace del disco. Teclado y mouse siguen
  // llevando a /musica, y el play "Escúchalo aquí" abre su liga.
  const onClickCapture = (event: MouseEvent) => {
    const touch =
      pointerTypeRef.current === "touch" || pointerTypeRef.current === "pen";
    pointerTypeRef.current = "";
    if (!soundOn || !touch) return;
    const link = (event.target as Element).closest("a");
    if (link?.target === "_blank") return;
    event.preventDefault();
    if (playing) stop();
    else play();
  };

  return (
    <div className="flex w-full max-w-[36rem] flex-col items-center">
      <div
        ref={areaRef}
        className="relative isolate w-full"
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerDown={(event) => (pointerTypeRef.current = event.pointerType)}
        onClickCapture={onClickCapture}
      >
        {/* Halo rojo mientras suena, como el neón de la discografía: se
            enciende y apaga con el fade, y por dentro late con los graves.
            El círculo que late es 94 % del disco: crece hasta 5 % y su
            borde sigue escondido detrás del CD (si no, entre el disco y el
            brillo se asoma el fondo negro). */}
        <div
          aria-hidden
          className={`pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500 ${playing ? "opacity-100" : "opacity-0"}`}
        >
          <div
            ref={pulseRef}
            data-cd-pulse
            className="absolute inset-[3%] rounded-full shadow-[0_0_40px_22px_rgb(255_59_47/0.45),0_0_110px_44px_rgb(210_20_15/0.3)] will-change-transform"
          />
        </div>
        {children}
      </div>

      {/* El audio solo se descarga cuando se reproduce por primera vez.
          crossOrigin: para poder analizarlo (ver onError). */}
      <audio
        ref={audioRef}
        src={src}
        preload="none"
        loop
        crossOrigin="anonymous"
        onLoadedData={onLoadedData}
        onError={onError}
      />

      <button
        type="button"
        aria-pressed={soundOn}
        onClick={toggleSound}
        className="mt-5 rounded-sm px-2 py-1 text-xs font-bold tracking-[0.2em] text-crema/70 uppercase transition-colors duration-200 hover:text-crema focus-visible:text-crema focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crema motion-reduce:transition-none"
      >
        <span aria-hidden>{soundOn ? "🔇" : "🔊"}</span>{" "}
        {soundOn ? "Silenciar" : "Activar sonido"}
      </button>
    </div>
  );
}
