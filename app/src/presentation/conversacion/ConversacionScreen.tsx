import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useConversacionViewModel } from "./useConversacionViewModel";

export function ConversacionScreen() {
  const {
    turnos,
    grabando,
    procesando,
    error,
    textoPaciente,
    setTextoPaciente,
    iniciarGrabacion,
    detenerGrabacion,
    enviarRespuestaPaciente,
  } = useConversacionViewModel();

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ padding: 24, gap: 4 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold", color: "#1A1A1A" }}>Conversacion</Text>
        <Text style={{ color: "#60646C" }}>
          Personal de salud habla en espanol (voz). El paciente responde en quechua
          (escrito, ya que aun no hay reconocimiento de voz para quechua).
        </Text>
      </View>

      <FlatList
        data={turnos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 10, flexGrow: 1 }}
        renderItem={({ item }) => (
          <View
            style={{
              alignSelf: item.hablante === "personal_salud" ? "flex-start" : "flex-end",
              maxWidth: "85%",
              backgroundColor: item.hablante === "personal_salud" ? "#EAF3FE" : "#F0F0F3",
              borderRadius: 8,
              padding: 12,
              gap: 4,
            }}
          >
            <Text style={{ color: "#60646C", fontSize: 12 }}>
              {item.hablante === "personal_salud" ? "Personal de salud (es)" : "Paciente (quy)"}
            </Text>
            <Text style={{ color: "#1A1A1A" }}>{item.textoOrigen}</Text>
            <Text style={{ color: "#1A1A1A", fontStyle: "italic" }}>→ {item.textoTraducido}</Text>
          </View>
        )}
      />

      {error ? (
        <Text style={{ color: "red", paddingHorizontal: 24 }}>{error}</Text>
      ) : null}

      <View style={{ padding: 24, gap: 12, borderTopWidth: 1, borderColor: "#EEE" }}>
        <Pressable
          onPress={grabando ? detenerGrabacion : iniciarGrabacion}
          disabled={procesando}
          style={{
            backgroundColor: grabando ? "#D32F2F" : "#208AEF",
            borderRadius: 8,
            padding: 16,
            alignItems: "center",
            opacity: procesando ? 0.6 : 1,
          }}
        >
          {procesando ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: "#fff", fontWeight: "600" }}>
              {grabando ? "🛑 Detener y traducir" : "🎙️ Hablar (espanol)"}
            </Text>
          )}
        </Pressable>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput
            value={textoPaciente}
            onChangeText={setTextoPaciente}
            placeholder="Respuesta del paciente en quechua..."
            placeholderTextColor="#888"
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#CCC",
              borderRadius: 8,
              padding: 12,
              color: "#000",
            }}
          />
          <Pressable
            onPress={enviarRespuestaPaciente}
            disabled={procesando || !textoPaciente.trim()}
            style={{
              borderWidth: 1,
              borderColor: "#CCC",
              borderRadius: 8,
              padding: 12,
              justifyContent: "center",
              opacity: procesando || !textoPaciente.trim() ? 0.5 : 1,
            }}
          >
            <Text style={{ color: "#1A1A1A" }}>Traducir</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
