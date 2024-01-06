import { View, Text, StyleSheet,
    TouchableOpacity, Share
} from 'react-native'
import * as Clipboard from 'expo-clipboard';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet'
import Toast from 'react-native-root-toast';
import * as Speech from 'expo-speech';

import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { AppDispatch, RootState } from '@/state/store';
import { useDispatch, useSelector } from 'react-redux';
import { saveBookmark } from '@/state/slices/bookmarkSlice';
import { bibleInterface } from '@/constants/modelTypes';
import { useNavigation } from 'expo-router';
import { setTemptBibleVerseData } from '@/state/slices/temptDataSlice';
import { bibleVerseToRead, copyBibleVerseToClipboard, shareBibleVerse } from '@/constants/bibleResource';


export type Ref = BottomSheetModal;
const BottomSheet = forwardRef<Ref>((props, ref) => {
    const navigation: any = useNavigation();
    const [sharedText, setSharedText] = useState('');
    const [selectedBibleBook, setSelectedBibleBook] = useState('');
    const settings = useSelector((state: RootState) => state.settings);
    const s_BibleVerse = useSelector((state: RootState) => state.biblVerse);
    const playlists = useSelector((state: RootState) => state.playlists);
    const dispatch = useDispatch<AppDispatch>();
    
    // const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
    const snapPoints = useMemo(() => ['50%'], []);
    const renderBackdrop = useCallback((props: any) => 
        <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} { ...props } />
    ,[]);
    const { dismiss } = useBottomSheetModal();


    useEffect(() => {
        if (s_BibleVerse.length) {
            const bibleVerse = s_BibleVerse[0];
            setSharedText(`${ bibleVerse.text } \n\n---${ bibleVerse.book_name } ${ bibleVerse.chapter }:${ bibleVerse.verse } \nBible Alert`);
            setSelectedBibleBook(`${ bibleVerse.book_name } ${ bibleVerse.chapter }:${ bibleVerse.verse }`);
        }
    }, [s_BibleVerse]);

    const onShare = () => {

        shareBibleVerse(sharedText, selectedBibleBook).then((res: boolean) => {
            if (res) {
                dismiss();
            }
        })

        // const modifiedText = sharedText.replace(/\u2039|\u203a/g, '');

        // try {
        //     const shareResult = await Share.share({
        //         title: selectedBibleBook,
        //         message: modifiedText
        //     });

        //     if (shareResult.action === Share.sharedAction) {
        //         // if (shareResult.activityType) {
        //         //     console.log("shared with activity type of: ", shareResult.activityType);
        //         // } else {
        //         //     console.log("shared");
        //         // }

        //         const msg = `shared!`;
        //         let toast = Toast.show(msg, {
        //             duration: Toast.durations.LONG,
        //             position: Toast.positions.BOTTOM,
        //             shadow: true,
        //             animation: true,
        //             hideOnPress: true,
        //             delay: 0,
        //         });

        //         dismiss();
        //     }
        // } catch (error) {
        //     console.log(error);

        //     const msg = `Request failed to share.!`;
        //     let toast = Toast.show(msg, {
        //         duration: Toast.durations.LONG,
        //         position: Toast.positions.BOTTOM,
        //         shadow: true,
        //         animation: true,
        //         hideOnPress: true,
        //         delay: 0,
        //     });
        // }
    }

    const copyToClipboard = () => {
        copyBibleVerseToClipboard(sharedText);
        dismiss();

        // const modifiedText = sharedText.replace(/\u2039|\u203a/g, '');
        // await Clipboard.setStringAsync(modifiedText);

        // const msg = `copied to clipboard!`;
        // let toast = Toast.show(msg, {
        //     duration: Toast.durations.LONG,
        //     position: Toast.positions.BOTTOM,
        //     shadow: true,
        //     animation: true,
        //     hideOnPress: true,
        //     delay: 0,
        // });
    };

    const addToBookmark = () => {
        const _bible = s_BibleVerse[0];
        dispatch(saveBookmark(_bible));

        // getLocalStorage("bookmark").then(
        //     (res: any) => {
        //         // console.log(res);
        //         const state: bibleInterface[] = res ? res : [];
        //         const isUnique = state.every(item => item.book !== _bible.book || item.chapter !== _bible.chapter || item.verse !== _bible.verse);
        //         if (isUnique) {
        //             state.unshift(_bible);
        //             setLocalStorage("bookmark", state);
        //         }
        //     }
        // );

        const msg = `${ _bible.book_name } ${ _bible.chapter }:${ _bible.verse } bookmarked`;
        let toast = Toast.show(msg, {
            duration: Toast.durations.LONG,
            // position: Toast.positions.BOTTOM,
            // shadow: true,
            // animation: true,
            // hideOnPress: true,
            // delay: 0,
        });

        dismiss();
    };

    const addToPlaylist = () => {
        const _bible: bibleInterface = s_BibleVerse[0];
        
        dispatch(setTemptBibleVerseData(_bible));
        dismiss();

        if (playlists.length) {
            navigation.navigate('playlist/AddToPlaylist');
        } else {
            navigation.navigate('playlist/CreateNewPlaylist');
        }

        // navigation.navigate('PlaylistEdit');
    };

    const _read = () => {
        const thingToSay = bibleVerseToRead(s_BibleVerse[0]);

        let _speechOptions: Speech.SpeechOptions = {
            rate: 0.8,
            pitch: 0.6,
            // voice: 'com.apple.ttsbundle.Moira-compact'
        };
        
        if (settings.voice.name != "Default") {
            _speechOptions.voice = settings.voice.identifier;
        }
      
        Speech.speak(thingToSay, _speechOptions);
        dismiss();
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
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        },
        contentBg: {
            // backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff"
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground
        },
        BSbackground: {
            // backgroundColor: settings.colorTheme == 'dark' ? "rgb(60, 60, 60)" : 'rgb(241, 241, 241)'
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.BottomSheetBackground : Colors.light.BottomSheetBackground
        },
    });


    return (
        <BottomSheetModal ref={ref} snapPoints={snapPoints} 
            overDragResistanceFactor={0}
            backgroundStyle={{
                backgroundColor: themeStyles.BSbackground.backgroundColor,
            }}
            handleIndicatorStyle={{ display: 'none' }}
            backdropComponent={renderBackdrop}
        >
            <View style={styles.modalContainer}>
                <Text style={[styles.titleText, themeStyles.textColor]}>{selectedBibleBook}</Text>

                <View style={styles.listParentContainer}>
                    <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} onPress={() => _read()}>
                        <Ionicons style={[styles.listIcon, themeStyles.iconColor]} name="play" size={24} />
                        <Text style={[styles.listText, themeStyles.textColor]}>Read</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} onPress={() => addToPlaylist()}>
                        <MaterialIcons style={[styles.listIcon, themeStyles.iconColor]} name="playlist-add" size={24} color="black" />
                        <Text style={[styles.listText, themeStyles.textColor]}>Add to Playlist</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} onPress={() => addToBookmark()}>
                        <Ionicons style={[styles.listIcon, themeStyles.iconColor]} name="bookmarks-outline" size={24} color="black" />
                        <Text style={[styles.listText, themeStyles.textColor]}>Bookmark</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} onPress={() => copyToClipboard()}>
                        <Ionicons style={[styles.listIcon, themeStyles.iconColor]} name="copy-outline" size={24} color="black" />
                        <Text style={[styles.listText, themeStyles.textColor]}>Copy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} onPress={() => onShare()}>
                        <Ionicons style={[styles.listIcon, themeStyles.iconColor]} name="share-social-outline" size={24} color="black" />
                        <Text style={[styles.listText, themeStyles.textColor]}>Share</Text>
                    </TouchableOpacity>
                </View>

                {/* <Button title='dismiss' onPress={() => dismiss()} /> */}
            </View>
        </BottomSheetModal>
    )
});

export default BottomSheet;


const styles = StyleSheet.create({
    modalContainer: {
      paddingHorizontal: 16,
    //   backgroundColor: 'gray'
    },
    titleText: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    listParentContainer: {
        marginVertical: 16
    },
    listContainer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'center',
      paddingVertical: 15,
      paddingHorizontal: 10,
      marginBottom: 5,
      backgroundColor: 'rgba(255, 255, 255, 0.6)',
      borderRadius: 5
    },
    listIcon: {

    },
    listText: {
        fontSize: 18
    }
});
  