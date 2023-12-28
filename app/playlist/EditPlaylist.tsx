import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput
} from 'react-native';

import { StatusBar } from 'expo-status-bar';
import Toast from 'react-native-root-toast';
import { useNavigation } from "expo-router";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import Colors from '@/constants/Colors';
import { editPlaylist } from '@/state/slices/playlistSlice';
import BackButtonArrow from '@/components/BackButtonArrow';
import { setTemptPlaylistData } from '@/state/slices/temptDataSlice';


export default function EditPlaylist() {
  const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector((state: RootState) => state.settings);
  const temptData = useSelector((state: RootState) => state.temptData);

  const [playlists, setPlaylists] = useState(temptData.temptPlaylist);
  const [playlistTitleValue, setPlaylistTitleValue] = useState(playlists.title);
  const [playlistDescriptionValue, setPlaylistDescriptionValue] = useState(playlists.description || '');

  useEffect(() => {
    setPlaylists(temptData.temptPlaylist);
    setPlaylistTitleValue(temptData.temptPlaylist.title);
    setPlaylistDescriptionValue(temptData.temptPlaylist.description || '');
  }, [temptData.temptPlaylist]);


  const editPlaylistFunc = () => {
    // console.log(playlistTitleValue);
    dispatch(editPlaylist({
      oldTitle: playlists.title,
      newTitle: playlistTitleValue,
      description: playlistDescriptionValue
    }));

    dispatch(setTemptPlaylistData({
      ...playlists,
      title: playlistTitleValue,
      description: playlistDescriptionValue
    }));

    const msg = `playlist updated √`;
    let toast = Toast.show(msg, {
        duration: Toast.durations.LONG,
        // position: Toast.positions.BOTTOM,
        // shadow: true,
        // animation: true,
        // hideOnPress: true,
        // delay: 0,
    });

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
      backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground
    },
    playlistTitleInput: {
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
    },
    headerBackground: {
      backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.headerBackground : Colors.light.headerBackground
    },
  });


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />


      <View style={[themeStyles.headerBackground, styles.headerContainer]}>
        <BackButtonArrow />
        <Text style={[themeStyles.textColor, styles.headerTitle]}>
          Edit Playlist
        </Text>
        <Text></Text>
      </View>

      <View style={{padding: 16, flex: 1}}>
        <View style={[styles.inputContainer, themeStyles.inputContainer]}>
          <Text style={[themeStyles.textColor, {fontSize: 24, marginBottom: 10}]}>
            <Text>Playlist Title</Text>
            <Text style={{color: '#de2341'}}> *</Text>
          </Text>

          <TextInput
            style={[styles.playlistTitleInput, themeStyles.playlistTitleInput]}
            onChangeText={setPlaylistTitleValue}
            value={playlistTitleValue}
            selectionColor={themeStyles.textColor.color}
            placeholder="Enter Playlist Title..."
            placeholderTextColor={'gray'}
            keyboardType="default"
            returnKeyType="next"
            // blurOnSubmit={true}
            inputMode="text"
            enterKeyHint="next"
            onKeyPress={({nativeEvent: {key: keyValue}}) => {
              // const enteredKey = nativeEvent.key;
              // console.log(keyValue);
              if (keyValue == 'Enter') {
                editPlaylistFunc();
              }
            }}
            autoFocus={true}
          />
        </View>

        <View style={[styles.inputContainer, themeStyles.inputContainer, {marginTop: 25}]}>
          <Text style={[themeStyles.textColor, {fontSize: 24, marginBottom: 10}]}>
            <Text>Playlist Description</Text>
          </Text>

          <TextInput
            style={[styles.playlistDescriptionInput, themeStyles.playlistTitleInput]}
            onChangeText={setPlaylistDescriptionValue}
            value={playlistDescriptionValue}
            selectionColor={themeStyles.textColor.color}
            multiline={true}
            editable={true}
            numberOfLines={5}
            placeholder="Enter Playlist Description..."
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
                editPlaylistFunc();
              }
            }}
          />
        </View>

        <View style={{marginTop: 'auto'}}>
          <TouchableOpacity
            onPress={() => { editPlaylistFunc(); }}
            disabled={playlistTitleValue ? false : true}
            style={[styles.btnContainer, { backgroundColor: playlistTitleValue ? Colors.primary : Colors.primaryDark }]}
          >
            <Text style={[themeStyles.textColor, styles.btnText, { color: playlistTitleValue ? themeStyles.textColor.color : 'gray' } ]}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  playlistTitleInput: {
    // height: 40,
    // margin: 16,
    borderWidth: 0.4,
    borderRadius: 5,
    // borderColor: 'gray',
    padding: 10,
    fontSize: 16,
    flexGrow: 1,
  },
  playlistDescriptionInput: {
    flexGrow: 1,
    borderWidth: 0.4,
    borderRadius: 5,
    // borderColor: 'gray',
    // maxHeight: 150,
    // backgroundColor: '#fff',
    height: 150,
    fontSize: 16,
    padding: 10
  },
  inputContainer: {
    // flexDirection: 'row',
    // padding: 16,
    borderBottomWidth: 1,
  },
  btnContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: Colors.primaryDark,
    padding: 7,
    borderRadius: 5,
    marginLeft: 10,
  },
  btnText: {
    fontSize: 30,
    // color: 'gray'
  },
  headerContainer: {
    marginBottom: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 16, 
  },
  headerTitle: {
    fontSize: 30,
    // fontWeight: 'bold'
  },

  
});
