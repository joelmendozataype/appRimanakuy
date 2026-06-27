import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Usuario } from "../../domain/entities/Usuario";
import { AuthRepositoryImpl } from "../../data/repositories/AuthRepositoryImpl";
import { crearLoginUseCase } from "../../domain/usecases/login";

const SESION_STORAGE_KEY = "rimanakuy.sesion";

interface SesionGuardada {
  accessToken: string;
  usuario: Usuario;
}

interface AuthContextValue {
  cargando: boolean;
  accessToken: string | null;
  usuario: Usuario | null;
  iniciarSesion: (usuario: string, clave: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const authRepository = new AuthRepositoryImpl();
const loginUseCase = crearLoginUseCase(authRepository);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [cargando, setCargando] = useState(true);
  const [sesion, setSesion] = useState<SesionGuardada | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(SESION_STORAGE_KEY)
      .then((valor) => {
        if (valor) setSesion(JSON.parse(valor) as SesionGuardada);
      })
      .finally(() => setCargando(false));
  }, []);

  const iniciarSesion = async (usuario: string, clave: string) => {
    const resultado = await loginUseCase(usuario, clave);
    const nuevaSesion: SesionGuardada = {
      accessToken: resultado.accessToken,
      usuario: resultado.usuario,
    };
    await AsyncStorage.setItem(SESION_STORAGE_KEY, JSON.stringify(nuevaSesion));
    setSesion(nuevaSesion);
  };

  const cerrarSesion = async () => {
    await AsyncStorage.removeItem(SESION_STORAGE_KEY);
    setSesion(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      cargando,
      accessToken: sesion?.accessToken ?? null,
      usuario: sesion?.usuario ?? null,
      iniciarSesion,
      cerrarSesion,
    }),
    [cargando, sesion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
