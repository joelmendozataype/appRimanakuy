import { ActivityIndicator, Pressable, Text, TextInput, View } from "react-native";
import { useLoginViewModel } from "./useLoginViewModel";

export function LoginScreen() {
  const { usuario, setUsuario, clave, setClave, cargando, error, enviar } = useLoginViewModel();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        padding: 24,
        gap: 12,
        backgroundColor: "#FFFFFF",
      }}
    >
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16, color: "#1A1A1A" }}>
        RIMANAKUY-Salud
      </Text>

      <TextInput
        placeholder="Usuario"
        value={usuario}
        onChangeText={setUsuario}
        autoCapitalize="none"
        placeholderTextColor="#888"
        style={{ borderWidth: 1, borderColor: "#CCC", borderRadius: 8, padding: 12, color: "#000" }}
      />
      <TextInput
        placeholder="Clave"
        value={clave}
        onChangeText={setClave}
        secureTextEntry
        placeholderTextColor="#888"
        style={{ borderWidth: 1, borderColor: "#CCC", borderRadius: 8, padding: 12, color: "#000" }}
      />

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <Pressable
        onPress={enviar}
        disabled={cargando}
        style={{ backgroundColor: "#208AEF", borderRadius: 8, padding: 14, alignItems: "center" }}
      >
        {cargando ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: "#fff", fontWeight: "600" }}>Ingresar</Text>
        )}
      </Pressable>
    </View>
  );
}
