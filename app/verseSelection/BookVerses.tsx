import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { router, useLocalSearchParams } from "expo-router";

import { useDispatch, useSelector } from "react-redux";
import bibleKJV from "@/assets/bible/kjvTS";
import { AppDispatch, RootState } from "@/state/store";
import { setSelectedChapter, setSelectedVerse, set_SelectedBible } from "@/state/slices/bibleSelectionSlice";
import Colors from "@/constants/Colors";
import { bibleDetails } from "@/state/slices/bibleVerseSlice";
import { getBibleBookVerses } from "@/constants/resources";
import { useEffect, useState } from "react";
import { bibleInterface } from "@/constants/modelTypes";


const BookVerses = () => {
    const queryParams = useLocalSearchParams();

    const dispatch = useDispatch<AppDispatch>();
    const selectedBibleBook = useSelector((state: RootState) => state.selectedBibleBook);
    const settings = useSelector((state: RootState) => state.settings);

    const Bible: any = selectedBibleBook.book > 39 ? bibleKJV.new : bibleKJV.old;
    const [verses, setVerses] = useState<any>([]);
    const [selected_Bible, setSelected_Bible] = useState<bibleInterface[]>([]);


    useEffect(() => {
        if (queryParams.chapter) {
            const _chapter_ = Number(queryParams.chapter);

            const _selected = getBibleBookVerses(
                Bible,
                selectedBibleBook.book_name,
                _chapter_,
            );
            setVerses(_selected.verses);
            setSelected_Bible(_selected.bible);

            dispatch(setSelectedChapter(_chapter_));
        } else {
            const _selected = getBibleBookVerses(
                Bible,
                selectedBibleBook.book_name,
                selectedBibleBook.chapter,
            ); // 'Genesis'

            setVerses(_selected.verses);
            setSelected_Bible(_selected.bible);
        }
    }, []);


    const onSelectBook = (verse: number) => {
        dispatch(set_SelectedBible({
            book_name: selectedBibleBook.book_name,
            book: selectedBibleBook.book,
            chapter: selectedBibleBook.chapter,
            verse: verse,
        }));

        // dispatch(setSelectedVerse(verse));
        dispatch(bibleDetails(selected_Bible));
        router.push({ pathname: '/(tabs)', params: {} });
    }

    const themeStyles = StyleSheet.create({
        textColor: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        },
        contentBg: {
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
                            verses.map((verse: any, index: number) => (
                                <TouchableOpacity key={index} 
                                    style={[
                                        styles.booksName,
                                        themeStyles.contentBg,
                                        verse == selectedBibleBook.verse && styles.active 
                                    ]}
                                    onPress={() => onSelectBook(verse)}
                                >
                                    <Text style={[
                                        themeStyles.textColor,
                                        verse == selectedBibleBook.verse && styles.activeText
                                    ]}>
                                        { verse }
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

export default BookVerses;


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