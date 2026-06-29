export interface VozRepository {
  transcribir(audioUri: string, idioma: string, token: string): Promise<string>;
}
