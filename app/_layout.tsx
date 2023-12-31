import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
// import { useColorScheme, Text, TouchableOpacity} from 'react-native';

import * as Notifications from 'expo-notifications';

// import { Ionicons } from '@expo/vector-icons';

import { store } from './../state/store';
import { Provider } from 'react-redux';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { RootSiblingParent } from 'react-native-root-siblings';

import { EventRegister } from 'react-native-event-listeners'

import { LogBox } from 'react-native';
import { getLocalStorage, setLocalStorage } from '@/constants/resources';
import { _Playlists_, bibleInterface, scheduleInterface, settingsInterface } from '@/constants/modelTypes';
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


function handleNotificationNavigations() {
  useEffect(() => {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      // const url = notification.request.content.data?.url;
      const notificationPlaylist: _Playlists_ = notification.request.content.data.playlist;
      const notificationBibleVerse: bibleInterface = notification.request.content.data.bibleVerse;
      const notificationSchedule: scheduleInterface = notification.request.content.data.schedule;

      // setLocalStorage("notificationData", {
      //   notificationPlaylist,
      //   notificationBibleVerse,
      //   notificationSchedule
      // });

      // if (url) {
      //   router.push(url);
      // }

      // const bibleVerse: bibleInterface = notification.request.content.data?.bibleVerse;
      // if (bibleVerse.book) {
      //   router.push("/notify");
      //   // router.push("/playlist/ViewPlaylist");
      //   // router.setParams({});
      // }

      router.push("/playlist/ViewNotificationPlaylist");
    }

    Notifications.getLastNotificationResponseAsync()
      .then(response => {
        if (!isMounted || !response?.notification) {
          return;
        }
        redirect(response?.notification);
      });

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      redirect(response.notification);
    });

    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);
}

function RootLayoutNav() {
  // const colorScheme = useColorScheme();
  // const navigation = useNavigation();
  const [isDark, setIsDark] = useState<boolean>(true);

  handleNotificationNavigations();

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
                headerLeft: () => (
                  <BackButtonArrow />
                ),
              }} />
              
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

              <Stack.Screen name="playlist/ViewNotificationPlaylist" options={{ 
                headerShown: false,
                headerTitleStyle: { fontSize: 30 },
                headerLeft: () => (
                  <BackButtonArrow />
                ),
                title: 'Notifications'
              }} />

              <Stack.Screen name="notify" options={{ 
                headerShown: false,
                headerTitleStyle: { fontSize: 30 },
                headerLeft: () => (
                  <BackButtonArrow />
                ),
                title: 'Test Notifications'
              }} />
            </Stack>
          </ThemeProvider>
        </RootSiblingParent>
      </BottomSheetModalProvider>
    </Provider>
  );
}
