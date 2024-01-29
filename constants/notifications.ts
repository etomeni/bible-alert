import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import * as TaskManager from "expo-task-manager";
import { router } from "expo-router";

import {
  _Playlists_,
  bibleInterface,
  notificationData,
  scheduleInterface,
} from "./modelTypes";
import { getLocalStorage } from "./resources";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, error, executionInfo }) => {
    // console.log("Received a notification in the background!");
    // Do something with the notification data
    // getLocalStorageItem("scheduledPlaylist");
    rescheduleNotificationHandler();
    // getLocalStorage("scheduledPlaylist").then(async (res: any) => {
    //   if (res) {
    //     // const playlists = res.
    //     const _sec = res.schedule.minutesIntervals * 60 + res.schedule.hourIntervals * 3600;
    //     const additionalTime = _sec * 45 * 1000;
    //     const xpectedEndTime = res.lastScheduledTimestamp + additionalTime;

    //     const currentTime = Date.now();

    //     if (currentTime > xpectedEndTime) {
    //       // Cancel All Scheduled Notifications
    //       await Notifications.cancelAllScheduledNotificationsAsync();

    //       let currentIndex = 0;
    //       for (let i = 0; i < 50; i++) {
    //         const _incremental = i+1;
    //         currentIndex = (currentIndex + 1) % res.lists.length;

    //         const newNotificationData: notificationData = {
    //           title: res.title,
    //           // msg: "Here is the word of God for you this hour.",
    //           msg: `${res.lists[currentIndex].book_name + " " + res.lists[currentIndex].chapter + ":" + res.lists[currentIndex].verse } \n${res.lists[currentIndex].text}`,
    //           schedule: {
    //             hour: res.schedule.hourIntervals * _incremental,
    //             minute: res.schedule.minutesIntervals * _incremental,
    //             repeats: res.schedule.status
    //           },
    //           extraData: 'Extra data goes here...',
    //           bibleVerse: res.lists[currentIndex],
    //           playlistData: res
    //         }

    //         const identifier = `${res.lists[currentIndex].book_name}${res.lists[currentIndex].chapter}${res.lists[currentIndex].verse}_${_incremental}`;
    //         schedulePushNotification(newNotificationData, identifier);
    //       }
    //     }
    //   }
    // });
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    priority: Notifications.AndroidNotificationPriority.MAX,
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
      // name: notificationData.title,
      name: notificationId,
      importance: Notifications.AndroidImportance.MAX,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      bypassDnd: true,
      // enableLights: true,
      vibrationPattern: [0, 250, 250, 250],
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
    identifier: notificationId,
    content: {
      title: notificationData.title,
      body: notificationData.msg,
      sound: "urgent_simple.wav",
      autoDismiss: false,
      priority: Notifications.AndroidNotificationPriority.MAX,
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
      channelId: notificationId,
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

      for (let i = 0; i < 50; i++) {
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
      for (let i = 0; i < 50; i++) {
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

export async function restartPlaylistNotification(new_Playlist: _Playlists_) {
  const hourz =
    Number(new_Playlist.schedule?.hourIntervals) > 0
      ? Number(new_Playlist.schedule?.hourIntervals)
      : 0;
  const minutez =
    Number(new_Playlist.schedule?.minutesIntervals) > 0
      ? Number(new_Playlist.schedule?.minutesIntervals)
      : 0;

  // Cancel All Scheduled Notifications
  await Notifications.cancelAllScheduledNotificationsAsync();

  let currentIndex = 0;
  for (let i = 0; i < 50; i++) {
    const _incremental = i + 1;
    currentIndex = (currentIndex + 1) % new_Playlist.lists.length;

    const newNotificationData: notificationData = {
      title: new_Playlist.title,
      // msg: "Here is the notification body",
      msg: `${
        new_Playlist.lists[currentIndex].book_name +
        " " +
        new_Playlist.lists[currentIndex].chapter +
        ":" +
        new_Playlist.lists[currentIndex].verse
      } \n${new_Playlist.lists[currentIndex].text}`,
      schedule: {
        hour: hourz * _incremental,
        minute: minutez * _incremental,
        repeats: new_Playlist.schedule?.status || false,
      },
      extraData: "Extra data goes here...",
      bibleVerse: new_Playlist.lists[currentIndex],
      playlistData: new_Playlist,
    };

    const identifier = `${new_Playlist.lists[currentIndex].book_name}${new_Playlist.lists[currentIndex].chapter}${new_Playlist.lists[currentIndex].verse}_${_incremental}`;
    schedulePushNotification(newNotificationData, identifier);
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

export async function rescheduleNotificationHandler() {
  const scheduledPlaylist = await getLocalStorage("scheduledPlaylist");

  if (scheduledPlaylist) {
    // const playlists = res.
    const _sec =
      scheduledPlaylist.schedule.minutesIntervals * 60 +
      scheduledPlaylist.schedule.hourIntervals * 3600;
    const additionalTime = _sec * 45 * 1000;
    const xpectedEndTime =
      scheduledPlaylist.lastScheduledTimestamp + additionalTime;

    const currentTime = Date.now();

    if (currentTime > xpectedEndTime) {
      // Cancel All Scheduled Notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      let currentIndex = 0;
      for (let i = 0; i < 50; i++) {
        const _incremental = i + 1;
        currentIndex = (currentIndex + 1) % scheduledPlaylist.lists.length;

        const newNotificationData: notificationData = {
          title: scheduledPlaylist.title,
          // msg: "Here is the word of God for you this hour.",
          msg: `${
            scheduledPlaylist.lists[currentIndex].book_name +
            " " +
            scheduledPlaylist.lists[currentIndex].chapter +
            ":" +
            scheduledPlaylist.lists[currentIndex].verse
          } \n${scheduledPlaylist.lists[currentIndex].text}`,
          schedule: {
            hour: scheduledPlaylist.schedule.hourIntervals * _incremental,
            minute: scheduledPlaylist.schedule.minutesIntervals * _incremental,
            repeats: scheduledPlaylist.schedule.status,
          },
          extraData: "Extra data goes here...",
          bibleVerse: scheduledPlaylist.lists[currentIndex],
          playlistData: scheduledPlaylist,
        };

        const identifier = `${scheduledPlaylist.lists[currentIndex].book_name}${scheduledPlaylist.lists[currentIndex].chapter}${scheduledPlaylist.lists[currentIndex].verse}_${_incremental}`;
        schedulePushNotification(newNotificationData, identifier);
      }

      return true;
    }
  }
  return false;

  // getLocalStorage("scheduledPlaylist").then(async (res: any) => {
  //   if (res) {
  //   }
  // });
}
