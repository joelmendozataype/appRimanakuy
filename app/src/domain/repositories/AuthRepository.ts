import { Usuario } from "../entities/Usuario";

export interface Sesion {
  accessToken: string;
  usuario: Usuario;
}

export interface AuthRepository {
  login(usuario: string, clave: string): Promise<Sesion>;
}
