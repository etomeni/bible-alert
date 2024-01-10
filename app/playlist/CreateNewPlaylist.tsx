import { View, Text, SafeAreaView, TextInput, 
  StyleSheet, TouchableOpacity 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from "expo-router";
import { useState } from 'react';
import Toast from 'react-native-root-toast';

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import Colors from '@/constants/Colors';
import { createNewPlaylist } from '@/state/slices/playlistSlice';


export default function CreateNewPlaylist() {
  const [playlistNameValue, setPlaylistNameValue] = useState('');
  const [playlistNameError, setPlaylistNameError] = useState('');
  const settings = useSelector((state: RootState) => state.settings);
  const temptBibleVerse = useSelector((state: RootState) => state.temptData.temptBibleVerse);
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const _reduxPlaylists = useSelector((state: RootState) => state.playlists);


  const createNewFunc = () => {
    // console.log(playlistNameValue);
    const searchKeyWords = playlistNameValue.toLowerCase().trim();

    let status = false;

    for (const obj of _reduxPlaylists) {
      const searchFields = obj.title.toLowerCase().trim();
      // if (searchFields.includes(searchKeyWords)) {
      if (searchFields == searchKeyWords) {
        status = true;
        break;
      }
    }

    if (status) {
      setPlaylistNameError(`Playlist already exist!`);

      // const msg = `Playlist already exist!`;
      // let toast = Toast.show(msg, {
      //   duration: Toast.durations.LONG,
      //   position: Toast.positions.BOTTOM,
      //   shadow: true,
      //   animation: true,
      //   // hideOnPress: true,
      //   // delay: 0,
      // });
      
      return;
    }


    dispatch(createNewPlaylist({
      title: playlistNameValue,
      bibleVerse: temptBibleVerse
    }));

    // const msg = `new playlist created!`;
    // let toast = Toast.show(msg, {
    //     duration: Toast.durations.LONG,
    //     // position: Toast.positions.BOTTOM,
    //     // shadow: true,
    //     // animation: true,
    //     // hideOnPress: true,
    //     // delay: 0,
    // });

    navigation.goBack();
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
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
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

      <View style={{padding: 16, flex: 1}}>
        <View style={[styles.inputContainer, themeStyles.inputContainer]}>
          <Text style={[themeStyles.textColor, {fontSize: 20, marginBottom: 16}]}>
            <Text>Enter a playlist name</Text>
            <Text style={{color: '#de2341'}}> *</Text>
          </Text>

          <TextInput
            style={[styles.playlistNameInput, themeStyles.playlistNameInput]}
            onChangeText={(text) => {
              setPlaylistNameValue(text);
              if (playlistNameError) {
                setPlaylistNameError('');
              }
            }}
            value={playlistNameValue}
            selectionColor={themeStyles.textColor.color}
            placeholder="New playlist name"
            placeholderTextColor={'gray'}
            keyboardType="default"
            returnKeyType="done"
            // blurOnSubmit={true}
            inputMode="text"
            enterKeyHint="done"
            onKeyPress={({nativeEvent: {key: keyValue}}) => {
              // const enteredKey = nativeEvent.key;
              // console.log(keyValue);
              if (keyValue == 'Enter') {
                createNewFunc();
              }
            }}
            autoFocus={true}
          />
        </View>

        <Text style={[themeStyles.textColor, styles.errorText]}>{playlistNameError}</Text>

        <View style={{marginTop: 'auto'}}>
          <TouchableOpacity
            onPress={() => { createNewFunc(); }}
            disabled={playlistNameValue ? false : true}
            style={[styles.btnContainer, { backgroundColor: playlistNameValue ? Colors.primary : Colors.primaryDark }]}
          >
            <Text style={[themeStyles.textColor, styles.btnText, { color: playlistNameValue ? themeStyles.textColor.color : 'gray' } ]}>Create</Text>
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
    // borderBottomWidth: 1,
  },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: Colors.primaryDark,
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  btnText: {
    fontSize: 20,
    textTransform: 'uppercase'
    // color: 'gray'
  },
  errorText: {
    fontSize: 16, 
    marginTop: 10, 
    color: '#de2341'
  }
  
});
