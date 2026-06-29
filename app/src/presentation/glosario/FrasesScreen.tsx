import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { Frase } from "../../domain/entities/Frase";
import { useFrasesViewModel } from "./useFrasesViewModel";

interface Props {
  categoriaId: number;
}

export function FrasesScreen({ categoriaId }: Props) {
  const { frases, cargando, error, reproducir, alternarFavorito } =
    useFrasesViewModel(categoriaId);

  if (cargando) {
    return (
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#FFFFFF" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24, gap: 12, backgroundColor: "#FFFFFF" }}>
      {error ? <Text style={{ color: "red" }}>{error}</Text> : null}
      {!error && frases.length === 0 ? (
        <Text style={{ color: "#60646C" }}>
          No hay frases en esta categoria (categoriaId={categoriaId}).
        </Text>
      ) : null}

      <FlatList
        data={frases}
        keyExtractor={(item) => String(item.fraseId)}
        contentContainerStyle={{ gap: 14 }}
        renderItem={({ item }) => (
          <FraseCard
            frase={item}
            onReproducirEs={() => reproducir(item.fraseEs, "es")}
            onReproducirQu={() => reproducir(item.fraseQu, "quy")}
            onAlternarFavorito={() => alternarFavorito(item)}
          />
        )}
      />
    </View>
  );
}

function FraseCard({
  frase,
  onReproducirEs,
  onReproducirQu,
  onAlternarFavorito,
}: {
  frase: Frase;
  onReproducirEs: () => void;
  onReproducirQu: () => void;
  onAlternarFavorito: () => void;
}) {
  return (
    <View style={{ borderWidth: 1, borderColor: "#CCC", borderRadius: 8, padding: 14, gap: 8 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "#1A1A1A", flex: 1 }}>{frase.fraseEs}</Text>
        <Pressable onPress={onReproducirEs} hitSlop={8}>
          <Text>🔊</Text>
        </Pressable>
      </View>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={{ color: "#60646C", fontStyle: "italic", flex: 1 }}>{frase.fraseQu}</Text>
        <Pressable onPress={onReproducirQu} hitSlop={8}>
          <Text>🔊</Text>
        </Pressable>
      </View>

      <Pressable onPress={onAlternarFavorito} style={{ alignSelf: "flex-end" }} hitSlop={8}>
        <Text style={{ fontSize: 18 }}>{frase.esFavorita ? "⭐" : "☆"}</Text>
      </Pressable>
    </View>
  );
}
