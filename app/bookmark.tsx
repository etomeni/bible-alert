import { View, Text, FlatList, TouchableOpacity,
    StyleSheet, SafeAreaView, Share, Image
} from 'react-native';
import * as Clipboard from 'expo-clipboard';

import { useEffect, useState  } from 'react';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { getBibleBookVerses, getLocalStorage, setLocalStorage } from '@/constants/resources';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { bibleInterface } from '@/constants/modelTypes';
import Colors from '@/constants/Colors';
import Toast from 'react-native-root-toast';

import bibleKJV from "@/assets/bible/kjv_all";
import bible_KJV from "@/assets/bible/kjvTS";

import { Ionicons } from '@expo/vector-icons';
import { selectedBibleBook, selectedChapter, selectedVerse } from '@/state/slices/bibleSelectionSlice';
import { bibleDetails } from '@/state/slices/bibleVerseSlice';
import { useNavigation } from "expo-router";
import { StatusBar } from 'expo-status-bar';


export default function bookmark() {
    const navigation: any = useNavigation();

    const dispatch = useDispatch<AppDispatch>();
    const [bookmark, setBookmark] = useState<bibleInterface[]>([]);
    const settings = useSelector((state: RootState) => state.settings);
    

    useEffect(() => {
        getLocalStorage("bookmark").then(
            (res: any) => {
                if (res) {
                    setBookmark(res);
                    // dispatch(saveBookmark(res));
                    // dispatch(deleteAllBookmark(res));
                }
            }
        )
    }, []);

    const onClickBookmark = (item: bibleInterface) => {

        dispatch(selectedBibleBook({
            book_name: item.book_name,
            book_number: item.book
        }));
        dispatch(selectedChapter(item.chapter));
        dispatch(selectedVerse(item.verse));
    
        const Bible: any = item.book > 39 ? bible_KJV.new : bible_KJV.old;
    
        const _selected = getBibleBookVerses(
            Bible,
            item.book_name,
            item.chapter,
        );
    
        dispatch(bibleDetails(_selected.bible));
        navigation.navigate('index');
        // navigation.navigate('(tabs)');
    }

    const onDeleteBookmark = (item: bibleInterface) => {
        const newBookmark = bookmark.filter(bookmarkItem => bookmarkItem.book !== item.book || bookmarkItem.chapter !== item.chapter || bookmarkItem.verse !== item.verse);
        setBookmark(newBookmark);
        setLocalStorage("bookmark", newBookmark);

        const msg = `${ item.book_name } ${ item.chapter }:${ item.verse } removed from bookmarked`;
        let toast = Toast.show(msg, {
            duration: Toast.durations.LONG,
            // position: Toast.positions.BOTTOM,
            // shadow: true,
            // animation: true,
            // hideOnPress: true,
            // delay: 0,
        });
    }

    const onShareBookmark = async (item: bibleInterface) => {
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

    const onCopyBookmark = async (item: bibleInterface) => {
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
                <TouchableOpacity style={{ ...styles.iconBTN, backgroundColor: Colors.primary }} onPress={() => onShareBookmark(item)}>
                    <Ionicons style={styles.listIcon} name="share-social-outline" size={24} />
                </TouchableOpacity>

                <TouchableOpacity style={{ ...styles.iconBTN, backgroundColor: '#ff8303' }} onPress={() => onCopyBookmark(item)}>
                    <Ionicons style={styles.listIcon} name="copy-outline" size={24} />
                </TouchableOpacity>

                <TouchableOpacity style={{ ... styles.iconBTN, backgroundColor: 'red' }} onPress={() => onDeleteBookmark(item)}>
                    <Ionicons style={styles.listIcon} name="trash-outline" size={24} />
                </TouchableOpacity>
            </View>
        );
    };
      


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
        bookmarkTitle: {
            fontSize: settings.fontSize + 5,
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        },
        bookmarkVerse: {
            fontSize: settings.fontSize,
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        }
    });


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

            <View style={styles.bookmarkContainer}>
                <FlatList
                    data={bookmark}
                    // ref={flatListRef}
                    // initialScrollIndex={c_Index}
                    renderItem={({item}) => (
                        <TouchableOpacity style={{ ...themeStyles.contentBg, marginBottom: 5 }} onPress={() => onClickBookmark(item)}>
                            <Swipeable
                                renderRightActions={() => <RightSwipeActions item={item} />}
                                // renderItem={({ item }) => <ListItem {...item} />}

                                // onSwipeableRightOpen={swipeFromRightOpen}
                                // onSwipeableLeftOpen={swipeFromLeftOpen}
                            >
                                <View style={styles.bookmark} >
                                    <Text style={[styles.bookmarkTitle, themeStyles.bookmarkTitle]}>
                                        { item.book_name + " " + item.chapter + ":" + item.verse }
                                    </Text>
                                    <Text style={[styles.bookmarkVerse, themeStyles.bookmarkVerse]}>
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
                            <Text style={styles.emptySearchText}>You're yet to bookmark a verse!</Text>
                        </View>
                    }
                />
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    verseSelectionContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        marginBottom: 20,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 20
    },
    selctionText: {
        flexGrow: 1,
        flex: 1,
        textAlign: 'center',
        padding: 5,
    },
    bookSelction: {
        borderRightColor: "white",
        borderRightWidth: 1,
        borderStyle: 'solid'
    },
    versionSelction: {
        backgroundColor: '#f6f3ea43',
        borderRadius: 20
    },
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    verseTextContainer: {
        marginBottom: 16,
        textAlign: 'justify'
    },
    bookmarkContainer: {
    },
    bookmark: {
        padding: 16,
    },
    bookmarkTitle: {
        // fontSize: 18,
        fontWeight: 'bold'
    },
    bookmarkVerse: {
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
        marginVertical: '50%',
    },
    emptySearchText: {
        color: 'gray',
        fontSize: 24
    }
    
});
  