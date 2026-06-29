import { File, Paths } from "expo-file-system";
import { config } from "../../core/config";

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  token?: string;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(`${config.backendUrl}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const detalle = await response.json().catch(() => ({}));
    throw new ApiError(detalle.detail ?? "Error de comunicacion con el servidor", response.status);
  }

  return response.json() as Promise<T>;
}

let contadorAudio = 0;

export async function apiFetchAudioFile(
  path: string,
  body: unknown,
  token: string
): Promise<string> {
  const response = await fetch(`${config.backendUrl}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const detalle = await response.json().catch(() => ({}));
    throw new ApiError(detalle.detail ?? "Error al generar el audio", response.status);
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  const archivo = new File(Paths.cache, `tts-${Date.now()}-${contadorAudio++}.wav`);
  archivo.write(bytes);
  return archivo.uri;
}

export async function apiUploadAudio<T>(
  path: string,
  audioUri: string,
  token: string
): Promise<T> {
  const formData = new FormData();
  formData.append("audio", {
    uri: audioUri,
    name: "grabacion.m4a",
    type: "audio/m4a",
  } as unknown as Blob);

  const response = await fetch(`${config.backendUrl}${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  if (!response.ok) {
    const detalle = await response.json().catch(() => ({}));
    throw new ApiError(detalle.detail ?? "Error al subir el audio", response.status);
  }

  return response.json() as Promise<T>;
}
