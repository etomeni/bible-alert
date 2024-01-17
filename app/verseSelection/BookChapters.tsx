import { useEffect, useState } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from "expo-status-bar";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import Colors from "@/constants/Colors";
// import { setSelectedBibleBook, setSelectedChapter, set_SelectedBible } from "@/state/slices/bibleSelectionSlice";
// import { getBibleBookChapters } from "@/constants/bibleResource";
import { _bibleVerseSelection_ } from "@/constants/modelTypes";
import BibleBooksChaptersVerses from "@/assets/bible/BibleBooksChaptersVerses";


const BookChapters = () => {
    const queryParams = useLocalSearchParams();

    // const dispatch = useDispatch<AppDispatch>();
    const settings = useSelector((state: RootState) => state.settings);
    const pSelected_BibleBook = useSelector((state: RootState) => state.selectedBibleBook);
    // const selectedBibleBook = useSelector((state: RootState) => state.temptData.temptBibleBookSelection);

    const [chapters, setChapters] = useState<_bibleVerseSelection_[]>([]);

    const [selected_data, setSelected_data] = useState({
        book_number: 0,
        book_name: ''
    });

    useEffect(() => {
        if (queryParams.book_name || queryParams.book_number ) {
            const book_number = Number(queryParams.book_number);
            const book_name: any = queryParams.book_name;
            const total_chapters = Number(queryParams.total_chapters);
            setChapters(BibleBooksChaptersVerses[book_number - 1].chapters);

            setSelected_data({
                book_number: book_number,
                book_name: book_name      
            })

            // setChapters(getBibleBookChapters( book_number > 39 ? bibleKJV.new : bibleKJV.old, book_name));
        } else {
            setChapters(BibleBooksChaptersVerses[pSelected_BibleBook.book - 1].chapters);

            setSelected_data({
                book_number: pSelected_BibleBook.book,
                book_name: pSelected_BibleBook.book_name      
            });

            // setChapters(getBibleBookChapters( pSelected_BibleBook.book > 39 ? bibleKJV.new : bibleKJV.old, pSelected_BibleBook.book_name));
        }
    }, []);


    const onSelectBook = (chapter: _bibleVerseSelection_) => {
        // dispatch(set_SelectedBible({
        //     book_name: pSelected_BibleBook.book_name,
        //     book: pSelected_BibleBook.book,
        //     chapter: chapter,
        //     verse: pSelected_BibleBook.verse
        // }));
        router.push({ 
            pathname: '/verseSelection/BookVerses', 
            params: {
                book_name: selected_data.book_name, 
                book_number: selected_data.book_number,
                chapter: chapter.chapter_number,
                total_verses: chapter.total_verses
            } 
        });

        // dispatch(setTemptBibleVerseSelectionData(chapter));
        // router.push("/verseSelection/BookVerses");
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
                    <View style={styles.booksNameContainer}>
                        {
                            chapters.map((c_hapter, index) => (
                                <TouchableOpacity key={index} 
                                    style={[
                                        styles.booksName, 
                                        themeStyles.contentBg,
                                        c_hapter.chapter_number == pSelected_BibleBook.chapter && styles.active 
                                    ]}
                                    onPress={() => { onSelectBook(c_hapter) }}
                                >
                                    <Text style={[
                                        themeStyles.textColor,
                                        c_hapter.chapter_number == pSelected_BibleBook.chapter && styles.activeText
                                    ]}>{ c_hapter.chapter_number }</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View>

                    {/* <View style={styles.booksNameContainer}>
                        {
                            selectedBibleBook.chapters.map((c_hapter: _bibleVerseSelection_, index: number) => (
                                <TouchableOpacity key={index} 
                                    style={[
                                        styles.booksName, 
                                        themeStyles.contentBg,
                                        c_hapter.chapter_number == pSelected_BibleBook.chapter && styles.active 
                                    ]}
                                    onPress={() => { onSelectBook(c_hapter) }}
                                >
                                    <Text style={[
                                        themeStyles.textColor,
                                        c_hapter.chapter_number == pSelected_BibleBook.chapter && styles.activeText
                                    ]}>{ c_hapter.chapter_number }</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </View> */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default BookChapters;

const styles = StyleSheet.create({
    container: {
        // padding: 16
        padding: 5
    },
    booksNameContainer: {
        flexDirection: 'row',
        // justifyContent: 'space-around',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
    },
    booksName: {
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        // flexGrow: 1,
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

});
