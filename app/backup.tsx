import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar, Platform, TextInput, ActivityIndicator } from 'react-native'

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { _Playlists_, bibleInterface } from '@/constants/modelTypes';
import Colors from '@/constants/Colors';
import Toast from 'react-native-root-toast';
import CustomHeader from '@/components/CustomHeader';
import { getFirestoreDocumentData, save2FirestoreDB } from '@/constants/firebase';
import { getCurrentDateTime, setLocalStorage } from '@/constants/resources';
import { router } from 'expo-router';
import { restorePlaylists } from '@/state/slices/playlistSlice';
import { restoreBookmark } from '@/state/slices/bookmarkSlice';

export default function Backup() {
  const settings = useSelector((state: RootState) => state.settings);
  const playlists = useSelector((state: RootState) => state.playlists);
  const bookmark = useSelector((state: RootState) => state.bookmark);
  const dispatch = useDispatch<AppDispatch>();

  const [userEmail, setUserEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [btnLoadingState, setBtnLoadingState] = useState(false);

  const handleBackup = () => {
    if (!userEmail) {
      // TODO display an error message of empty field
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setBtnLoadingState(true);

    const backupData = {
      playlists: playlists.length ? playlists : [],
      bookmark: bookmark.length ? bookmark : [],
      createdAt: getCurrentDateTime()
    }

    save2FirestoreDB("backup", backupData, userEmail)
    .then((res: any) => {
      const msg = `Backup Successfull.`;
      let toast = Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        // hideOnPress: true,
        // delay: 0,
      });
      setBtnLoadingState(false);
      router.back();
    }).catch(() => {
      const msg = `Ooops an error occurred.`;
      setErrorMsg(msg);

      let toast = Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        // hideOnPress: true,
        // delay: 0,
      });
      setBtnLoadingState(false);
    });
  }

  const handleRestore = () => {
    if (!userEmail) {
      // TODO display an error message of empty field
      setErrorMsg("Please enter a valid email address.");
      return;
    }
    setBtnLoadingState(true);

    getFirestoreDocumentData("backup", userEmail)
    .then((res: any) => {
      console.log(res);
      
      if (!res) {
        setBtnLoadingState(false);
        router.back();
        return;
      }
      
      if (res.playlists.length) {
        const _restoredPlaylist: _Playlists_[] = [...playlists, ...res.playlists];
        setLocalStorage("playlists", _restoredPlaylist);
        dispatch(restorePlaylists(_restoredPlaylist))
      }

      if (res.bookmark.length) {
        const _restoredBookmark: bibleInterface[] = [...bookmark, ...res.bookmark];
        setLocalStorage("bookmark", _restoredBookmark);
        dispatch(restoreBookmark(_restoredBookmark));
      }

      const msg = `Backup restored.`;
      let toast = Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        // hideOnPress: true,
        // delay: 0,
      });
      setBtnLoadingState(false);
      router.back();
    }).catch(() => {
      const msg = `Ooops an error occurred.`;
      setErrorMsg(msg);

      let toast = Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        // hideOnPress: true,
        // delay: 0,
      });
      setBtnLoadingState(false);
    });
  }

  const themeStyles = StyleSheet.create({
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
    BSbackground: {
      backgroundColor: settings.colorTheme == 'dark' ? "rgb(60, 60, 60)" : 'rgb(241, 241, 241)'
    },
    searchInput: {
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
      backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff",
      borderColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff",
      fontSize: 16
      // fontSize: settings.fontSize
    },
    inputContainer: {
      borderColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff",
    },
  });

  return (
    <SafeAreaView style={styles.mainContainer}>
      <StatusBar barStyle={settings.colorTheme == 'dark' ? 'light-content' : 'dark-content'} backgroundColor={Colors.primary} />
      <CustomHeader headerTitleText='Backup' />
      
      <View style={{padding: 16, marginVertical: 20}}>
        <View>
          <Text style={[themeStyles.textColor, {textAlign: 'center', fontSize: 16}]}>
            Back up your playlist and bookmark to the cloud. You can access from any device
          </Text>
        </View>

        <View style={{marginVertical: 15}}>
          <TextInput
            style={[styles.searchInput, themeStyles.searchInput]}
            onChangeText={(text) => {
              setUserEmail(text.trim().toLowerCase()); 
              if (errorMsg) {
                setErrorMsg('');
              }
            }}
            value={userEmail}
            selectionColor={themeStyles.textColor.color}
            placeholder="Enter your email address"
            placeholderTextColor={'gray'}
            keyboardType="email-address"
            returnKeyType="done"
            // blurOnSubmit={true}
            inputMode="email"
            enterKeyHint="done"
            autoFocus={true}
          />

          <View style={{marginTop: 5}}>
            <Text style={[themeStyles.textColor, {fontSize: 16, color: "#de2341"}]}>
              {errorMsg}
            </Text>
          </View>
        </View>

        <View style={{marginTop: 20}}>

          <TouchableOpacity 
            style={[styles.btn, {backgroundColor: btnLoadingState ? Colors.primaryDark : Colors.primary}]} 
            disabled={btnLoadingState}
            onPress={() => handleBackup()}
          >
            <Text style={styles.btnText}>
              {
                btnLoadingState ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : "Back Up"
              }
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.btn, {marginTop: 15, backgroundColor: btnLoadingState ? Colors.primaryDark : Colors.secondary}]} 
            disabled={btnLoadingState}
            onPress={() => handleRestore()}
          >
            <Text style={styles.btnText}>
              {
                btnLoadingState ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : "Restore"
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: Platform.OS == 'android' ? StatusBar.currentHeight : 0
  },
  searchInput: {
    // height: 40,
    // margin: 16,
    borderWidth: 0.4,
    borderRadius: 5,
    // borderColor: 'gray',
    padding: 15,
    fontSize: 16,
    flexGrow: 1,
  },
  btn: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18
  }
});