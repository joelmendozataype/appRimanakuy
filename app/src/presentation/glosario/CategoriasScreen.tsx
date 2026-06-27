import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { useCategoriasViewModel } from "./useCategoriasViewModel";

export function CategoriasScreen() {
  const { categorias, cargando, error } = useCategoriasViewModel();
  const router = useRouter();

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 12, backgroundColor: "#FFFFFF" }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", color: "#1A1A1A" }}>Glosario clinico</Text>

      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

      <FlatList
        data={categorias}
        keyExtractor={(item) => String(item.categoriaId)}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/glosario/[categoriaId]",
                params: { categoriaId: String(item.categoriaId) },
              })
            }
            style={{
              borderWidth: 1,
              borderColor: "#CCC",
              borderRadius: 8,
              padding: 16,
            }}
          >
            <Text style={{ fontSize: 16, color: "#1A1A1A" }}>{item.nombre}</Text>
          </Pressable>
        )}
      />
    </View>
  );
}
