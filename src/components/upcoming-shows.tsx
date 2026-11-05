import type { Show } from "@/types/show";
import { ShowList } from "@/components/show-list";
import { ShowsTitle } from "@/components/shows-title";

// Fechas que caben en la portada; el resto vive en /shows.
const HOME_LIMIT = 4;

type UpcomingShowsProps = {
  shows: Show[];
};

export function UpcomingShows({ shows }: UpcomingShowsProps) {
  return (
    <section
      aria-labelledby="fechas-title"
      className="bg-negro px-5 pb-24 text-crema md:px-16 md:pb-32"
    >
      <ShowsTitle id="fechas-title" />

      <div className="mx-auto mt-16 max-w-5xl">
        <ShowList shows={shows.slice(0, HOME_LIMIT)} />
      </div>
    </section>
  );
}
