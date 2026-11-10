// Opciones del DOM que los navegadores ya soportan pero que la versión de
// TypeScript del proyecto (5.9) todavía no trae. Se pueden borrar al subir a
// TypeScript 6, que ya las incluye.

interface FocusOptions {
  // focus({ focusVisible: true }) enfoca mostrando el marco de foco
  // (:focus-visible), como al navegar con teclado.
  focusVisible?: boolean;
}
