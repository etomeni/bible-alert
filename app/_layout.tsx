import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { useColorScheme, Text, TouchableOpacity} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { store } from './../state/store';
import { Provider } from 'react-redux';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { RootSiblingParent } from 'react-native-root-siblings';

import { EventRegister } from 'react-native-event-listeners'

import { LogBox } from 'react-native';
import { getLocalStorage } from '@/constants/resources';
import { settingsInterface } from '@/constants/modelTypes';
import BackButtonArrow from '@/components/BackButtonArrow';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
// LogBox.ignoreAllLogs(); //Ignore all log notifications

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  // const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [isDark, setIsDark] = useState<boolean>(true);

  useEffect(() => {
    getLocalStorage("settings").then((res: settingsInterface) => {
      if (res && res.colorTheme) {
        const _dark = res.colorTheme == 'dark' ? true : false;
        setIsDark(_dark);
      }
    })
  }, []);
  
  useEffect(() => {
    const listener: any = EventRegister.addEventListener('colorTheme', (data) => {
      if (data) {
        const _dark = data == 'dark' ? true : false;
        setIsDark(_dark);
      }
    });

    return () => {
      // EventRegister.removeEventListener(listener);
      EventRegister.removeAllListeners();
    }
  }, [isDark]);


  return (
    <Provider store={store}>
      <BottomSheetModalProvider>
        <RootSiblingParent>
          {/* <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> */}
          <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
            <Stack>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(modals)/BibleBooks" options={{ 
                presentation: 'modal',
                title: "Choose a book of the Bible",
                // headerShadowVisible: false,
                headerTitleStyle: { fontSize: 30 },
                headerLeft: () => (
                  <BackButtonArrow />
                ),
              }} />
              <Stack.Screen name="(modals)/BookChapters" options={{ 
                presentation: 'modal',
                title: "Chapters",
                headerTitleStyle: { fontSize: 30 },
                headerLeft: () => (
                  <BackButtonArrow />
                ),
              }} />
              <Stack.Screen name="(modals)/BookVerses" options={{ 
                presentation: 'modal',
                title: "Verses",
                headerTitleStyle: { fontSize: 30 },
                headerLeft: () => (
                  <BackButtonArrow />
                )
              }} />

              <Stack.Screen name="bookmark" options={{ 
                headerShown: true, title: "Bookmarks",
                headerTitleStyle: { fontSize: 30 },
                // headerBackVisible: false
              }} />
              {/* <Stack.Screen name="PlaylistView" options={{ 
                presentation: 'modal', headerShown: false ,
                headerTitleStyle: { fontSize: 30 },
                headerLeft: () => (
                  <BackButtonArrow />
                ),
              }} />
              <Stack.Screen name="PlaylistEdit" options={{ 
                presentation: 'modal', headerShown: false,
                headerTitleStyle: { fontSize: 30 },
                headerLeft: () => (
                  <BackButtonArrow />
                ),
              }} /> */}

              <Stack.Screen name="playlist/CreateNewPlaylist" options={{ 
                presentation: 'modal', headerShown: true,
                headerTitleStyle: { fontSize: 30 },
                headerLeft: () => (
                  <BackButtonArrow />
                ),
                title: 'Create New Playlist'
              }} />
              <Stack.Screen name="playlist/AddToPlaylist" options={{ 
                presentation: 'modal', headerShown: true,
                headerTitleStyle: { fontSize: 30 },
                headerLeft: () => (
                  <BackButtonArrow />
                ),
                title: 'Add To Playlists'
              }} />
              <Stack.Screen name="playlist/EditPlaylist" options={{ 
                presentation: 'modal', 
                headerShown: false,
                headerTitleStyle: { fontSize: 30 },
                headerLeft: () => (
                  <BackButtonArrow />
                ),
                headerTitle: 'Edit Playlist',
                title: 'Edit Playlist'
              }} />
              <Stack.Screen name="playlist/ViewPlaylist" options={{ 
                headerShown: false,
                headerTitleStyle: { fontSize: 30 },
                headerLeft: () => (
                  <BackButtonArrow />
                ),
                title: 'Playlist'
              }} />
            </Stack>
          </ThemeProvider>
        </RootSiblingParent>
      </BottomSheetModalProvider>
    </Provider>
  );
}
