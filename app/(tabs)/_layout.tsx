import { useEffect } from 'react';
import { Link, Tabs } from 'expo-router';
import { Pressable, Text, View, 
  StyleSheet, SafeAreaView
} from 'react-native';

import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { getLocalStorage } from '@/constants/resources';
import { updateSettings } from '@/state/slices/settingsSlice';

import Colors from '@/constants/Colors';
import { restoreBookmark } from '@/state/slices/bookmarkSlice';
import { restorePlaylists } from '@/state/slices/playlistSlice';


export default function TabLayout() {
  const selectedBibleBook = useSelector((state: RootState) => state.selectedBibleBook);
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    getLocalStorage("settings").then((res) => {
      if (res && res.fontSize) {
        dispatch(updateSettings(res))
      }
    });

    getLocalStorage("bookmark").then((res) => {
      if (res) {
        dispatch(restoreBookmark(res))
      }
    });

    getLocalStorage("playlists").then((res) => {
      if (res) {
        dispatch(restorePlaylists(res))
      }
    });

  }, []);
  

  const themeStyles = StyleSheet.create({
    text: {
      // marginBottom: 16,
      textAlign: 'justify',
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
      fontSize: settings.fontSize
    },
    textColor: {
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
    },
    background: {
      backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.background : Colors.light.background
    },
    headerBackground: {
      backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : Colors.light.background
    },
    border: {
      borderColor: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
    },
    iconColor: {
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
    },
    contentBg: {
      // backgroundColor: '#f6f3ea43', // #f6f3ea43
      backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff"
    },
    versionSelction: {
      backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#f6f3ea"
    }
  });

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarActiveTintColor: "white",
        tabBarStyle: {
          backgroundColor: Colors.primary,
          borderTopEndRadius: 15,
          borderTopStartRadius: 15,
          paddingTop: 5
        },
        // tabBarShowLabel: false,
        tabBarLabelStyle: {
          fontSize: 16,
        },
        
      }}
      sceneContainerStyle={{
        // backgroundColor: Colors.colors.primary,
        borderTopRightRadius: 10
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Bible',
          tabBarIcon: ({ color }) => <FontAwesome5 name="bible" size={24} color={color} />,
          headerTitleStyle: { fontSize: 30 },
          header: () => (
            <SafeAreaView style={themeStyles.headerBackground}>
              <View style={[styles.verseSelectionContainer, themeStyles.border]}>
                <Link href="/(modals)/BibleBooks" asChild style={ {...styles.selctionWrapper, flexGrow: 3.5} }>
                  <Pressable style={{ ...styles.textContainer, ...styles.bookSelection, ...themeStyles.border }}>
                    <Text style={[styles.indexSelectionText, themeStyles.textColor]}> { selectedBibleBook.book_name } </Text>
                    <MaterialIcons name="keyboard-arrow-down" size={24} style={themeStyles.iconColor} />
                  </Pressable>
                </Link>

                <Link href="/(modals)/BookChapters" asChild style={ styles.selctionWrapper }>
                  <Pressable style={{ ...styles.textContainer, ...styles.bookSelection, ...themeStyles.border }}>
                    <Text style={[styles.indexSelectionText, themeStyles.textColor]}> { selectedBibleBook.chapter } </Text>
                    <MaterialIcons name="keyboard-arrow-down" size={24} style={themeStyles.iconColor} />
                  </Pressable>
                </Link>

                <Link href="/(modals)/BookVerses" asChild style={ styles.selctionWrapper }>
                  <Pressable style={styles.textContainer}>
                    <Text style={[styles.indexSelectionText, themeStyles.textColor]}> { selectedBibleBook.verse } </Text>
                    <MaterialIcons name="keyboard-arrow-down" size={24} style={themeStyles.iconColor} />
                  </Pressable>
                </Link>

                <Link href="/(tabs)" asChild style={ styles.selctionWrapper }>
                  <Pressable style={{ ...styles.textContainer, ...styles.versionSelction, ...themeStyles.versionSelction}}>
                    <Text style={[styles.indexSelectionText, themeStyles.textColor]}> KJV </Text>
                    <MaterialIcons name="arrow-drop-down" size={24} style={themeStyles.iconColor} />
                  </Pressable>
                </Link>
              </View>
            </SafeAreaView>
          )
        }}
      />
      <Tabs.Screen
        name="playlist"
        options={{
          title: 'Playlists',
          tabBarIcon: ({ color }) => <MaterialIcons name="playlist-play" size={24} color={color} />,
          headerTitleStyle: { fontSize: 30 },
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="search" size={24} color={color} />,
          headerTitleStyle: { fontSize: 30 }
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <AntDesign name="setting" size={24} color={color} />,
          headerTitleStyle: { fontSize: 30 }
        }}
      />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  verseSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    marginBottom: 20,
    marginHorizontal: 16,
    borderStyle: 'solid',
    borderWidth: 1.2,
    // borderColor: 'black',
    borderRadius: 20,
  },
  selctionWrapper: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'transparent',
    alignSelf: 'stretch'
  },
  bookSelection: {
    // borderRightColor: "black",
    borderRightWidth: 1,
    borderStyle: 'solid'
  },
  versionSelction: {
    // backgroundColor: '#f6f3ea43', // #f6f3ea43
    // backgroundColor: '#f6f3ea', // #f6f3ea43
    borderStyle: 'solid',
    // borderWidth: 1,
    borderRadius: 20,
  },
  verseTextContainer: {
    marginBottom: 16,
    textAlign: 'justify'
  },
  indexSelectionText: {
    textAlign: 'justify',
    fontSize: 24
  },

  searchInput: {
    height: 40,
    // margin: 16,
    borderWidth: 0.4,
    borderRadius: 5,
    borderColor: 'gray',
    padding: 10,
    fontSize: 16,
    flexGrow: 1,
  },
  inputContainer: {
    borderBottomWidth: 0.2,
    borderBottomColor: 'gray',
    borderStyle: 'solid',
    flexDirection: 'row',
    margin: 16,
  },
  searchIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 7,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchIcon: {
    color: 'white'
  }
});
