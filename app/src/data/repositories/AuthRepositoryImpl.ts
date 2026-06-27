import { Usuario } from "../../domain/entities/Usuario";
import { AuthRepository, Sesion } from "../../domain/repositories/AuthRepository";
import { apiFetch } from "../api/httpClient";

interface LoginResponseDto {
  access_token: string;
  usuario: {
    usuario_id: number;
    nombres: string;
    apellidos: string | null;
    usuario: string;
    rol: Usuario["rol"];
    establecimiento: string | null;
  };
}

export class AuthRepositoryImpl implements AuthRepository {
  async login(usuario: string, clave: string): Promise<Sesion> {
    const dto = await apiFetch<LoginResponseDto>("/auth/login", {
      method: "POST",
      body: { usuario, clave },
    });

    return {
      accessToken: dto.access_token,
      usuario: {
        usuarioId: dto.usuario.usuario_id,
        nombres: dto.usuario.nombres,
        apellidos: dto.usuario.apellidos,
        usuario: dto.usuario.usuario,
        rol: dto.usuario.rol,
        establecimiento: dto.usuario.establecimiento,
      },
    };
  }
}
