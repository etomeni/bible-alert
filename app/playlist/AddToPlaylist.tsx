import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity,
  Pressable, FlatList, Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link, useNavigation } from "expo-router";
import Toast from 'react-native-root-toast';

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { _Playlists_, bibleInterface } from '@/constants/modelTypes';
import { addToPlaylist, removeFromPlaylist } from '@/state/slices/playlistSlice';
import { handleAdd_Delete_PlaylistNotification } from '@/constants/notifications';


export default function AddToPlaylist() {
  const [playlistNameValue, setPlaylistNameValue] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigation: any = useNavigation();
  const settings = useSelector((state: RootState) => state.settings);
  const playlists = useSelector((state: RootState) => state.playlists);
  const temptData = useSelector((state: RootState) => state.temptData);
  const [displayPlaylist, setDisplayPlaylist] = useState(playlists);


  useEffect(() => {
    setDisplayPlaylist(playlists);
  }, [playlists])

  const searchPlaylistFunc = (text: string) => {
    setPlaylistNameValue(text);
    // console.log(text);

    if (text && text.length) {
      // Convert the query to lowercase for case-insensitive search
      const searchKeyWords = text.toLowerCase();
      // OPTIMIZED WAY OF PERFORMING SEARCH LIMITS
      const _search_Results = [];
      let count = 0;
      for (const obj of playlists) {
        const searchFields = obj.title.toLowerCase();
        if (searchFields.includes(searchKeyWords)) {
          _search_Results.push(obj);
          count++;
          if (count === settings.searchResultLimit) {
            break; // Stop searching once we have 500 results
          }
        }
      }

      setDisplayPlaylist(_search_Results);
    } else {
      setDisplayPlaylist(playlists);
    }
  }

  const checkInclusiveness = (lists: bibleInterface[]) => {
    const isObjectInArray = lists.some(obj =>
      obj.book === temptData.temptBibleVerse.book && 
      obj.chapter === temptData.temptBibleVerse.chapter && 
      obj.verse === temptData.temptBibleVerse.verse
    );

    return isObjectInArray;
  }

  const addToPlaylistFunc = (playlist: _Playlists_) => {
    if (checkInclusiveness(playlist.lists)) {
      dispatch(removeFromPlaylist({
        title: playlist.title,
        bibleVerse: temptData.temptBibleVerse
      }));

      const newList = playlist.lists.filter(
        (item) =>
          item.book !== temptData.temptBibleVerse.book ||
          item.chapter !== temptData.temptBibleVerse.chapter ||
          item.verse !== temptData.temptBibleVerse.verse
      );

      const _temptPlaylist = playlist;
      _temptPlaylist.lists = newList;
      setTimeout(() => {
        handleAdd_Delete_PlaylistNotification(_temptPlaylist);
      }, 500);

      const msg = `${temptData.temptBibleVerse.book_name} ${temptData.temptBibleVerse.chapter}:${temptData.temptBibleVerse.verse} has been added to ${playlist.title} playlist already!`;
      let toast = Toast.show(msg, {
          duration: Toast.durations.LONG,
          // position: Toast.positions.BOTTOM,
          // shadow: true,
          // animation: true,
          // hideOnPress: true,
          // delay: 0,
      });
    } else {
      dispatch(addToPlaylist({
        title: playlist.title,
        bibleVerse: temptData.temptBibleVerse
      }));

      const _temptPlaylist = playlist;
      _temptPlaylist.lists.push(temptData.temptBibleVerse);
      setTimeout(() => {
        handleAdd_Delete_PlaylistNotification(_temptPlaylist);
      }, 500);

      const msg = `${temptData.temptBibleVerse.book_name} ${temptData.temptBibleVerse.chapter}:${temptData.temptBibleVerse.verse} added to ${playlist.title} playlist!`;
      let toast = Toast.show(msg, {
          duration: Toast.durations.LONG,
          // position: Toast.positions.BOTTOM,
          // shadow: true,
          // animation: true,
          // hideOnPress: true,
          // delay: 0,
      });
    }

    navigation.navigate('playlist');
  }

  const themeStyles = StyleSheet.create({
    textColor: {
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
    },
    border: {
      borderColor: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
    },
    iconColor: {
      // color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.primary,
    },
    contentBg: {
      backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground
    },
    playlistNameInput: {
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
      backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.headerBackground : Colors.light.contentBackground,
      borderColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground,
      // fontSize: settings.fontSize
    }
  });


  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

      <View style={{padding: 16}}>
        <Link href="/playlist/CreateNewPlaylist" asChild style={styles.btnContainer}>
          <Pressable>
            <Text style={styles.btnText}>Create new playlist</Text>
          </Pressable>
        </Link>

        <View>
          <Text style={[themeStyles.textColor, styles.subTitleText]}>Or add to existing playlist</Text>

          <TextInput
            style={[styles.playlistNameInput, themeStyles.playlistNameInput]}
            onChangeText={(text: string) => searchPlaylistFunc(text)}
            value={playlistNameValue}
            selectionColor={themeStyles.textColor.color}
            placeholder="search your existing playlists..."
            keyboardType="web-search"
            returnKeyType="search"
            // blurOnSubmit={true}
            placeholderTextColor={'gray'}
            inputMode="search"
            enterKeyHint="search"
            onKeyPress={({nativeEvent: {key: keyValue}}) => {
              // const enteredKey = nativeEvent.key;
              // console.log(keyValue);
              if (keyValue == 'Enter') {
                searchPlaylistFunc(playlistNameValue);
              }
            }}
            autoFocus={true}
          />
        </View>


        <View style={{marginVertical: 35}}>
          <FlatList
            data={displayPlaylist}
            // ref={flatListRef}
            // initialScrollIndex={c_Index}
            renderItem={({item}) => (
              <TouchableOpacity 
                style={[themeStyles.contentBg, styles.existingPlaylist]}
                onPress={() => addToPlaylistFunc(item)}
              >
                <View>
                  <Text style={[themeStyles.textColor, styles.existingPlaylistText]}>
                    {item.title}
                  </Text>
                  <Text style={[styles.existingPlaylistText, {color: 'gray'}]}>
                    {`${item.lists.length} Verse${item.lists.length > 1 ? 's' : ''}`}
                  </Text>
                </View>

                <View>
                  {
                   checkInclusiveness(item.lists) ? (
                    <Ionicons name="radio-button-on" size={24} style={themeStyles.iconColor} />
                   ) : (
                    <Ionicons name="radio-button-off" size={24} color={'gray'} />
                   ) 
                  }
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => `${index}`}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Image source={require('@/assets/images/empty.png')} style={{ width: 250, height: 250 }} />
                <Text style={[styles.emptyPlaylistText, themeStyles.textColor]}>
                  You don't have a playlist with that title.
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>

  )
}


const styles = StyleSheet.create({
  playlistNameInput: {
    // height: 40,
    // margin: 16,
    borderWidth: 0.4,
    borderRadius: 5,
    // borderColor: 'gray',
    padding: 10,
    fontSize: 16,
    flexGrow: 1,
  },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 35,
    marginLeft: 10,
  },
  btnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase'
  },
  subTitleText: {
    fontSize: 20,
    // fontWeight: 'bold',
    // color: 'white',
    marginVertical: 25
  },
  existingPlaylist: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    padding: 15,
    borderRadius: 5,
  },
  existingPlaylistText: {
    fontSize: 18
  },
  iconColor: {
    color: Colors.primary
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginVertical: '20%',
  },
  emptyPlaylistText: {
    // color: 'gray',
    fontSize: 18,
    textAlign: 'center'
  }
  
});
