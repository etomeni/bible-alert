import { useState } from "react";
import { View, Text, StyleSheet, TextInput, SafeAreaView, Pressable } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { useSelector, useDispatch } from 'react-redux';
import bibleKJV from "@/assets/bible/kjvTS";
import { AppDispatch, RootState } from '@/state/store';
import { restructureBibleDataset } from "@/constants/bibleResource";
import Colors from "@/constants/Colors";

import { _bibleBookSelection_ } from "@/constants/modelTypes";
import AllBibleBooks from "@/components/AllBibleBooks";
import NewBibleBooks from "@/components/NewBibleBooks";
import OldBibleBooks from "@/components/OldTBibleBooks";
import { set_SelectedBible } from "@/state/slices/bibleSelectionSlice";


const newTestamentBooks = restructureBibleDataset(bibleKJV.new);
const oldTestamentBooks = restructureBibleDataset(bibleKJV.old);

const BibleBooks = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [activeTab, setActiveTab] = useState<'all' | 'old' | 'new'>('all');
    const selectedBibleBookRedux = useSelector((state: RootState) => state.selectedBibleBook);
    const settings = useSelector((state: RootState) => state.settings);
    const [bookNameInputValue, setBookNameInputValue] = useState('');
    const [searching, setSearching] = useState(false);

    const [allBibleBooks, setAllBibleBooks] = useState(restructureBibleDataset());

    const onSelectBook = (book: _bibleBookSelection_) => {
        dispatch(set_SelectedBible({
            book_name: book.book_name,
            book: book.book_number,
            chapter: selectedBibleBookRedux.chapter,
            verse: selectedBibleBookRedux.verse
        }));
        router.push({ 
            pathname: '/verseSelection/BookChapters', 
            params: {
                book_name: book.book_name, 
                book_number: book.book_number
            } 
        });
    }

    const searchBibleBooksFunc = (text: string) => {
        setBookNameInputValue(text.trim());
        // // console.log(text);

        if (text && text.length) {
            setSearching(true);
            setActiveTab('all');
            // Convert the query to lowercase for case-insensitive search
            const searchKeyWords = text.toLowerCase();
            // OPTIMIZED WAY OF PERFORMING SEARCH LIMITS
            const _search_Results = [];
            for (const obj of restructureBibleDataset()) {
                const searchFields = obj.book_name.toLowerCase();
                if (searchFields.includes(searchKeyWords)) {
                    _search_Results.push(obj);
                }
            }

            setAllBibleBooks(_search_Results);
        } else {
            setSearching(false);
            setAllBibleBooks(restructureBibleDataset());
        }
    }

    const themeStyles = StyleSheet.create({
        textColor: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        },
        contentBg: {
            // backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff"
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground
        },
        bookNameInput: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.headerBackground : Colors.light.contentBackground,
            borderColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground,
        }
    });
    
    return(
        <SafeAreaView style={{flex: 1}}>
            <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />
            
            <View style={{paddingHorizontal: 16, marginTop: 16}}>
                <TextInput
                    style={[styles.bookNameInput, themeStyles.bookNameInput]}
                    onChangeText={(text: string) => searchBibleBooksFunc(text.trim())}
                    value={bookNameInputValue}
                    selectionColor={themeStyles.textColor.color}
                    placeholder="search book name..."
                    keyboardType="web-search"
                    returnKeyType="search"
                    // blurOnSubmit={true}
                    placeholderTextColor={'gray'}
                    inputMode="search"
                    enterKeyHint="search"
                    onKeyPress={({nativeEvent: {key: keyValue}}) => {
                        // const enteredKey = nativeEvent.key;
                        // console.log(keyValue);
                        if (keyValue == 'Enter') {
                            searchBibleBooksFunc(bookNameInputValue);
                        }
                    }}
                    // autoFocus={true}
                />
            </View>
            
            <View style={styles.testamentNavContainer}>
                <Pressable 
                    style={[styles.testamentsTextContainer, activeTab == 'all' ? styles.testamentActive : {}]}
                    onPress={() => setActiveTab('all')}
                >
                    <Text style={[themeStyles.textColor, styles.testamentsText, activeTab == 'all' ? styles.testamentsTextActive : {}]}>All</Text>
                </Pressable>

                <Pressable 
                    style={[styles.testamentsTextContainer, activeTab == 'old' ? styles.testamentActive : {}]}
                    onPress={() => setActiveTab('old')}
                >
                    <Text style={[themeStyles.textColor, styles.testamentsText, activeTab == 'old' ? styles.testamentsTextActive : {}]}>Old Testament</Text>
                </Pressable>

                <Pressable 
                    style={[styles.testamentsTextContainer, activeTab == 'new' ? styles.testamentActive : {}]}
                    onPress={() => setActiveTab('new')}
                >
                    <Text style={[themeStyles.textColor, styles.testamentsText, activeTab == 'new' ? styles.testamentsTextActive : {}]}>New Testament</Text>
                </Pressable>
            </View>

            {
                activeTab == 'all' ? (
                    <Swipeable
                        renderRightActions={() => <><Text> </Text></>}
                        onSwipeableWillOpen={(direction) => {
                            if (direction == 'right') {
                                setActiveTab('old')
                            }
                        }}
                    >
                        <AllBibleBooks
                            allBibleBooks={allBibleBooks} 
                            settings={settings} 
                            searching={searching} 
                            selectedBibleBookRedux={selectedBibleBookRedux} 
                            onSelectBook={onSelectBook}
                        />
                    </Swipeable>
                    
                ) : activeTab == 'old' ? (

                    <Swipeable
                        renderRightActions={() => <><Text> </Text></>}
                        renderLeftActions={() => <><Text> </Text></>}

                        onSwipeableWillOpen={(direction) => {
                            if (direction == 'right') {
                                setActiveTab('new')
                            }
                            if (direction == 'left') {
                                setActiveTab('all')
                            }
                        }}
                    >
                        <OldBibleBooks
                            oldTestamentBooks={oldTestamentBooks} 
                            settings={settings} 
                            selectedBibleBookRedux={selectedBibleBookRedux} 
                            onSelectBook={onSelectBook}
                        />
                    </Swipeable>

                ) : activeTab == 'new' ? (

                    <Swipeable
                        renderLeftActions={() => <><Text> </Text></>}
                        
                        onSwipeableWillOpen={(direction) => {
                            if (direction == 'left') {
                                setActiveTab('old')
                            }
                        }}
                    >
                        <NewBibleBooks
                            newTestamentBooks={newTestamentBooks} 
                            settings={settings} 
                            selectedBibleBookRedux={selectedBibleBookRedux} 
                            onSelectBook={onSelectBook}
                        />
                    </Swipeable>
                    
                ) : (<></>)
            }

        </SafeAreaView>
    );
}

export default BibleBooks;


const styles = StyleSheet.create({
    container: {
        // padding: 16
        padding: 5
    },
    booksNameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
    },
    booksName: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: "32%",
        // backgroundColor: "white",
        margin: "auto",
        borderRadius: 2,
        height: 55,
    },
    active: {
        backgroundColor: Colors.secondary,
    },
    activeText: {
        color: 'white'
    },
    testamentContainer: {
        alignItems: 'center',
        padding: 20
    },
    testamentNavContainer: {
        padding: 10, 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 15
    },
    testamentText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        // color: 'gray'
    },
    testamentsTextContainer: {
        flexGrow: 1,
    },
    testamentsText: {
        fontSize: 18,
        textAlign: "center",
    },
    testamentsTextActive: {
        color: Colors.primary
    },
    testamentActive: {
        borderBottomWidth: 2,
        borderBottomColor: Colors.primary,
    },
    bookNameInput: {
        // height: 40,
        // margin: 16,
        borderWidth: 0.4,
        borderRadius: 5,
        // borderColor: 'gray',
        padding: 10,
        fontSize: 16,
        flexGrow: 1,
    },
});
