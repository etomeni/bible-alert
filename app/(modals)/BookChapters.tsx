import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import bibleKJV from "../../assets/bible/kjvTS";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { useNavigation } from "expo-router";
import Colors from "@/constants/Colors";
import { selectedChapter } from "@/state/slices/bibleSelectionSlice";
import { StatusBar } from "expo-status-bar";

function getBibleBookChapters(bible: any, bookName: string) {
    const _books = bible.filter((book: any) => book.book_name === bookName);

    const uniqueBookChapters = _books.reduce((acc: any, book: any) => {
        const existingChapters = acc.find((b: any) => b === book.chapter);
        if (!existingChapters) {
            acc.push(book.chapter);
        }
        return acc;
    }, []);

    return uniqueBookChapters;
}

const BookChapters = () => {
    const navigation: any = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const selectedBibleBook = useSelector((state: RootState) => state.selectedBibleBook);
    const settings = useSelector((state: RootState) => state.settings);
    
    const chapters = getBibleBookChapters( selectedBibleBook.book > 39 ? bibleKJV.new : bibleKJV.old, selectedBibleBook.book_name); // 'Genesis'
      
    const onSelectBook = (chapter: number) => {
        dispatch(selectedChapter(chapter));
        navigation.navigate('(modals)/BookVerses');
        // navigation.goBack();
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
        contentBg: {
            backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff"
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
