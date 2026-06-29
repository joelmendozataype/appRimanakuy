export interface Traduccion {
  conversacionId: number;
  mensajeId: number;
  traduccionId: number;
  textoTraducido: string;
  confianza: number | null;
}
