import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,
  FlatList, Image, Share, ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-root-toast';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Stack, router } from "expo-router";
import * as Speech from 'expo-speech';
import * as Notifications from 'expo-notifications';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import Colors from '@/constants/Colors';
import BackButtonArrow from '@/components/BackButtonArrow';
import { _Playlists_, bibleInterface, scheduleInterface } from '@/constants/modelTypes';
import { set_SelectedBible } from '@/state/slices/bibleSelectionSlice';
import { getBibleBookVerses } from '@/constants/resources';
import { bibleDetails } from '@/state/slices/bibleVerseSlice';
import bibleKJV from "@/assets/bible/kjv_all";
import bible_KJV from "@/assets/bible/kjvTS";
import { deletePlaylist, removeFromPlaylist } from '@/state/slices/playlistSlice';
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet'
import Loading from '@/components/Loading';
import { scheduleNextNotification } from '@/constants/notifications';
import { bibleVerseToRead, shareBibleVerse } from '@/constants/bibleResource';


export default function ViewPlaylist() {
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector((state: RootState) => state.settings);
  // const temptPlaylist = useSelector((state: RootState) => state.temptData.temptPlaylist);
  const allPlaylist_ = useSelector((state: RootState) => state.playlists);

  const [playlists, setPlaylists] = useState<_Playlists_>();

  const [playingIndex, setPlayingIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  // const [playingEnded, setPlayingEnded] = useState<boolean>(true);
  const [highlightedVerse, setHighlightedVerse] = useState<bibleInterface>({
    book_name: '',
    book: 0,
    chapter: 0,
    verse: 0,
    text: '',
  });

  const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
  const renderBackdrop = useCallback((props: any) => 
    <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} { ...props } />
  ,[]);
  const { dismiss } = useBottomSheetModal();
  const playlistInfoRef = useRef<BottomSheetModal>(null);

  // useEffect(() => {
  //   Notifications.dismissAllNotificationsAsync();
  //   // Notifications.dismissNotificationAsync();
  // }, []);
  

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    Notifications.dismissAllNotificationsAsync();
    // Notifications.dismissNotificationAsync();

    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.playlist
      // lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      // console.log("lastNotificationResponse");

      const notificationData = lastNotificationResponse.notification.request.content.data;

      const notificationPlaylist: _Playlists_ = notificationData.playlist;
      const notificationBibleVerse: bibleInterface = notificationData.bibleVerse;
      const notificationSchedule: scheduleInterface = notificationData.schedule;

      setPlaylists(notificationPlaylist);
      setHighlightedVerse(notificationBibleVerse);

      scheduleNextNotification(
        allPlaylist_,
        notificationPlaylist,
        notificationBibleVerse,
        notificationSchedule
      );
      
      setTimeout(() => {
        _play_(notificationBibleVerse);
      }, 500);
    }
  }, [lastNotificationResponse]);
  

  const _play_ = (highlightedVerse: bibleInterface) => {
    const thingToSay = bibleVerseToRead(highlightedVerse);

    let _speechOptions: Speech.SpeechOptions = {
      rate: 0.8,
      pitch: 0.6,
      // voice: 'com.apple.ttsbundle.Moira-compact'
      onDone: () => onSpeakingEnd(),
      onStart: () => onSpeakingStart(),
      onStopped: () => onClickPause(),
    };

    if (settings.voice.name != "Default") {
      _speechOptions.voice = settings.voice.identifier;
    }

    Speech.speak(thingToSay, _speechOptions);
    setIsPlaying(true);
  }

  const onClickPlaylist_Item = (item: bibleInterface) => {
    dispatch(set_SelectedBible({
      book_name: item.book_name,
      book: item.book,
      chapter: item.chapter,
      verse: item.verse,
    }));

    const Bible: any = item.book > 39 ? bible_KJV.new : bible_KJV.old;

    const _selected = getBibleBookVerses(
      Bible,
      item.book_name,
      item.chapter,
    );

    dispatch(bibleDetails(_selected.bible));
    router.push("/(tabs)")
  }

  const onDeletePlaylist = () => {
    if (!playlists) return;

    dispatch(deletePlaylist(playlists));
    
    const msg = `${ playlists.title } deleted from playlist`;
    let toast = Toast.show(msg, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      // hideOnPress: true,
      // delay: 0,
    });

    router.back();
  }

  const onDeletePlaylist_Item = (item: bibleInterface) => {
    if (!playlists) return;

    dispatch(removeFromPlaylist({
      title: playlists.title,
      bibleVerse: item
    }));

    const msg = `${ item.book_name } ${ item.chapter }:${ item.verse } removed from playlist.`;
    let toast = Toast.show(msg, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      // hideOnPress: true,
      // delay: 0,
    });
  }

  const onSharePlaylist_Item = async (item: bibleInterface) => {
    try {
      const sharedText = `${ item.text } \n\n---${ item.book_name } ${ item.chapter }:${ item.verse } \nBible Alert`;
      const selectedBibleBook = `${ item.book_name } ${ item.chapter }:${ item.verse }`;
      const shareResult = await Share.share({
        title: selectedBibleBook,
        message: sharedText
      });

      if (shareResult.action === Share.sharedAction) {
        // if (shareResult.activityType) {
        //     console.log("shared with activity type of: ", shareResult.activityType);
        // } else {
        //     console.log("shared");
        // }

        const msg = `shared!`;
        let toast = Toast.show(msg, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });
      }
    } catch (error) {
      console.log(error);

      const msg = `Request failed to share.!`;
      let toast = Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
  }

  const onCopyPlaylist_Item = async (item: bibleInterface) => {
    const sharedText = `${ item.text } \n\n---${ item.book_name } ${ item.chapter }:${ item.verse } \nBible Alert`;
    await Clipboard.setStringAsync(sharedText);

    const msg = `copied to clipboard!`;
    let toast = Toast.show(msg, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });
  }


  // --------------------------------------------------


  const onClickPlay = () => {
    if (!playlists) return;

    const s_BibleVerse = playlists.lists[playingIndex];
    const thingToSay = bibleVerseToRead(s_BibleVerse);

    let _speechOptions: Speech.SpeechOptions = {
      rate: 0.8,
      pitch: 0.6,
      // voice: 'com.apple.ttsbundle.Moira-compact'
      onDone: () => onSpeakingEnd(),
      onStart: () => onSpeakingStart(),
      onStopped: () => onClickPause(),
    };

    if (settings.voice.name != "Default") {
      _speechOptions.voice = settings.voice.identifier;
    }
    
    Speech.speak(thingToSay, _speechOptions);
  }

  const onClickPause = () => {
    Speech.stop();
    setIsPlaying(false);
  }

  const onClickPrevious = () => {
    if (!playlists) return;

    if (isPlaying) {
      Speech.stop();
    }

    setTimeout(() => {
      if (playingIndex > 0 ) {
        const currentSongIndex = playingIndex - 1;
        setPlayingIndex(currentSongIndex);
      }
    }, 400);
  }

  const onClickNext = () => {
    if (!playlists) return;

    if (isPlaying) {
      Speech.stop();
    }

    setTimeout(() => {
      const currentSongIndex = playingIndex + 1;
      // const songsLength = playlists.length;
      if (currentSongIndex < playlists.lists.length ) {
        setPlayingIndex(currentSongIndex);
      } else {
        setPlayingIndex(0);
      }
    }, 400);
  }

  const onSpeakingStart = () => {
    // console.log('on start speaking');
    setIsPlaying(true);
    // setPlayingEnded(false);
  }

  const onSpeakingEnd = () => {
    if (!playlists) return;
    // console.log('on end speaking');
    setIsPlaying(false);
    
    if (playingIndex == playlists?.lists.length - 1) {
      // setPlayingEnded(true);
      setPlayingIndex(0);
    } else {
      // onClickNext();
    }
  }

  const onShare = () => {
    if (!playlists) return;

    let textt = playlists.title + "\n\n";
    playlists.lists.every((verse) => {
        textt = textt + ` ${verse.book_name} ${ verse.chapter }:${ verse.verse }\n`;
    })
    textt = textt + "\n\n--Bible Alert";

    shareBibleVerse(textt, '').then((res: boolean) => {
      if (res) {
        dismiss();
      }
    })
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

  const RightSwipeActions = ({ item }: {item: bibleInterface}) => {
    return (
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'stretch',
                // paddingHorizontal: 5
            }}
        >
            <TouchableOpacity style={{ ...styles.iconBTN, backgroundColor: Colors.primary }} onPress={() => onSharePlaylist_Item(item)}>
                <Ionicons style={styles.listIcon} name="share-social-outline" size={24} />
            </TouchableOpacity>

            <TouchableOpacity style={{ ...styles.iconBTN, backgroundColor: '#ff8303' }} onPress={() => onCopyPlaylist_Item(item)}>
                <Ionicons style={styles.listIcon} name="copy-outline" size={24} />
            </TouchableOpacity>

            <TouchableOpacity style={{ ... styles.iconBTN, backgroundColor: 'red' }} onPress={() => onDeletePlaylist_Item(item)}>
                <Ionicons style={styles.listIcon} name="trash-outline" size={24} />
            </TouchableOpacity>
        </View>
    );
  };  

  const playlistInfoView = (playlists:  _Playlists_) => (
    <View>

      <View style={[themeStyles.headerBackground, {marginBottom: 5}]}>
        <Text style={[themeStyles.text, styles.playlistInfoViewTitle]}>
          Title:
        </Text>
        <Text style={[themeStyles.text, styles.playlistInfoViewDetails]}>
          {playlists.title}
        </Text>
      </View>

      <View style={[themeStyles.headerBackground, {marginBottom: 5}]}>
        <Text style={[themeStyles.text, styles.playlistInfoViewTitle]}>
          Number of Verses:
        </Text>
        <Text style={[themeStyles.text, styles.playlistInfoViewDetails]}>
          {playlists.lists.length}
        </Text>
      </View>


      <View style={[themeStyles.headerBackground, {marginBottom: 5}]}>
        <Text style={[themeStyles.text, styles.playlistInfoViewTitle]}>
          Description:
        </Text>
        
        <ScrollView>
          <Text style={[themeStyles.text, styles.playlistInfoViewDetails, {paddingBottom: 16}]}>
            {playlists.description}
          </Text>
        </ScrollView>
      </View>
    </View>
  );


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

      {
        playlists ? (
          <View style={{ flex: 1 }}>
            <BottomSheetModal ref={playlistInfoRef} 
              snapPoints={snapPoints} 
              overDragResistanceFactor={0}
              backgroundStyle={{
                backgroundColor: themeStyles.BSbackground.backgroundColor,
                borderRadius: 0
              }}
              handleIndicatorStyle={{ display: 'none' }}
              backdropComponent={renderBackdrop}
            >
              { playlistInfoView(playlists) }
            </BottomSheetModal>

            <View style={[themeStyles.headerBackground, styles.headerContainer]}>
              <BackButtonArrow />
              <Text style={[themeStyles.textColor, styles.headerTitle]}>
                {playlists.title}
              </Text>
              <TouchableOpacity onPress={()=> playlistInfoRef.current?.present()}>
                <Ionicons name="information-circle-outline" size={30} style={themeStyles.iconColor} />
              </TouchableOpacity>
            </View>

            <View style={[styles.playlistOptions, themeStyles.border]}>
              {
                isPlaying ?
                  <TouchableOpacity style={{alignItems: 'center'}} onPress={() => onClickPause()}>
                    <Ionicons name="pause" size={24} style={themeStyles.iconColor} />
                    <Text style={[themeStyles.textColor, styles.playlistOptionText]}>Pause</Text>
                  </TouchableOpacity>

                :
                  <TouchableOpacity style={{alignItems: 'center'}} onPress={() => onClickPlay()}>
                    <Ionicons name="play" size={24} style={themeStyles.iconColor} />
                    <Text style={[themeStyles.textColor, styles.playlistOptionText]}>Play</Text>
                  </TouchableOpacity>
              }

              <TouchableOpacity style={{alignItems: 'center'}} onPress={()=> router.push('/playlist/SchedulePlaylist')}>
                <Ionicons name="timer-outline" size={24} style={themeStyles.iconColor} />
                <Text style={[themeStyles.textColor, styles.playlistOptionText]}>Schedule</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{alignItems: 'center'}} onPress={()=> onShare()}>
                <Ionicons style={themeStyles.iconColor} name="share-social" size={24} />
                <Text style={[themeStyles.textColor, styles.playlistOptionText]}>Share</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={{alignItems: 'center'}} onPress={() => router.push('/playlist/EditPlaylist')}>
                <Ionicons name="settings-outline" size={24} style={themeStyles.iconColor} />
                <Text style={[themeStyles.textColor, styles.playlistOptionText]}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{alignItems: 'center'}} onPress={() => onDeletePlaylist()}>
                <Ionicons name="close" size={24} style={themeStyles.iconColor} />
                <Text style={[themeStyles.textColor, styles.playlistOptionText]}>Delete</Text>
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 5}}>
              <FlatList
                data={playlists.lists}
                // ref={flatListRef}
                // initialScrollIndex={c_Index}
                renderItem={({item}) => (
                  <TouchableOpacity style={{ ...themeStyles.contentBg, marginBottom: 5 }} onPress={() => onClickPlaylist_Item(item) }>
                      <Swipeable
                        renderRightActions={() => <RightSwipeActions item={item} />}
                      >
                        <View style={{padding: 16}} >
                          <Text style={[styles.playlist_ItemTitle, themeStyles.playlist_ItemTitle]}>
                            { item.book_name + " " + item.chapter + ":" + item.verse }
                          </Text>
                          <Text style={[styles.playlist_ItemVerse, themeStyles.playlist_ItemVerse]}>
                            { item.text }
                          </Text>
                        </View>
                      </Swipeable>
                  </TouchableOpacity>
                )}
                keyExtractor={item => `${item.book}${item.chapter}${item.verse}`}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Image source={require('@/assets/images/empty.png')} style={{ width: 300, height: 300 }} />
                    <Text style={styles.emptySearchText}>You're yet to add verse(s) to this playlist!</Text>
                  </View>
                }
              />
            </View>

            <View style={{marginTop: 'auto'}}>
              <View style={{padding: 16, marginTop: 20, backgroundColor: Colors.primary}} >
                <Text style={[
                  styles.playlist_ItemTitle, 
                  // themeStyles.playlist_ItemTitle,
                  {color: "#fff", fontSize: settings.fontSize + 5}
                ]}>
                  { highlightedVerse.book_name + " " + highlightedVerse.chapter + ":" + highlightedVerse.verse }
                </Text>
                <Text style={[
                  styles.playlist_ItemVerse, 
                  // themeStyles.playlist_ItemVerse,
                  {color: "#fff", fontSize: settings.fontSize}
                ]}>
                  { highlightedVerse.text }
                </Text>
              </View>
            </View>

            <View style={[
              styles.playSection, 
              themeStyles.playSection, 
              // {display: playingEnded ? 'none' : 'flex'}
            ]}>
              {/* <Text>1.0x</Text> */}
              <View style={styles.playSectionIconContainer}>
                <TouchableOpacity onPress={() => onClickPrevious()} disabled={playingIndex > 0 ? false : true}>
                  <Ionicons name="play-skip-back" size={24} 
                    style={[
                      themeStyles.iconColor, 
                      {color: playingIndex > 0 ? themeStyles.iconColor.color : 'gray'}
                    ]} 
                  />
                </TouchableOpacity>

                  {
                    isPlaying ?
                      <TouchableOpacity style={styles.playPauseBTN} onPress={() => onClickPause()}>
                        {/* <Ionicons name="play" size={24} color="#fff" /> */}
                        <Ionicons name="pause" size={24} color="#fff" />
                      </TouchableOpacity>
                    :
                    <TouchableOpacity style={styles.playPauseBTN} onPress={() => onClickPlay()}>
                      <Ionicons name="play" size={24} color="#fff" />
                      {/* <Ionicons name="pause" size={24} color="#fff" /> */}
                    </TouchableOpacity>
                  }

                  <TouchableOpacity onPress={() => onClickNext()} 
                    disabled={playingIndex < playlists.lists.length - 1 ? false : true}
                  >
                    <Ionicons name="play-skip-forward" size={24}
                      style={[
                        themeStyles.iconColor, 
                        {color: playingIndex < playlists.lists.length - 1 ? themeStyles.iconColor.color : 'gray'}
                      ]}
                    />
                  </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : (
          <Loading />
        )
      }

    </SafeAreaView>
  )
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
    marginTop: 10,
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
