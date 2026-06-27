import { useLocalSearchParams } from 'expo-router';
import { FrasesScreen } from '@/presentation/glosario/FrasesScreen';

export default function GlosarioCategoriaRoute() {
  const { categoriaId } = useLocalSearchParams<{ categoriaId: string }>();
  return <FrasesScreen categoriaId={Number(categoriaId)} />;
}
