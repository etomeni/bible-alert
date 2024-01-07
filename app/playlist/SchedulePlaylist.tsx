import { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import Toast from 'react-native-root-toast';
import { useDispatch, useSelector } from 'react-redux';
import Colors from '@/constants/Colors';
import { _Playlists_, notificationData } from '@/constants/modelTypes';
import { AppDispatch, RootState } from '@/state/store';
import { schedulePlaylist } from '@/state/slices/playlistSlice';
import { schedulePushNotification } from '@/constants/notifications';
import BackButtonArrow from '@/components/BackButtonArrow';

export default function ScheduleAlert() {
    const dispatch = useDispatch<AppDispatch>();
    const playlists = useSelector((state: RootState) => state.temptData.temptPlaylist);
    const settings = useSelector((state: RootState) => state.settings);
    const [scheduleAlertStatus, setScheduleAlertStatus] = useState<boolean>(playlists.schedule?.status || false);
    const [_hours, _setHours] = useState(playlists.schedule?.hourIntervals || '');
    const [_minutes, _setMinutes] = useState(playlists.schedule?.minutesIntervals || '');
    const [error, setError] = useState(false);

    const savePlaylistSchedule = () => {
        if (scheduleAlertStatus) {
            const hourz = _hours || Number(_hours) > 0 ? Number(_hours) : 0;
            const minutez = _minutes || Number(_minutes) > 0 ? Number(_minutes) : 0;
            if (!hourz && !minutez) {
                setError(true);
                return;
            } else {
                setError(false);
            }

            dispatch(schedulePlaylist({
                title: playlists.title,
                schedule: { 
                    // ...playlists.schedule,
                    status: scheduleAlertStatus,
                    hourIntervals: _hours,
                    minutesIntervals: _minutes,
                },
            }));

            const newNotificationData: notificationData = {
                title: playlists.title,
                // msg: "Here is the notification body", 
                msg: `${playlists.lists[0].book_name + " " + playlists.lists[0].chapter + ":" + playlists.lists[0].verse } \n ${playlists.lists[0].text}`,
                schedule: {
                    hour: hourz,
                    minute: minutez,
                    repeats: scheduleAlertStatus
                }, 
                extraData: 'Extra data goes here...',
                bibleVerse: playlists.lists[0],
                playlistData: playlists
            }

            schedulePushNotification(newNotificationData);

            const msg = `${playlists.title} scheduled to play every ${_hours} _hour(s):${_minutes} minutes`;
            let toast = Toast.show(msg, {
                duration: Toast.durations.LONG,
                position: Toast.positions.BOTTOM,
                shadow: true,
                animation: true,
                // hideOnPress: true,
                // delay: 0,
            });
      
        } else {
            dispatch(schedulePlaylist({
                title: playlists.title,
                schedule: { 
                    // ...playlists.schedule,
                    status: scheduleAlertStatus,
                    hourIntervals: '',
                    minutesIntervals: '',
                },
            }));

            // TODO::::::
            // remove every scheduled notification if there be any
        }
        router.back();
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
        background: {
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.background : Colors.light.background
        },
        border: {
            borderColor: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        },
        iconColor: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.primary,
        },
        contentBg: {
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground
        },
        BSbackground: {
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.BottomSheetBackground : Colors.light.BottomSheetBackground
        },
        headerBackground: {
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.headerBackground : Colors.light.headerBackground
        },
        inputField: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground,
            borderColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : Colors.light.text,
        },
        btnText: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        }
      
    });

    return (
        <>
            <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

            <Stack.Screen options={{ 
                headerShown: true,
                headerTitleStyle:  { fontSize: 24 },
                header: () => (
                    <SafeAreaView style={themeStyles.headerBackground}>
                        <View style={styles.headerContainer}>
                            <BackButtonArrow />
                            <Text style={[themeStyles.textColor, styles.headerTitle]}>
                                Schedule Playlist
                            </Text>
                            <Text></Text>
                        </View>
                    </SafeAreaView>
                ),
                headerTitle: 'Schedule Playlist',
                title: 'Schedule Playlist'
            }} />

            <View style={{padding: 16}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                    <Text style={[themeStyles.textColor, {fontSize: 30}]}>Schedule Alert</Text>
                    <Switch 
                        value={scheduleAlertStatus} 
                        onValueChange={setScheduleAlertStatus} 
                        thumbColor={Colors.primary} 
                        trackColor={{false: 'gray', true: Colors.primaryDark}}
                        ios_backgroundColor={'gray'}
                    />
                </View>

                {
                    scheduleAlertStatus ? (
                        <View style={{marginTop: 35}}>
                            <Text style={[themeStyles.textColor, styles.setIntervalTitle]}>Set Interval</Text>

                            <View style={styles.setIntervalContainer}>
                                <View style={{flexGrow: 1}}>
                                    <Text style={[styles.setIntervalText, themeStyles.textColor]}>Hours Intervals: </Text>
                                    <TextInput
                                        style={[styles.inputField, themeStyles.inputField]}
                                        value={_hours}
                                        // onChangeText={_setHours}
                                        onChangeText={(text) => {
                                            const number = Number(text);
                                            if (!isNaN(number) && number <= 0) {
                                                _setHours(number == 0 ? '0' : '');
                                            } else if (!isNaN(number) && number >= 24) {
                                                _setHours('24');
                                            } else {
                                                _setHours(number.toString());
                                            }
                                        }}
                                        selectionColor={themeStyles.textColor.color}
                                        placeholder="Hours..."
                                        placeholderTextColor={'gray'}
                                        keyboardType="numeric"
                                        maxLength={2}
                                        returnKeyType="default"
                                        // blurOnSubmit={true}
                                        inputMode="numeric"
                                        enterKeyHint="done"
                                        onKeyPress={({nativeEvent: {key: keyValue}}) => {
                                            // const enteredKey = nativeEvent.key;
                                            // console.log(keyValue);
                                            if (keyValue == 'Enter') {
                                                _setHours(_minutes);
                                            }
                                        }}
                                        // autoFocus={true}
                                    />
                                </View>

                                <View style={{flexGrow: 1}}>
                                    <Text style={[styles.setIntervalText, themeStyles.textColor]}>Minutes Intervals: </Text>
                                    <TextInput
                                        style={[styles.inputField, themeStyles.inputField]}
                                        // onChangeText={_setMinutes}
                                        onChangeText={(text) => {
                                            const number = Number(text);
                                            if (!isNaN(number) && number <= 0) {
                                                _setMinutes(number == 0 ? '0' : '');
                                            } else if (!isNaN(number) && number >= 59) {
                                                _setMinutes('59');
                                            } else {
                                                _setMinutes(number.toString());
                                            }
                                        }}
                                        value={_minutes}
                                        selectionColor={themeStyles.textColor.color}
                                        placeholder="Minutes..."
                                        placeholderTextColor={'gray'}
                                        keyboardType="numeric"
                                        returnKeyType="default"
                                        maxLength={2}
                                        // blurOnSubmit={true}
                                        inputMode="numeric"
                                        enterKeyHint="done"
                                        // onSubmitEditing={Keyboard.dismiss}
                                        onKeyPress={({nativeEvent: {key: keyValue}}) => {
                                            // const enteredKey = nativeEvent.key;
                                            // console.log(keyValue);
                                            if (keyValue == 'Enter') {
                                                _setMinutes(_minutes);
                                            }
                                        }}
                                    />
                                </View>
                            </View>

                            <Text style={{color: 'red', fontSize: 16, marginTop: 10, display: error ? 'flex' : 'none' }}>
                                Alert time interval must be greater than 1 minute.
                            </Text>
                            
                        </View>
                    ) : (
                        <View></View>
                    )
                }

                <TouchableOpacity style={styles.saveBtn} onPress={() => savePlaylistSchedule()}>
                    <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    inputField: {
        // height: 40,
        // margin: 16,
        borderWidth: 0.4,
        borderRadius: 5,
        // borderColor: 'gray',
        padding: 10,
        fontSize: 20,
        // flexGrow: 1,
    },
    setIntervalTitle: {
        fontSize: 25,
        marginBottom: 15
    },
    setIntervalContainer: {
        flexDirection: 'row', 
        gap: 10, 
        justifyContent: 'space-between', 
        alignItems: 'center'
    },
    setIntervalText: {
        fontSize: 18,
        marginBottom: 7
    },
    saveBtn: {
        backgroundColor: Colors.primary, 
        marginTop: 20, 
        padding: 15, 
        alignItems: 'center',
        borderRadius: 5
    },
    btnText: {
        fontSize: 20,
        textTransform: 'uppercase',
        textAlign: 'center',
        color: '#fff'
    },
    headerContainer: {
        // marginBottom: 16, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: 16, 
    },
    headerTitle: {
        fontSize: 30,
        // fontWeight: 'bold'
    }

});
