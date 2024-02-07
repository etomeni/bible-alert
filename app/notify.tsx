import { useState, useEffect, useRef } from 'react';
import { Text, View, SafeAreaView, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import { scheduleNextNotification } from '@/constants/notifications';
import { _Playlists_, bibleInterface, scheduleInterface } from '@/constants/modelTypes';
import Colors from '@/constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import BackButtonArrow from '@/components/BackButtonArrow';
import { setTemptPlaylistData } from '@/state/slices/temptDataSlice';


export default function App() {
    const [notification, setNotification] = useState<any>(false);
    const notificationListener: any = useRef();
    const responseListener: any = useRef();
    const dispatch = useDispatch<AppDispatch>();
    const settings = useSelector((state: RootState) => state.settings);
    const playlists = useSelector((state: RootState) => state.playlists);

    useEffect(() => {
        notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
            setNotification(notification);
            const notificationPlaylist: _Playlists_ = notification.request.content.data.playlist;
            const notificationBibleVerse: bibleInterface = notification.request.content.data.bibleVerse;
            const notificationSchedule: scheduleInterface = notification.request.content.data.schedule;
            dispatch(setTemptPlaylistData(notificationPlaylist));

            scheduleNextNotification(
                playlists,
                notificationPlaylist,
                notificationBibleVerse,
                notificationSchedule
            );

            // const indexOfPlaylist = playlists.findIndex(obj => obj.title == notificationPlaylist.title);
            // if (indexOfPlaylist !== -1) {
            //     const currentPlaylist = playlists[indexOfPlaylist];
                
            //     const indexOfBibleVerse = currentPlaylist.lists.findIndex(obj => obj.book == notificationBibleVerse.book && obj.chapter == notificationBibleVerse.chapter && obj.verse == notificationBibleVerse.verse);
            //     if (indexOfBibleVerse !== -1) {
            //         const newIndex = indexOfBibleVerse < currentPlaylist.lists.length - 1 ? indexOfBibleVerse + 1 : 0;
            //         const newBibleVerse = currentPlaylist.lists[newIndex];
                    
            //         const newNotificationData: notificationData = {
            //             title: currentPlaylist.title,
            //             msg: `${newBibleVerse.book_name + " " + newBibleVerse.chapter + ":" + newBibleVerse.verse} \n ${newBibleVerse.text}`,
            //             schedule: {
            //                 hour: notificationSchedule.hour,
            //                 minute: notificationSchedule.minute,
            //                 repeats: true
            //             },
            //             // schedule: notificationSchedule,
            //             extraData: 'Extra data goes here...',
            //             playlistData: currentPlaylist,
            //             bibleVerse: newBibleVerse
            //         }
                    
            //         schedulePushNotification(newNotificationData);
            //     }

            // }

        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            // console.log(response.notification.request.content.data);
            const notificationData = response.notification.request.content.data;

            setNotification(response.notification);
            const notificationPlaylist: _Playlists_ = notificationData.playlist;
            const notificationBibleVerse: bibleInterface = notificationData.bibleVerse;
            const notificationSchedule: scheduleInterface = notificationData.schedule;
            dispatch(setTemptPlaylistData(notificationPlaylist));

            scheduleNextNotification(
                playlists,
                notificationPlaylist,
                notificationBibleVerse,
                notificationSchedule
            );
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
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
        playlist_ItemTitle: {
        fontSize: settings.fontSize + 5,
        color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        },
        playlist_ItemVerse: {
        fontSize: settings.fontSize,
        color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        },
        playSection: {
        borderTopColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "gray"
        }

    });

    return (

        <SafeAreaView>
            <View style={[themeStyles.headerBackground, styles.headerContainer]}>
                <BackButtonArrow />
                <Text style={[themeStyles.textColor, styles.headerTitle]}>
                    Notifications
                </Text>
                <View></View>
            </View>


            <View
                style={{
                    // flex: 1,
                    alignItems: 'center',
                    justifyContent: 'space-around',
                }}>
                <View style={{ alignItems: 'center', justifyContent: 'center', padding: 16 }}>
                    <Text style={[themeStyles.textColor, {fontSize: 30, fontWeight: 'bold', marginVertical: 20}]}>
                        Title: {notification && notification.request.content.title} 
                    </Text>

                    <Text style={[themeStyles.textColor, {fontSize: 20, marginVertical: 20}]}>
                        Body: {notification && notification.request.content.body}
                    </Text>

                    <Text style={[themeStyles.textColor, {fontSize: 18, marginVertical: 20}]}>
                        Data: {notification && JSON.stringify(notification.request.content.data)}
                    </Text>
                </View>
                

                {/* <Button
                    title="Press to schedule a notification"
                    onPress={async () => {
                        await schedulePushNotification(notificationMsg);
                    }}
                /> */}
            </View>
        </SafeAreaView>
        
    );
}


const styles = StyleSheet.create({
    headerContainer: {
        marginBottom: 16, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: 16, 
    },
    headerTitle: {
        fontSize: 30,
    },
    playlistOptions: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        padding: 16
    },
    playlistOptionText: {
        fontSize: 20
    },
  
  
    playlist_ItemTitle: {
        // fontSize: 18,
        fontWeight: 'bold'
    },
    playlist_ItemVerse: {
        // fontSize: 16,
        textAlign: 'justify'
    },
  
    listIcon: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 30
    },
    iconBTN: {
        paddingHorizontal: 10,
        justifyContent: "center",
    },
  
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: '30%',
    },
    emptySearchText: {
        color: 'gray',
        fontSize: 24
    },
    playlistInfoViewTitle: {
        fontSize: 25,
        fontWeight: 'bold',
        fontFamily: 'SpaceMono',
        paddingHorizontal: 16,
        // marginBottom: 10
    },
    playlistInfoViewDetails: {
        fontSize: 18,
        fontFamily: 'SpaceMono',
        // padding: 16,
        paddingHorizontal: 16,
        // color: 'gray'
    },
  
    playSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderTopWidth: 2,
        padding: 16,
        marginTop: 'auto',
    },
    playSectionIconContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    playPauseBTN: {
        backgroundColor: Colors.primary,
        borderRadius: 50,
        padding: 10,
    
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    }
  
  
});
  