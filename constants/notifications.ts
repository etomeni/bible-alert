import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { router } from 'expo-router';
import { _Playlists_, bibleInterface, notificationData, scheduleInterface } from './modelTypes';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
    }),
});

export async function schedulePushNotification(notificationData: notificationData) {
    const gddf = notificationData.bibleVerse;
    const notificationId = `${gddf.book_name}${gddf.chapter}${gddf.verse}`;

    await Notifications.setNotificationChannelAsync(notificationId, {
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        name: notificationData.title,
        description: notificationData.msg,
        sound: 'urgent_simple.wav', // Provide ONLY the base filename
        showBadge: true,
        enableVibrate: true,
    });

    const _sec = (notificationData.schedule.minute * 60) + (notificationData.schedule.hour * 3600);
    await Notifications.scheduleNotificationAsync({
        identifier: notificationId,
        content: {
            title: notificationData.title,
            body: notificationData.msg,
            sound: 'urgent_simple.wav',
            autoDismiss: false,
            // subtitle: '',
            vibrate: [0, 250, 250, 250],
            data: { 
                schedule: notificationData.schedule || '',
                playlist: notificationData.playlistData || '',
                bibleVerse: notificationData.bibleVerse || '',
            },
        },
        trigger: {
            seconds: notificationData.schedule.repeats ? _sec : 5,
            repeats: false,
            channelId: notificationId
        }
    });
}


export function scheduleNextNotification(
    playlists: _Playlists_[],
    notificationPlaylist: _Playlists_,
    notificationBibleVerse: bibleInterface,
    notificationSchedule: scheduleInterface
) {
    
    const indexOfPlaylist = playlists.findIndex(obj => obj.title == notificationPlaylist.title);
    if (indexOfPlaylist !== -1) {
        const currentPlaylist = playlists[indexOfPlaylist];
        
        const indexOfBibleVerse = currentPlaylist.lists.findIndex(obj => obj.book == notificationBibleVerse.book && obj.chapter == notificationBibleVerse.chapter && obj.verse == notificationBibleVerse.verse);
        if (indexOfBibleVerse !== -1) {
            const newIndex = indexOfBibleVerse < currentPlaylist.lists.length - 1 ? indexOfBibleVerse + 1 : 0;
            const newBibleVerse = currentPlaylist.lists[newIndex];
            
            // console.log(notificationSchedule);
            
            const newNotificationData: notificationData = {
                title: currentPlaylist.title,
                msg: `${newBibleVerse.book_name + " " + newBibleVerse.chapter + ":" + newBibleVerse.verse} \n ${newBibleVerse.text}`,
                schedule: {
                    hour: notificationSchedule.hour,
                    minute: notificationSchedule.minute,
                    repeats: notificationSchedule.repeats
                },
                // schedule: notificationSchedule,
                extraData: 'Extra data goes here...',
                playlistData: currentPlaylist,
                bibleVerse: newBibleVerse
            }
            
            schedulePushNotification(newNotificationData);
        }

    }

}

export function handleNotificationNavigations() {
    let isMounted = true;

    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (url) {
        router.push(url);
      }
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

    setTimeout(() => {
        isMounted = false;
        subscription.remove();
    }, 600);
};

export async function registerForPushNotificationsAsync() {

    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        token = (await Notifications.getExpoPushTokenAsync({ projectId: 'your-project-id' })).data;
        // console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}
