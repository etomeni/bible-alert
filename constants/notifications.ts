import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";

// import * as TaskManager from "expo-task-manager";

import {
  _Playlists_,
  bibleInterface,
  notificationData,
  scheduleInterface,
} from "./modelTypes";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function schedulePushNotification(
  notificationData: notificationData,
  identifier = ""
) {
  // Notifications.cancelAllScheduledNotificationsAsync();

  const gddf = notificationData.bibleVerse;
  const notificationId =
    identifier == ""
      ? `${gddf.book_name}${gddf.chapter}${gddf.verse}`
      : identifier;

  if (Platform.OS == "android") {
    await Notifications.setNotificationChannelAsync(notificationId, {
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      name: notificationData.title,
      description: notificationData.msg,
      sound: "urgent_simple.wav", // Provide ONLY the base filename
      showBadge: true,
      enableVibrate: true,
    });
  }

  const _sec =
    notificationData.schedule.minute * 60 +
    notificationData.schedule.hour * 3600;

  await Notifications.scheduleNotificationAsync({
    identifier: notificationId, // Platform.OS == "android" ? notificationId : undefined,
    content: {
      title: notificationData.title,
      body: notificationData.msg,
      sound: "urgent_simple.wav",
      autoDismiss: false,
      // subtitle: '',
      vibrate: [0, 250, 250, 250],
      data: {
        schedule: notificationData.schedule || "",
        playlist: notificationData.playlistData || "",
        bibleVerse: notificationData.bibleVerse || "",
      },
    },
    trigger: {
      seconds: notificationData.schedule.repeats ? _sec : 5,
      repeats: false,
      channelId: notificationId, // Platform.OS == "android" ? notificationId : undefined,
    },
  });
}

export function scheduleNextNotification(
  playlists: _Playlists_[],
  notificationPlaylist: _Playlists_,
  notificationBibleVerse: bibleInterface,
  notificationSchedule: scheduleInterface
) {
  const indexOfPlaylist = playlists.findIndex(
    (obj) => obj.title == notificationPlaylist.title
  );
  if (indexOfPlaylist !== -1) {
    const currentPlaylist = playlists[indexOfPlaylist];

    const indexOfBibleVerse = currentPlaylist.lists.findIndex(
      (obj) =>
        obj.book == notificationBibleVerse.book &&
        obj.chapter == notificationBibleVerse.chapter &&
        obj.verse == notificationBibleVerse.verse
    );
    if (indexOfBibleVerse !== -1) {
      const newIndex =
        indexOfBibleVerse < currentPlaylist.lists.length - 1
          ? indexOfBibleVerse + 1
          : 0;
      const newBibleVerse = currentPlaylist.lists[newIndex];

      // console.log(notificationSchedule);

      const newNotificationData: notificationData = {
        title: currentPlaylist.title,
        msg: `${
          newBibleVerse.book_name +
          " " +
          newBibleVerse.chapter +
          ":" +
          newBibleVerse.verse
        } \n ${newBibleVerse.text}`,
        schedule: {
          hour: notificationSchedule.hour,
          minute: notificationSchedule.minute,
          repeats: notificationSchedule.repeats,
        },
        // schedule: notificationSchedule,
        extraData: "Extra data goes here...",
        playlistData: currentPlaylist,
        bibleVerse: newBibleVerse,
      };

      schedulePushNotification(newNotificationData);
    }
  }
}

export function handleAdd_Delete_PlaylistNotification(
  new_Playlist: _Playlists_
) {
  // await Notifications.cancelAllScheduledNotificationsAsync();

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  if (
    lastNotificationResponse != null ||
    lastNotificationResponse != undefined
  ) {
    const notificationData =
      lastNotificationResponse.notification.request.content.data;

    const notificationPlaylist: _Playlists_ = notificationData.playlist;
    const notificationBibleVerse: bibleInterface = notificationData.bibleVerse;
    const notificationSchedule: scheduleInterface = notificationData.schedule;

    const indexOfBibleVerse = new_Playlist.lists.findIndex(
      (obj) =>
        obj.book == notificationBibleVerse.book &&
        obj.chapter == notificationBibleVerse.chapter &&
        obj.verse == notificationBibleVerse.verse
    );
    if (indexOfBibleVerse !== -1) {
      let newIndex =
        indexOfBibleVerse < new_Playlist.lists.length - 1
          ? indexOfBibleVerse + 1
          : 0;
      const newBibleVerse = new_Playlist.lists[newIndex];

      for (let i = 0; i < 500; i++) {
        const _incremental = i + 1;
        newIndex = (newIndex + 1) % new_Playlist.lists.length;

        const newNotificationData: notificationData = {
          title: new_Playlist.title,
          msg: `${
            newBibleVerse.book_name +
            " " +
            newBibleVerse.chapter +
            ":" +
            newBibleVerse.verse
          } \n ${newBibleVerse.text}`,
          schedule: {
            hour: notificationSchedule.hour,
            minute: notificationSchedule.minute,
            repeats: notificationSchedule.repeats,
          },
          // schedule: notificationSchedule,
          extraData: "Extra data goes here...",
          playlistData: new_Playlist,
          bibleVerse: newBibleVerse,
        };

        schedulePushNotification(newNotificationData);
      }
    } else {
      let newIndex = 0;
      for (let i = 0; i < 500; i++) {
        const _incremental = i + 1;
        newIndex = (newIndex + 1) % new_Playlist.lists.length;

        const newBibleVerse = new_Playlist.lists[newIndex];

        const newNotificationData: notificationData = {
          title: new_Playlist.title,
          msg: `${
            newBibleVerse.book_name +
            " " +
            newBibleVerse.chapter +
            ":" +
            newBibleVerse.verse
          } \n ${newBibleVerse.text}`,
          schedule: {
            hour: notificationSchedule.hour,
            minute: notificationSchedule.minute,
            repeats: notificationSchedule.repeats,
          },
          // schedule: notificationSchedule,
          extraData: "Extra data goes here...",
          playlistData: new_Playlist,
          bibleVerse: newBibleVerse,
        };

        schedulePushNotification(newNotificationData);
      }
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

  Notifications.getLastNotificationResponseAsync().then((response) => {
    if (!isMounted || !response?.notification) {
      return;
    }
    redirect(response?.notification);
  });

  const subscription = Notifications.addNotificationResponseReceivedListener(
    (response) => {
      redirect(response.notification);
    }
  );

  setTimeout(() => {
    isMounted = false;
    subscription.remove();
  }, 600);
}

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: "your-project-id",
      })
    ).data;
    // console.log(token);
  } else {
    alert("Must use physical device for Push Notifications");
  }

  return token;
}

// export function scheduleBackgroundNotification() {
//   const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

//   TaskManager.defineTask(
//     BACKGROUND_NOTIFICATION_TASK,
//     ({ data, error, executionInfo }) => {
//       console.log("Received a notification in the background!");
//       console.log(data);
//       console.log(executionInfo);
//       // Do something with the notification data

//       const notificationData: any = data;
//       const notificationPlaylist: _Playlists_ = notificationData.playlist;
//       const notificationBibleVerse: bibleInterface =
//         notificationData.bibleVerse;
//       const notificationSchedule: scheduleInterface = notificationData.schedule;

//       getLocalStorage("playlists").then((res) => {
//         if (res) {
//           scheduleNextNotification(
//             res,
//             notificationPlaylist,
//             notificationBibleVerse,
//             notificationSchedule
//           );
//         }
//       });
//     }
//   );

//   Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
// }
