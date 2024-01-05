import { useState, memo } from 'react';
import { 
  Text, View, Image,
  StyleSheet, TextInput, TouchableOpacity, FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import bibleKJV from "@/assets/bible/kjv_all";
import bible_KJV from "@/assets/bible/kjvTS";
import { bibleInterface } from '@/constants/modelTypes';
import { selectedBibleBook, selectedChapter, selectedVerse } from '@/state/slices/bibleSelectionSlice';
import { bibleDetails } from '@/state/slices/bibleVerseSlice';

import { useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getBibleBookVerses } from '@/constants/resources';
import { StatusBar } from 'expo-status-bar';
import { formatBibleVerseToDisplay } from '.';
 

function highlightSearchWord(searchResults: bibleInterface[], searchValue: string) {
  const searchKeyWord = searchValue.trim().toLowerCase();

  const result = searchResults.map((verse) => {
    // Split the text into parts before and after the matched query
    const modifiedText = verse.text.replace(/\u2039|\u203a/g, '');
    const parts = modifiedText.split(new RegExp(`(${searchKeyWord})`, 'gi'));

    // Map each part to Text component, bolding the matched query
    const formattedText = parts.map((part, index) => {
      return(
        <Text>
          {
            part.trim().toLowerCase() === searchKeyWord ? (
              <Text key={index} style={{
                fontWeight: 'bold',
                backgroundColor: Colors.primary,
                color: 'white',
                paddingHorizontal: 5
              }}>
                { part }
              </Text>
            ) : (
              <Text key={index}>
                { part }
                {/* { formatBibleVerseToDisplay(part) } */}
              </Text>
            )
          }
        </Text>

        // <Text key={index} style={
        //   part.trim().toLowerCase() === searchKeyWord ? {
        //     fontWeight: 'bold',
        //     backgroundColor: Colors.primary,
        //     color: 'white',
        //     paddingHorizontal: 5
        //   } : {
        //     fontWeight: 'normal'
        //   }
        // }>
        //   { part }
        // </Text>
      );
    });

    return {
      ...verse,
      formattedText: formattedText,
    };
  });

  return result;
}

export default function SearchScreen() {
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<bibleInterface[]>([]);
  const [searchWords, setSearchWords] = useState<any[]>([]);
  const [searching, setSearching] = useState<'init' | 'seaching' | 'result'>('init');
  const settings = useSelector((state: RootState) => state.settings);

  const navigation: any = useNavigation();
  const dispatch = useDispatch<AppDispatch>();

  const searchFunc2 = () => {
    if (searchValue && searchValue.length) {
      setSearching('seaching');

      const searchKeyWords2 = searchValue.toLowerCase().trim()
      .split(/\s+/).filter((keyWord) => keyWord.length < 2);
      // searchKeyWords2.unshift(searchValue.toLowerCase().trim());
  
      const results2 = bibleKJV.filter((verse) => {
        const lowercaseText = verse.text.toLowerCase();
        // Check for each keyword in the text
        return searchKeyWords2.every((keyword) => lowercaseText.includes(keyword.trim()));
      });
  
      if (results2 && results2.length) {
        setSearching('result');
        setSearchResults(results2);
      } else {
        setSearching('result');
        setSearchResults([]);
      }
    }
  }

  const searchFunc = () => {
    if (searchValue && searchValue.length) {
      setSearching('seaching');
      // Convert the query to lowercase for case-insensitive search
      const searchKeyWords = searchValue.toLowerCase();
      // Filter the Bible data based on the search query
      // OPTIMIZED WAY OF PERFORMING SEARCH LIMITS
      const _search_Results = [];
      let count = 0;
      for (const obj of bibleKJV) {
        const modifiedText = obj.text.replace(/\u2039|\u203a/g, '');

        const searchFields = modifiedText.toLowerCase();
        if (searchFields.includes(searchKeyWords)) {
          _search_Results.push(obj);
          count++;
          if (count === settings.searchResultLimit) {
            break; // Stop searching once we have 500 results
          }
        }
      }
      
      const result1 = highlightSearchWord(_search_Results, searchKeyWords);
      if (result1 && result1.length) {
        setSearching('result');
        setSearchResults(result1);
      } else {
        setSearching('result');
        setSearchResults([]);
      }
    }
  }

  const renderText = (text: string) => {
    return text.split(' ').map((word, index) => {
      return (
        <Text key={index} style={
          searchWords.includes(word) ? {
            fontWeight: 'bold',
            fontSize: 16,
          } : {
            fontWeight: 'normal'
          }
        }>
          {word.trim() + ' '}
        </Text>
      );
    });
  };
  

  const onClickVerse = (_bible: bibleInterface) => {
    // console.log(_bible);

    dispatch(selectedBibleBook({
      book_name: _bible.book_name,
      book_number: _bible.book
    }));
    dispatch(selectedChapter(_bible.chapter));
    dispatch(selectedVerse(_bible.verse));

    const Bible: any = _bible.book > 39 ? bible_KJV.new : bible_KJV.old;

    const _selected = getBibleBookVerses(
      Bible,
      _bible.book_name,
      _bible.chapter,
    );

    dispatch(bibleDetails(_selected.bible));
    navigation.navigate('index');
    // navigation.navigate('(tabs)');
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
    border: {
      borderColor: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
    },
    iconColor: {
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
    },
    contentBg: {
      backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff"
    },
    searchInput: {
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
      backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff",
      borderColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff",
      fontSize: 16
      // fontSize: settings.fontSize
    },
    inputContainer: {
      borderColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff",
    },
    textSearchVerse: {
      textAlign: 'justify',
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
      fontSize: settings.fontSize + 5
    }
  });


  const MyListItem = memo(({ item } : { item: bibleInterface}) => {
    // Your component logic here
    return(
      <TouchableOpacity style={[styles.searchResult, themeStyles.contentBg]} 
        onPress={() => onClickVerse(item)}
      >
        <Text style={[styles.bookChapterTextContainer, themeStyles.textSearchVerse]}>
          { item.book_name + " " + item.chapter + ":" + item.verse }
        </Text>

        <Text style={[styles.verseTextContainer, themeStyles.text]}>
          { item.formattedText }
        </Text>
      </TouchableOpacity>
    );
  });
  

  
  return (
    <SafeAreaView>
      <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

      <View style={[styles.inputContainer, themeStyles.inputContainer]}>
        <TextInput
          style={[styles.searchInput, themeStyles.searchInput]}
          onChangeText={setSearchValue}
          value={searchValue}
          selectionColor={themeStyles.textColor.color}
          placeholder=" Search in KJV"
          placeholderTextColor={'gray'}
          keyboardType="web-search"
          returnKeyType="search"
          // blurOnSubmit={true}
          inputMode="search"
          enterKeyHint="search"
          onKeyPress={({nativeEvent: {key: keyValue}}) => {
            // const enteredKey = nativeEvent.key;
            // console.log(keyValue);
            if (keyValue == 'Enter') {
              searchFunc();
            }
          }}
          autoFocus={true}
        />
        <TouchableOpacity
          onPress={() => { searchFunc(); }}
          style={styles.searchIconContainer}
        >
          <Ionicons style={styles.searchIcon} name="search" size={24} />
        </TouchableOpacity>
      </View>

      {
        searching == "init" ? (
          <View style={styles.emptyContainer}>
            <Ionicons style={styles.emptySearchIcon} name="search" size={150} />
            <Text style={styles.emptySearchText}>Search</Text>
          </View>
        ) : searching == "seaching" ? (
          <View style={styles.emptyContainer}>
            <Image source={require('@/assets/images/searching.png')} style={{ width: 300, height: 300 }} />
            <Text style={styles.emptySearchText}>Searching...</Text>
          </View>
        ) : (
          <View style={styles.searchResultContainer}>
            <FlatList
              data={searchResults.slice(0, 3000)}
              // ref={flatListRef}
              // initialScrollIndex={c_Index}
              renderItem={({item}) => (
                <MyListItem item={item} />
              )}
              keyExtractor={(item, index) => `${ index }`}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Image source={require('@/assets/images/empty.png')} style={{ width: 200, height: 200 }} />
                  <Text style={styles.emptySearchText}>Search word not found</Text>
                </View>
              }
            />
          </View>
        )
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  searchInput: {
    // height: 40,
    // margin: 16,
    borderWidth: 0.4,
    borderRadius: 5,
    // borderColor: 'gray',
    padding: 10,
    fontSize: 16,
    flexGrow: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 2,
  },
  searchIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    padding: 7,
    borderRadius: 5,
    marginLeft: 10,
  },
  searchResult: {
    marginBottom: 5,
    // backgroundColor: 'white',
    padding: 10,
    paddingHorizontal: 16,
    borderRadius: 10
  },
  searchIcon: {
    color: 'white'
  },
  
  searchResultContainer: {
    padding: 16,
  },
  bookChapterTextContainer: {
    // fontSize: 18,
    fontWeight: 'bold',
    paddingBottom: 7
  },
  verseTextContainer: {
    marginBottom: 16,
    textAlign: 'justify',
  },
  emptyContainer: {
    // flex: 1,
    // display: 'flex',
    // flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '50%',
  },
  emptySearchIcon: {
    color: 'gray',
  },
  emptySearchText: {
    color: 'gray',
    fontSize: 24
  }
});
