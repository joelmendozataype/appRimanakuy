import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useTraductorViewModel } from "./useTraductorViewModel";

const ETIQUETA_IDIOMA: Record<string, string> = {
  es: "Espanol",
  quy: "Quechua",
};

export function TraductorScreen() {
  const {
    idiomaOrigen,
    idiomaDestino,
    textoOrigen,
    setTextoOrigen,
    textoTraducido,
    setTextoTraducido,
    traduccionId,
    confirmado,
    cargando,
    error,
    invertirIdiomas,
    traducir,
    confirmar,
  } = useTraductorViewModel();

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1, padding: 24, gap: 16, backgroundColor: "#FFFFFF" }}
    >
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#1A1A1A" }}>Traductor</Text>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <Text style={{ fontWeight: "600", color: "#1A1A1A" }}>
          {ETIQUETA_IDIOMA[idiomaOrigen]}
        </Text>
        <Pressable onPress={invertirIdiomas} hitSlop={8}>
          <Text style={{ fontSize: 20 }}>⇄</Text>
        </Pressable>
        <Text style={{ fontWeight: "600", color: "#1A1A1A" }}>
          {ETIQUETA_IDIOMA[idiomaDestino]}
        </Text>
      </View>

      <View style={{ gap: 6 }}>
        <Text style={{ color: "#60646C" }}>{ETIQUETA_IDIOMA[idiomaOrigen]}</Text>
        <TextInput
          value={textoOrigen}
          onChangeText={setTextoOrigen}
          placeholder="Escribe el texto a traducir..."
          placeholderTextColor="#888"
          multiline
          style={{
            borderWidth: 1,
            borderColor: "#CCC",
            borderRadius: 8,
            padding: 12,
            minHeight: 80,
            color: "#000",
          }}
        />
      </View>

      <Pressable
        onPress={traducir}
        disabled={cargando || !textoOrigen.trim()}
        style={{
          backgroundColor: "#208AEF",
          borderRadius: 8,
          padding: 14,
          alignItems: "center",
          opacity: cargando || !textoOrigen.trim() ? 0.6 : 1,
        }}
      >
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600" }}>Traducir</Text>
        )}
      </Pressable>

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      {traduccionId !== null ? (
        <View style={{ gap: 6 }}>
          <Text style={{ color: "#60646C" }}>
            {ETIQUETA_IDIOMA[idiomaDestino]} (puedes corregir antes de confirmar)
          </Text>
          <TextInput
            value={textoTraducido}
            onChangeText={setTextoTraducido}
            multiline
            style={{
              borderWidth: 1,
              borderColor: "#CCC",
              borderRadius: 8,
              padding: 12,
              minHeight: 80,
              color: "#000",
            }}
          />

          <Pressable
            onPress={confirmar}
            disabled={cargando}
            style={{
              borderWidth: 1,
              borderColor: confirmado ? "#2E7D32" : "#CCC",
              borderRadius: 8,
              padding: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: confirmado ? "#2E7D32" : "#1A1A1A" }}>
              {confirmado ? "✓ Traduccion confirmada" : "Confirmar traduccion"}
            </Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}
