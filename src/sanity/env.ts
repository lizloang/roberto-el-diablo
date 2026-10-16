export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-10-01";

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "Falta la variable de entorno NEXT_PUBLIC_SANITY_DATASET",
);

export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "Falta la variable de entorno NEXT_PUBLIC_SANITY_PROJECT_ID",
);

function assertValue<T>(value: T | undefined, errorMessage: string): T {
  if (value === undefined || value === "") {
    throw new Error(errorMessage);
  }

  return value;
}
