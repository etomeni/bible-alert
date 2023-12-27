import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

import bibleKJV from "../../assets/bible/kjvTS";
import { useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { selectedVerse } from "@/state/slices/bibleSelectionSlice";
import Colors from "@/constants/Colors";
import { bibleDetails } from "@/state/slices/bibleVerseSlice";
import { getBibleBookVerses } from "@/constants/resources";
import { StatusBar } from "expo-status-bar";


const BookVerses = () => {
    const navigation: any = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const selectedBibleBook = useSelector((state: RootState) => state.selectedBibleBook);
    const settings = useSelector((state: RootState) => state.settings);

    const Bible: any = selectedBibleBook.book > 39 ? bibleKJV.new : bibleKJV.old;
    const _selected = getBibleBookVerses(
        Bible,
        selectedBibleBook.book_name,
        selectedBibleBook.chapter,
    ); // 'Genesis'
      
    const onSelectBook = (verse: number) => {
        dispatch(selectedVerse(verse));
        dispatch(bibleDetails(_selected.bible));
        navigation.navigate('(tabs)');
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
                            _selected.verses.map((verse: any, index: number) => (
                                <TouchableOpacity key={index} 
                                    style={[
                                        styles.booksName,
                                        themeStyles.contentBg,
                                        verse == selectedBibleBook.verse && styles.active 
                                    ]}
                                    onPress={() => { onSelectBook(verse) }}
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
