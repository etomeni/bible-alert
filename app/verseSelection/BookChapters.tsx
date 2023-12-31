import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useDispatch, useSelector } from "react-redux";
import bibleKJV from "@/assets/bible/kjvTS";
import { AppDispatch, RootState } from "@/state/store";
import Colors from "@/constants/Colors";
import { setSelectedChapter } from "@/state/slices/bibleSelectionSlice";
import { getBibleBookChapters } from "@/constants/bibleResource";
import { _bibleVerseSelection_ } from "@/constants/modelTypes";
import { setTemptBibleVerseSelectionData } from "@/state/slices/temptDataSlice";


const BookChapters = () => {
    const dispatch = useDispatch<AppDispatch>();
    const settings = useSelector((state: RootState) => state.settings);
    const pSelected_BibleBook = useSelector((state: RootState) => state.selectedBibleBook);
    const selectedBibleBook = useSelector((state: RootState) => state.temptData.temptBibleBookSelection);
    
    // const chapters = getBibleBookChapters( selectedBibleBook.book > 39 ? bibleKJV.new : bibleKJV.old, selectedBibleBook.book_name); // 'Genesis'
      
    const onSelectBook = (chapter: _bibleVerseSelection_) => {
        dispatch(setSelectedChapter(chapter.chapter_number));

        dispatch(setTemptBibleVerseSelectionData(chapter));
        router.push("/verseSelection/BookVerses");
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
                    </View>
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
