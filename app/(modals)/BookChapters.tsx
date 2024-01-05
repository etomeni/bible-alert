import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useDispatch, useSelector } from "react-redux";
import bibleKJV from "@/assets/bible/kjvTS";
import { AppDispatch, RootState } from "@/state/store";
import Colors from "@/constants/Colors";
import { selectedChapter } from "@/state/slices/bibleSelectionSlice";
import { getBibleBookChapters } from "@/constants/bibleResource";


const BookChapters = () => {
    const dispatch = useDispatch<AppDispatch>();
    const selectedBibleBook = useSelector((state: RootState) => state.selectedBibleBook);
    const settings = useSelector((state: RootState) => state.settings);
    
    const chapters = getBibleBookChapters( selectedBibleBook.book > 39 ? bibleKJV.new : bibleKJV.old, selectedBibleBook.book_name); // 'Genesis'
      
    const onSelectBook = (chapter: number) => {
        dispatch(selectedChapter(chapter));
        router.push("/(modals)/BookVerses");
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
                            chapters.map((c_hapter: any, index: number) => (
                                <TouchableOpacity key={index} 
                                    style={[
                                        styles.booksName, 
                                        themeStyles.contentBg,
                                        c_hapter == selectedBibleBook.chapter && styles.active 
                                    ]}
                                    onPress={() => { onSelectBook(c_hapter) }}
                                >
                                    <Text style={[
                                        themeStyles.textColor,
                                        c_hapter == selectedBibleBook.chapter && styles.activeText
                                    ]}>{ c_hapter }</Text>
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
