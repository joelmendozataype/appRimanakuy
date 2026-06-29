import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AuthProvider } from '@/core/auth/AuthContext';

// RIMANAKUY-Salud siempre usa tema claro: el personal de salud lo usa en
// ambientes muy iluminados y el contraste alto facilita la lectura.
export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <AuthProvider>
        <AnimatedSplashOverlay />
        <Stack
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FFFFFF' } }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="preferencias" options={{ headerShown: true, title: 'Preferencias' }} />
          <Stack.Screen
            name="glosario/index"
            options={{ headerShown: true, title: 'Glosario clinico' }}
          />
          <Stack.Screen
            name="glosario/[categoriaId]"
            options={{ headerShown: true, title: 'Frases' }}
          />
          <Stack.Screen name="favoritos" options={{ headerShown: true, title: 'Mis favoritos' }} />
          <Stack.Screen name="traductor" options={{ headerShown: true, title: 'Traductor' }} />
          <Stack.Screen name="conversacion" options={{ headerShown: true, title: 'Conversacion' }} />
        </Stack>
      </AuthProvider>
    </ThemeProvider>
  );
}
