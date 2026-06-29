import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { useFavoritosViewModel } from "./useFavoritosViewModel";

export function FavoritosScreen() {
  const { frases, cargando, error, reproducir, quitarFavorito } = useFavoritosViewModel();

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 12, backgroundColor: "#FFFFFF" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#1A1A1A" }}>Mis favoritos</Text>

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      {!cargando && frases.length === 0 ? (
        <Text style={{ color: "#60646C" }}>Aun no marcaste ninguna frase como favorita.</Text>
      ) : null}

      <FlatList
        data={frases}
        keyExtractor={(item) => String(item.fraseId)}
        contentContainerStyle={{ gap: 14 }}
        renderItem={({ item }) => (
          <View style={{ borderWidth: 1, borderColor: "#CCC", borderRadius: 8, padding: 14, gap: 8 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: "#1A1A1A", flex: 1 }}>{item.fraseEs}</Text>
              <Pressable onPress={() => reproducir(item.fraseEs, "es")} hitSlop={8}>
                <Text>🔊</Text>
              </Pressable>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: "#60646C", fontStyle: "italic", flex: 1 }}>{item.fraseQu}</Text>
              <Pressable onPress={() => reproducir(item.fraseQu, "quy")} hitSlop={8}>
                <Text>🔊</Text>
              </Pressable>
            </View>
            <Pressable onPress={() => quitarFavorito(item)} style={{ alignSelf: "flex-end" }} hitSlop={8}>
              <Text style={{ fontSize: 18 }}>⭐</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
