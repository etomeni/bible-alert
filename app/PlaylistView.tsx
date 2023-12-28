import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView,
    TouchableOpacity, Pressable
} from 'react-native';
import { useNavigation } from 'expo-router';
import * as Speech from 'expo-speech';

import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { playlistInterface } from '@/constants/modelTypes';
import { getBibleBookVerses, getEnglishVoicesAsync } from '@/constants/resources';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

// import bibleKJV from "@/assets/bible/kjv_all";
import bibleKJV from "@/assets/bible/kjvTS";
import { StatusBar } from 'expo-status-bar';


export default function PlaylistView() {
    const navigation: any = useNavigation();
    const [selectedBibleChapter, setSelectedBibleChapter] = useState<playlistInterface[]>([]);
    const settings = useSelector((state: RootState) => state.settings);
    const temptBibleVerse = useSelector((state: RootState) => state.temptData.temptBibleVerse);
    const [displayBibleVerse, setDisplayBibleVerse] = useState<playlistInterface>({
        book: 0,
        book_name: '',
        chapter: 0,
        text: '',
        verse: 0
    });
    const [playingIndex, setPlayingIndex] = useState<number>(0);
    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    useEffect(() => {
        // getEnglishVoicesAsync().then(res => console.log(res));
        // setDisplayBibleVerse(temptBibleVerse);

        const Bible: any = temptBibleVerse.book > 39 ? bibleKJV.new : bibleKJV.old;
        const _selected = getBibleBookVerses(
            Bible,
            temptBibleVerse.book_name,
            temptBibleVerse.chapter,
        );
         
        setSelectedBibleChapter(_selected.bible);
        setDisplayBibleVerse(_selected.bible[playingIndex]);
    }, []);

    useEffect(() => {
        onClickPlay();
    }, [displayBibleVerse]);
    
    const onClickPlay = () => {
        const index = selectedBibleChapter.findIndex(obj => obj.book == displayBibleVerse.book || obj.chapter == displayBibleVerse.chapter || obj.verse == displayBibleVerse.verse);
        if (index !== -1) {
            console.log(`Index of object with index: ${index}`);

            if (playingIndex != index) {
                setDisplayBibleVerse(selectedBibleChapter[playingIndex]);
            }
        } else {
            console.log(`Object not found in the array.`);
        }

        const thingToSay = `${displayBibleVerse.text}`;
        Speech.speak(
            thingToSay,
            {
                rate: 0.8,
                pitch: 0.6,
                // voice: 'com.apple.ttsbundle.Moira-compact'

                onDone: () => onSpeakingEnd(),
                onStart: () => onSpeakingStart(),
                onStopped: () => onClickPause(),
            }
        );
    }

    const onClickPause = () => {
        Speech.stop();
        setIsPlaying(false);
    }

    const onClickPrevious = () => {
        if (playingIndex > 0 ) {
            const currentSongIndex = playingIndex - 1;
            setPlayingIndex(currentSongIndex);
            setDisplayBibleVerse(selectedBibleChapter[currentSongIndex]);
        }
    }

    const onClickNext = () => {
        const currentSongIndex = playingIndex + 1;
        // const songsLength = playlists.length;
        if (currentSongIndex < selectedBibleChapter.length ) {
            setPlayingIndex(currentSongIndex);
            setDisplayBibleVerse(selectedBibleChapter[currentSongIndex]);
        }  else {
            setPlayingIndex(0);
        }
    }


    const onSpeakingStart = () => {
        console.log('on start speaking');
        // setDisplayBibleVerse(playlists[playingIndex + 1]);
        setIsPlaying(true);
    }

    const onSpeakingEnd = () => {
        console.log('on end speaking');
        
        onClickNext();
        setIsPlaying(false);
        // setDisplayBibleVerse(playlists[playingIndex + 1]);
    }


    const themeStyles = StyleSheet.create({
        text: {
            // marginBottom: 16,
            textAlign: 'justify',
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
            fontSize: settings.fontSize
        },
        titleText: {
            // marginBottom: 16,
            textAlign: 'justify',
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
            fontSize: settings.fontSize + 5
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
            // backgroundColor: '#f6f3ea43', // #f6f3ea43
            backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff"
        },
        BSbackground: {
            backgroundColor: settings.colorTheme == 'dark' ? "rgb(60, 60, 60)" : 'rgb(241, 241, 241)'
        },
        noteInput: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
            backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff",
            borderColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "gray",
            fontSize: settings.fontSize,
            // sectionColor: 
        },
        titleInput: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
            backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff",
            borderColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "gray",
            fontSize: settings.fontSize,
        },
        playSection: {
            borderTopColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "gray"
        }
    });


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

            <View style={[styles.header, themeStyles.contentBg]}>
                <Text style={[styles.headerText, themeStyles.textColor]}>
                    { `${temptBibleVerse.book_name} ${temptBibleVerse.chapter}` }
                </Text>

                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons style={[styles.icon, themeStyles.iconColor]} name="close" size={30} />
                </TouchableOpacity>
            </View>

            <View style={styles.playlistTitle}>
                <Text style={[styles.playlistTitleText, themeStyles.titleText]}>
                    { temptBibleVerse.title }
                </Text>
            </View>

            <ScrollView style={[styles.playlistNote, themeStyles.contentBg]}>
                <Text style={[styles.playlistNoteText, themeStyles.text]}>
                    { temptBibleVerse.note }
                </Text>
            </ScrollView>

            <View style={[styles.playlistBibleVerse, themeStyles.contentBg]}>
                <Text style={[styles.playlistBibleVerseText, themeStyles.text]}>
                    <Text style={{ fontWeight: 'bold', fontSize: settings.fontSize + 5, color: Colors.primary }}>
                        {`${displayBibleVerse.verse}. `}
                    </Text>
                    <Text>
                        {displayBibleVerse.text}
                    </Text>
                </Text>
            </View>

            <View style={[styles.playSection, themeStyles.playSection]}>
                {/* <Text>1.0x</Text> */}
                <View style={styles.playSectionIconContainer}>
                    <TouchableOpacity onPress={() => onClickPrevious()}>
                        <Ionicons name="play-skip-back" size={24} style={themeStyles.iconColor} />
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


                    <TouchableOpacity onPress={() => onClickNext()}>
                        <Ionicons name="play-skip-forward" size={24} style={themeStyles.iconColor} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        // backgroundColor: '#fff',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 10
    },
    iconWrapper: {
        backgroundColor: Colors.primary,
        borderRadius: 50,
        padding: 10,
    },
    icon: {
        // color: '#fff',
        fontSize: 24
    },

    playlistTitle: {
        padding: 16,
    },
    playlistTitleText: {
        fontSize: 24,
        // fontWeight: 'bold'
    },

    playlistBibleVerse: {
        // backgroundColor: '#fff',
        padding: 16,
        marginVertical: 16,
        marginTop: 'auto'
    },
    playlistBibleVerseText: {
        // fontSize: 20,
        textAlign: 'justify'
    },

    playlistNote: {
        // backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 5,
        maxHeight: 350,
    },
    playlistNoteText: {
        // fontSize: 20,
        fontStyle: 'italic',
        textAlign: 'justify'
    },
    playSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderTopWidth: 2,
        // borderTopColor: '#fff',
        padding: 16,
        // marginTop: 'auto',
        // backgroundColor: 'white'
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
  