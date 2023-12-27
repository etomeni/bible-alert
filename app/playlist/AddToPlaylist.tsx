import { useState } from 'react';
import { View, Text, SafeAreaView, TextInput, StyleSheet, TouchableOpacity,
  Pressable, FlatList
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getBibleBookVerses } from '@/constants/resources';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';


export default function AddToPlaylist() {
  const [playlistNameValue, setPlaylistNameValue] = useState('');
  const settings = useSelector((state: RootState) => state.settings);


  const searchPlaylistFunc = (text: string) => {
    // console.log(text);
    
    setPlaylistNameValue(text);
  }

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
    border: {
      borderColor: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
    },
    iconColor: {
      // color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.primary,
    },
    contentBg: {
      backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff"
    },
    playlistNameInput: {
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
      backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff",
      borderColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff",
      fontSize: settings.fontSize
    },
    inputContainer: {
      borderColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff",
    },
    textSearchVerse: {
      textAlign: 'justify',
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
      fontSize: settings.fontSize + 5
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


        <View style={{marginVertical: 35,}}>
          <TouchableOpacity style={[themeStyles.contentBg, styles.existingPlaylist]}>
            {/* <FlatList /> */}

            <View>
              <Text style={[themeStyles.textColor, styles.existingPlaylistText]}>Playlist Name</Text>
              <Text style={[styles.existingPlaylistText, {color: 'gray', marginTop: 5}]}>2 Verse(s)</Text>
            </View>

            <View>
              <Ionicons name="radio-button-on" size={24} style={themeStyles.iconColor} />
              {/* <Ionicons name="radio-button-off" size={24} style={themeStyles.iconColor} /> */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[themeStyles.contentBg, styles.existingPlaylist]}>
            {/* <FlatList /> */}

            <View>
              <Text style={[themeStyles.textColor, styles.existingPlaylistText]}>Playlist Name</Text>
              <Text style={[styles.existingPlaylistText, {color: 'gray', marginTop: 5}]}>2 Verse(s)</Text>
            </View>

            <View>
              {/* <Ionicons name="radio-button-on" size={24} style={themeStyles.iconColor} /> */}
              <Ionicons name="radio-button-off" size={24} style={themeStyles.iconColor} />
            </View>
          </TouchableOpacity>
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
  inputContainer: {
    // flexDirection: 'row',
    // padding: 16,
    borderBottomWidth: 1,
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
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white'
  },
  subTitleText: {
    fontSize: 25,
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
    fontSize: 20
  },
  iconColor: {
    color: Colors.primary
  }
  
});
