import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useAuth } from '@/core/auth/AuthContext';

export default function HomeScreen() {
  const { cargando, usuario, cerrarSesion } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && !usuario) router.replace('/login');
  }, [cargando, usuario]);

  if (cargando || !usuario) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Bienvenido, {usuario.nombres}</Text>
      <Text>Rol: {usuario.rol}</Text>

      <Pressable
        onPress={() => router.push('/preferencias')}
        style={{ borderWidth: 1, borderRadius: 8, padding: 14, alignItems: 'center' }}
      >
        <Text>Editar preferencias</Text>
      </Pressable>

      <Pressable
        onPress={cerrarSesion}
        style={{ backgroundColor: '#208AEF', borderRadius: 8, padding: 14, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Cerrar sesion</Text>
      </Pressable>
    </View>
  );
}
