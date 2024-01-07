import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useSelector, useDispatch } from 'react-redux';
import bibleKJV from "@/assets/bible/kjvTS";
import { AppDispatch, RootState } from '@/state/store';
import { setSelectedBibleBook } from "@/state/slices/bibleSelectionSlice";
import { getBibleBooks, restructureBibleDataset } from "@/constants/bibleResource";
import Colors from "@/constants/Colors";

import BibleBooksChaptersVerses from "@/assets/bible/BibleBooksChaptersVerses";
import { _bibleBookSelection_ } from "@/constants/modelTypes";
import { setTemptBibleBookSelectionData } from "@/state/slices/temptDataSlice";


const BibleBooks = () => {
    const dispatch = useDispatch<AppDispatch>();
    // const newTestamentBooks = getBibleBooks(bibleKJV.new);
    // const oldTestamentBooks = getBibleBooks(bibleKJV.old);

    const newTestamentBooks = restructureBibleDataset(bibleKJV.new);
    const oldTestamentBooks = restructureBibleDataset(bibleKJV.old);

    const selectedBibleBookRedux = useSelector((state: RootState) => state.selectedBibleBook);
    const settings = useSelector((state: RootState) => state.settings);

    const onSelectBook = (book: _bibleBookSelection_) => {
        const __book: {book_name: string, book_number: number}  = book;
        dispatch(setSelectedBibleBook(__book));

        dispatch(setTemptBibleBookSelectionData(book));
        router.push("/verseSelection/BookChapters");
    }

    const themeStyles = StyleSheet.create({
        textColor: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        },
        contentBg: {
            // backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff"
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground
        }
    });
    
    return(
        <SafeAreaView style={{flex: 1}}>
            <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.testamentContainer}>
                        <Text style={[styles.testamentText, themeStyles.textColor]}>Old Testament</Text>
                    </View>

                    <View style={styles.booksNameContainer}>
                        {
                            oldTestamentBooks.map(book => (
                                <TouchableOpacity key={book.book_number} 
                                    style={[
                                        styles.booksName, 
                                        themeStyles.contentBg,
                                        book.book_name == selectedBibleBookRedux.book_name && styles.active 
                                    ]}
                                    onPress={() => onSelectBook(book)}
                                >
                                    <Text style={[
                                        themeStyles.textColor,
                                        book.book_name == selectedBibleBookRedux.book_name && styles.activeText,
                                    ]}>
                                        { book.book_name }
                                    </Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>

                    <View style={styles.testamentContainer}>
                        <Text style={[styles.testamentText, themeStyles.textColor]}>New Testament</Text>
                    </View>

                    <View style={styles.booksNameContainer}>
                        {
                            newTestamentBooks.map((book: any, index: number) => (
                                <TouchableOpacity key={book.book_number} 
                                    style={[
                                        styles.booksName,
                                        themeStyles.contentBg,
                                        book.book_name == selectedBibleBookRedux.book_name && styles.active 
                                    ]}
                                    onPress={() => { onSelectBook(book) }}
                                >
                                    <Text style={[
                                        themeStyles.textColor,
                                        book.book_name == selectedBibleBookRedux.book_name && styles.activeText
                                    ]}>
                                        { book.book_name }
                                    </Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>

                </View>
            </ScrollView>
        </SafeAreaView>
    )
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
    testamentText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        // color: 'gray'
    }
});
