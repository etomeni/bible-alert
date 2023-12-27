import { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, ScrollView,
    TouchableOpacity, Pressable, TextInput 
} from 'react-native';
import { useNavigation, Link } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import Toast from 'react-native-root-toast';
import { playlistInterface } from '@/constants/modelTypes';
import { getLocalStorage, setLocalStorage } from '@/constants/resources';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { setTemptPlaylistData } from '@/state/slices/temptPlaylistSlice';
import { StatusBar } from 'expo-status-bar';
import { addToPlaylists } from '@/state/slices/playlistSlice';


export default function PlaylistEdit() {
    const navigation: any = useNavigation();

    const [playlistTitle, setPlaylistTitle] = useState('');
    const [playlistNote, setPlaylistNote] = useState('');
    const [playlistTitleError, setPlaylistTitleError] = useState(false);
    const settings = useSelector((state: RootState) => state.settings);

    const temptPlaylist = useSelector((state: RootState) => state.temptPlaylist);
    const playlists = useSelector((state: RootState) => state.playlists);
    const dispatch = useDispatch<AppDispatch>();


    useEffect(() => {
        for (const playlist of playlists) {
            if (
                playlist.book == temptPlaylist.book &&  
                playlist.chapter == temptPlaylist.chapter && 
                playlist.verse == temptPlaylist.verse
            ) {
                setPlaylistTitle(playlist.title || '');
                setPlaylistNote(playlist.note || '');
                
                break; // Stop searching
            }
        }
    }, []);

    useEffect(() => {
        if (temptPlaylist.action === "Edit") {
            setPlaylistTitle(temptPlaylist.title || '');
            setPlaylistNote(temptPlaylist.note || '');
        }
    }, [temptPlaylist]);

    useEffect(() => {
        if (playlistTitle && playlistTitleError) {
            setPlaylistTitleError(false)
        }
    }, [playlistTitle]);
    
    const submitPlaylist = () => {
        const newPlaylist: playlistInterface = {
            ...temptPlaylist,
            title: playlistTitle,
            note: playlistNote,
        };

        if (playlistTitle) {
            // getLocalStorage("playlist").then(
            //     (res: any) => {
            //         const state: playlistInterface[] = res ? res : [];
            //         const isUnique = state.every(item => item.book !== newPlaylist.book || item.chapter !== newPlaylist.chapter || item.verse !== newPlaylist.verse);
            //         if (isUnique) {
            //             state.unshift(newPlaylist);
            //             setLocalStorage("playlist", state);
            //         } else {
            //             const newState = state.filter(item => item.book !== newPlaylist.book || item.chapter !== newPlaylist.chapter || item.verse !== newPlaylist.verse);
            //             newState.unshift(newPlaylist);
            //             setLocalStorage("playlist", newState);
            //         }
            //     }
            // );


            dispatch(addToPlaylists(newPlaylist));

            const msg = `${newPlaylist.title} -- ${ newPlaylist.book_name } ${ newPlaylist.chapter }:${ newPlaylist.verse } added to playlist!`;
            let toast = Toast.show(msg, {
                duration: Toast.durations.LONG,
                // position: Toast.positions.BOTTOM,
                // shadow: true,
                // animation: true,
                // hideOnPress: true,
                // delay: 0,
            });

            dispatch(setTemptPlaylistData(newPlaylist));
            navigation.goBack();
        } else {
            const msg = `Title field is required.`;
            let toast = Toast.show(msg, {
                duration: Toast.durations.LONG,
                // position: Toast.positions.BOTTOM,
                // shadow: true,
                // animation: true,
                // hideOnPress: true,
                // delay: 0,
            });
            setPlaylistTitleError(true);
        }
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
        }
    });


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

            <View style={[styles.header, themeStyles.contentBg]}>
                <Text style={[styles.headerText, themeStyles.textColor]}>Playlist</Text>

                <Pressable onPress={() => { navigation.goBack() }}>
                    <Ionicons name="close" size={24} style={themeStyles.iconColor} />
                </Pressable>
            </View>

            <View style={styles.playlistBook}>
                <Text style={[styles.headerText, themeStyles.textColor]}>
                    { `${temptPlaylist.book_name} ${temptPlaylist.chapter}:${temptPlaylist.verse}` }
                </Text>
            </View>

            <View style={styles.inputContainer}>
                <Text style={[styles.inputTitleText, themeStyles.textColor]}>
                    Title
                    <Text style={{ color: 'red', fontSize: 20 }}>*</Text>
                </Text>

                <View style={styles.titleInputContainer}>
                    <TextInput
                        style={{ ...styles.titleInput, ...themeStyles.titleInput, borderColor: playlistTitleError ? '#de2341' : 'gray' }}
                        onChangeText={setPlaylistTitle}
                        value={playlistTitle}
                        selectionColor={themeStyles.noteInput.color}
                        placeholderTextColor={'gray'}
                        placeholder="Playlist Title"
                        returnKeyType="next"
                        // blurOnSubmit={true}
                        inputMode="text"
                        enterKeyHint="next"
                        autoFocus={true}
                    />
                    <Text style={{...styles.errorText, display: playlistTitleError ? 'flex' : 'none' }}>Please enter a title for the playlist</Text>
                </View>

                <Text style={[styles.inputTitleText, themeStyles.textColor]}>Note</Text>
                <TextInput
                    style={[styles.noteInput, themeStyles.noteInput]}
                    onChangeText={setPlaylistNote}
                    value={playlistNote}
                    selectionColor={themeStyles.noteInput.color}
                    placeholderTextColor={'gray'}
                    multiline={true}
                    editable={true}
                    numberOfLines={5}
                    placeholder="Write Note..."
                    returnKeyType="done"
                    // blurOnSubmit={true}
                    inputMode="text"
                    enterKeyHint="done"
                />

                <TouchableOpacity style={styles.submitBTN} onPress={submitPlaylist}>
                    <Text style={styles.submitBTNText}>Save</Text>
                </TouchableOpacity>
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
    playlistBook: {
        marginVertical: 20,
        paddingHorizontal: 16
    },

    inputContainer: {
        padding: 16
    },

    titleInputContainer: {
        marginBottom: 15,

    },
    titleInput: {
        height: 50,
        borderWidth: 0.4,
        borderRadius: 5,
        // borderColor: 'gray',
        // backgroundColor: '#fff',
        padding: 10,
        fontSize: 16,
    },
    noteInput: {
        borderWidth: 0.4,
        borderRadius: 5,
        // borderColor: 'gray',
        // maxHeight: 150,
        // backgroundColor: '#fff',
        height: 150,
        fontSize: 16,
        padding: 11
    },
    inputTitleText: {
        fontSize: 24, 
        paddingVertical: 5,
    },
    submitBTN: {
        backgroundColor: Colors.primary,
        padding: 16,
        marginTop: 24,
        borderRadius: 5
    },
    submitBTNText: {
        fontSize: 24,
        textAlign: 'center',
        color: 'white'
    },
    errorText: {
        color: "#de2341",
        fontSize: 16
    }

});
  