import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Platform, TextInput, ActivityIndicator } from 'react-native'

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { _Playlists_, bibleInterface } from '@/constants/modelTypes';
import Colors from '@/constants/Colors';
import Toast from 'react-native-root-toast';
import CustomHeader from '@/components/CustomHeader';
import { getFirestoreDocumentData, save2FirestoreDB } from '@/constants/firebase';
import { getCurrentDateTime, getLocalStorage, setLocalStorage } from '@/constants/resources';
import { router } from 'expo-router';
import { restorePlaylists } from '@/state/slices/playlistSlice';
import { restoreBookmark } from '@/state/slices/bookmarkSlice';


const api = "https://alert-bible-backend.onrender.com"
  
export default function Backup() {
  const settings = useSelector((state: RootState) => state.settings);
  const playlists = useSelector((state: RootState) => state.playlists);
  const bookmark = useSelector((state: RootState) => state.bookmark);
  const dispatch = useDispatch<AppDispatch>();

  const [userEmail, setUserEmail] = useState('');
  const [tokenSent, setTokenSent] = useState('');
  const [tokenExpiration, setTokenExpiration] = useState(0);
  const [tokenInput, setTokenInput] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [tokenErrorMsg, setTokenErrorMsg] = useState('');
  const [btnLoadingState, setBtnLoadingState] = useState(false);

  const [timeRemaining, setTimeRemaining] = useState(300); // Initial time in seconds (5 minutes)
  const [disabledSendCodeBTN, setDisabledSendCodeBTN] = useState(false);
  const [disabledBTNs, setDisabledBTNs] = useState(false);


  useEffect(() => {
    getLocalStorage("userEmail").then((res) => {
      if (res) {
        setUserEmail(res);
        setTokenSent('aaa');
      } 
    });
  }, []);
  

  const handleBackup = () => {
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
      setDisabledBTNs(false);
      router.back();
    }).catch(() => {
      const msg = `Ooops an error occurred.`;
      setEmailErrorMsg(msg);

      let toast = Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        // hideOnPress: true,
        // delay: 0,
      });
      setBtnLoadingState(false);
      setDisabledBTNs(false);
    });
  }

  const handleRestore = () => {
    getFirestoreDocumentData("backup", userEmail)
    .then((res: any) => {
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
      setDisabledBTNs(false);

      router.back();
    }).catch(() => {
      const msg = `No backup found!`;
      setEmailErrorMsg(msg);

      let toast = Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        // hideOnPress: true,
        // delay: 0,
      });
      setBtnLoadingState(false);
      setDisabledBTNs(false);
    });
  }

  const handleSendVerificationToken = () => {
    const validateEmail = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Comprehensive email validation regex
      return emailRegex.test(userEmail);
    };

    if (!userEmail || !validateEmail()) {
      // TODO display an error message of empty field
      setEmailErrorMsg("Please enter a valid email address.");
      return;
    }
    setDisabledBTNs(true);
    setBtnLoadingState(true);
    setTimeRemaining(300);

    const url = `${api}/api/sendEmailVerification`
    // const url = "http://localhost:5000/api/sendEmailVerification";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: userEmail
      }),

    })
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      if (data.status != 201) {
        setEmailErrorMsg(data.message);
        return;
      }

      setTokenSent(data.token);
      setTokenExpiration(data.expiresAt);

      setDisabledBTNs(false);
      setBtnLoadingState(false);
      setDisabledSendCodeBTN(true);
      const intervalId = setInterval(() => {
        setTimeRemaining((prevTimeRemaining) => {
          if (prevTimeRemaining <= 1) {
            clearInterval(intervalId);
            setDisabledSendCodeBTN(false);
            return 0;
          }
          return prevTimeRemaining - 1;
        });
      }, 1000);
    })
    .catch(error => {
      console.log(error);
      setEmailErrorMsg(error.message);
      setDisabledBTNs(false);
      setBtnLoadingState(false);
    });
  }

  const handleTokenVerification = (action: "backup" | "restore") => {
    if (tokenSent != 'aaa') {
      
      if (!tokenInput) {
        setTokenErrorMsg("Please enter the code you recieved.");
        return;
      }
  
      if(tokenInput != tokenSent) {
        setTokenErrorMsg("Incorrect code.");
        return;
      }
  
      const currentTime = new Date().getTime();
      if(tokenExpiration && tokenExpiration < currentTime) {
        setTokenErrorMsg("The verification code token has expired, please start again.");
        return;
      }

      setLocalStorage("userEmail", userEmail);
    }

    setBtnLoadingState(true);
    setDisabledBTNs(true);

    if (action == 'backup') {
      handleBackup();
    }

    if (action == 'restore') {
      handleRestore();
    }

    const url = `${api}/api/verifyEmailVerificationCode`
    // "http://localhost:5000/api/verifyEmailVerificationCode";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        token: tokenInput
      }),

    })
    .then(response => response.json())
    .then(data => {
      // console.log(data);
      // if (data.status != 201) {
      //   // setEmailErrorMsg(data.message);
      //   return;
      // }
    })
    .catch(error => {
      console.log(error);
      // setEmailErrorMsg(error.message);
      // setDisabledBTNs(false);
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
      backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground,
      borderColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground,
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
      
      <ScrollView style={{padding: 16, marginVertical: 20}}>
        <View>
          <Text style={[themeStyles.textColor, {textAlign: 'center', fontSize: 16}]}>
            Back up your playlist and bookmark to the cloud. You can access from any device
          </Text>
        </View>

        <View style={{marginVertical: 15}}>
          <View style={{marginBottom: 10}}>
            <TextInput
              style={[styles.searchInput, themeStyles.searchInput]}
              onChangeText={(text) => {
                setUserEmail(text.trim().toLowerCase()); 
                if (emailErrorMsg) {
                  setEmailErrorMsg('');
                }
              }}
              value={userEmail}
              editable={!disabledSendCodeBTN}
              selectionColor={themeStyles.textColor.color}
              placeholder="Enter your email address"
              placeholderTextColor={'gray'}
              keyboardType="email-address"
              returnKeyType="send"
              // blurOnSubmit={true}
              inputMode="email"
              enterKeyHint="send"
              autoFocus={true}
              onKeyPress={({nativeEvent: {key: keyValue}}) => {
                // const enteredKey = nativeEvent.key;
                // console.log(keyValue);
                if (keyValue == 'Enter') {
                  handleSendVerificationToken();
                }
              }}
            />

            {
              emailErrorMsg ? (
                <View style={{marginTop: 5}}>
                  <Text style={[themeStyles.textColor, {fontSize: 16, color: "#de2341"}]}>
                    {emailErrorMsg}
                  </Text>
                </View>
              ) : <></>
            }
          </View>
        
          <TouchableOpacity 
            onPress={() => handleSendVerificationToken()}
            disabled={disabledSendCodeBTN || disabledBTNs}
            style={{backgroundColor: disabledSendCodeBTN || disabledBTNs ? Colors.primaryDark : Colors.primary, justifyContent: 'center', padding: 15, borderRadius: 5}}>
            <Text style={{color: '#fff', textAlign: 'center', fontSize: 18}}>
              {
                disabledSendCodeBTN ? 
                  `${Math.floor(timeRemaining / 60)}:${(timeRemaining % 60).toString().padStart(2, '0')}`
                : btnLoadingState ? <ActivityIndicator size="small" color="#fff" /> : "Send Code"
              }
            </Text>
          </TouchableOpacity>
        </View>

        {
          tokenSent ? (
            <View>
              {
                tokenSent == 'aaa' ? <></> : (
                  <View>
                    <View style={{padding: 15, marginVertical: 5, backgroundColor: '#00640040', borderWidth: 1, borderColor: '#006400'}}>
                      <Text style={{color: '#006400'}}>
                        An Email verification code has been sent to your email.
                        Check your spam folder if you don't see the mail.
                      </Text>
                    </View>

                    <View style={{marginVertical: 10}}>
                      <TextInput
                        style={[styles.searchInput, themeStyles.searchInput]}
                        onChangeText={(text) => {
                          setTokenInput(text.trim().toLowerCase()); 
                          if (tokenErrorMsg) {
                            setTokenErrorMsg('');
                          }
                        }}
                        value={tokenInput}
                        selectionColor={themeStyles.textColor.color}
                        placeholder="Verification code..."
                        placeholderTextColor={'gray'}
                        keyboardType="numeric"
                        returnKeyType="send"
                        // blurOnSubmit={true}
                        inputMode="numeric"
                        enterKeyHint="send"
                        // onKeyPress={({nativeEvent: {key: keyValue}}) => {
                        //   // const enteredKey = nativeEvent.key;
                        //   // console.log(keyValue);
                        //   if (keyValue == 'Enter') {
                        //     handleTokenVerification();
                        //   }
                        // }}
                      />


                      {
                        tokenErrorMsg ? (
                          <View style={{marginTop: 5}}>
                            <Text style={[themeStyles.textColor, {fontSize: 16, color: "#de2341"}]}>
                              {tokenErrorMsg}
                            </Text>
                          </View>
                        ) : <></>
                      }
                    </View>
                  </View>
                )
              }

              <View>
                <TouchableOpacity 
                  style={[styles.btn, {backgroundColor: btnLoadingState || disabledBTNs ? Colors.primaryDark : Colors.primary}]} 
                  disabled={btnLoadingState || disabledBTNs}
                  onPress={() => handleTokenVerification("backup")}
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
                  style={[styles.btn, {marginTop: 15, backgroundColor: btnLoadingState || disabledBTNs ? Colors.primaryDark : Colors.secondary}]} 
                  disabled={btnLoadingState || disabledBTNs}
                  onPress={() => handleTokenVerification("restore")}
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
          ) : <></>
        }
      </ScrollView>
    </SafeAreaView>
  );
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