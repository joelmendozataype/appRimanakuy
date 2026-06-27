import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../../core/auth/AuthContext";
import { ApiError } from "../../data/api/httpClient";

export function useLoginViewModel() {
  const { iniciarSesion } = useAuth();
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enviar = async () => {
    setError(null);
    setCargando(true);
    try {
      await iniciarSesion(usuario, clave);
      router.replace("/preferencias");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No se pudo iniciar sesion");
    } finally {
      setCargando(false);
    }
  };

  return { usuario, setUsuario, clave, setClave, cargando, error, enviar };
}
