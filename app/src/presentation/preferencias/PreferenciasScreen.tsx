import { ActivityIndicator, Pressable, Switch, Text, View } from "react-native";
import { usePreferenciasViewModel } from "./usePreferenciasViewModel";

const TAMANOS_LETRA = ["pequeno", "normal", "grande"] as const;

export function PreferenciasScreen() {
  const { usuario, preferencia, cargando, guardando, error, actualizar, continuar } =
    usePreferenciasViewModel();

  if (cargando || !preferencia) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold" }}>Hola, {usuario?.nombres}</Text>
      <Text style={{ fontSize: 16, fontWeight: "600" }}>Tamano de letra</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {TAMANOS_LETRA.map((tamano) => (
          <Pressable
            key={tamano}
            onPress={() => actualizar({ tamanoLetra: tamano })}
            style={{
              borderWidth: 1,
              borderRadius: 8,
              padding: 10,
              backgroundColor: preferencia.tamanoLetra === tamano ? "#208AEF" : "transparent",
            }}
          >
            <Text style={{ color: preferencia.tamanoLetra === tamano ? "#fff" : "#000" }}>
              {tamano}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "600" }}>Voz activada</Text>
        <Switch
          value={preferencia.vozActivada}
          onValueChange={(valor) => actualizar({ vozActivada: valor })}
        />
      </View>

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      {guardando ? <ActivityIndicator /> : null}

      <Pressable
        onPress={continuar}
        style={{ backgroundColor: "#208AEF", borderRadius: 8, padding: 14, alignItems: "center" }}
      >
        <Text style={{ color: "#fff", fontWeight: "600" }}>Continuar</Text>
      </Pressable>
    </View>
  );
}
