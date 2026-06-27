import { AuthRepository, Sesion } from "../repositories/AuthRepository";

export function crearLoginUseCase(authRepository: AuthRepository) {
  return async function login(usuario: string, clave: string): Promise<Sesion> {
    if (!usuario.trim() || !clave.trim()) {
      throw new Error("Usuario y clave son obligatorios");
    }
    return authRepository.login(usuario.trim(), clave);
  };
}
