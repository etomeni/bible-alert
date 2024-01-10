import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { _bibleBookSelection_, selectedBibleInterface, settingsInterface } from "@/constants/modelTypes";
import Colors from "@/constants/Colors";


export default function OldBibleBooks(
    {oldTestamentBooks, settings, selectedBibleBookRedux, onSelectBook}
    :
    {
        oldTestamentBooks: _bibleBookSelection_[], 
        settings: settingsInterface,
        selectedBibleBookRedux: selectedBibleInterface,
        onSelectBook: any
    }
) {

    const themeStyles = StyleSheet.create({
        textColor: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        },
        contentBg: {
            // backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff"
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground
        }
    });

    return (
        <ScrollView>
            <View style={styles.container}>
                {/* <View style={styles.testamentContainer}>
                    <Text style={[styles.testamentText, themeStyles.textColor]}>Old Testament</Text>
                </View> */}

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
            </View>
        </ScrollView>
    )
}


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
        paddingHorizontal: 10, 
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
});
