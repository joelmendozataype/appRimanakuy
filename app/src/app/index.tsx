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
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'center', gap: 16, backgroundColor: '#FFFFFF' }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' }}>
        Bienvenido, {usuario.nombres}
      </Text>
      <Text style={{ color: '#1A1A1A' }}>Rol: {usuario.rol}</Text>

      <Pressable
        onPress={() => router.push('/conversacion')}
        style={{ backgroundColor: '#208AEF', borderRadius: 8, padding: 14, alignItems: 'center' }}
      >
        <Text style={{ color: '#fff', fontWeight: '600' }}>Conversacion (voz)</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/traductor')}
        style={{ borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 14, alignItems: 'center' }}
      >
        <Text style={{ color: '#1A1A1A' }}>Traducir texto</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/glosario')}
        style={{ borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 14, alignItems: 'center' }}
      >
        <Text style={{ color: '#1A1A1A' }}>Glosario de frases</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/favoritos')}
        style={{ borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 14, alignItems: 'center' }}
      >
        <Text style={{ color: '#1A1A1A' }}>Mis favoritos</Text>
      </Pressable>

      <Pressable
        onPress={() => router.push('/preferencias')}
        style={{ borderWidth: 1, borderColor: '#CCC', borderRadius: 8, padding: 14, alignItems: 'center' }}
      >
        <Text style={{ color: '#1A1A1A' }}>Editar preferencias</Text>
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
