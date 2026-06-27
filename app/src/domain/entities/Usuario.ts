export type Rol = "administrador" | "personal_salud";

export interface Usuario {
  usuarioId: number;
  nombres: string;
  apellidos: string | null;
  usuario: string;
  rol: Rol;
  establecimiento: string | null;
}
