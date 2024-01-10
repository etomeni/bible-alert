import { useEffect, useRef, useState } from 'react';
import { StyleSheet, FlatList, SafeAreaView,
  TouchableOpacity, Text, View, Image
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { bibleInterface } from '@/constants/modelTypes';
import BottomSheet from '@/components/BottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { bibleVerseDetails } from '@/state/slices/selectedBibleVerseModalSlice';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { getBibleBookChapters, getBibleBookVerses, getBibleEndChapter } from '@/constants/bibleResource';
import { set_SelectedBible } from '@/state/slices/bibleSelectionSlice';
import { bibleDetails } from '@/state/slices/bibleVerseSlice';
import bible_KJV from "@/assets/bible/kjvTS";


export function formatBibleVerseToDisplay(str: string) {
  const modifiedText = str.replace(/\u2039(.*?)\u203a/g, (match, p1) => {
    return `<red>${p1}</red>`;
  });

  const parts = modifiedText.split(/(<red>.*?<\/red>)/g);

  return (
    <Text>
      {parts.map((part, index) =>
        part.startsWith('<red>') ? (
          <Text key={index} style={{ color: 'red' }}>
            {part.substring(5, part.length - 6)}
          </Text>
        ) : (
          part
        )
      )}
    </Text>
  );
};


export default function IndexScreen() {
  const Bible: bibleInterface[] = useSelector((state: RootState) => state.bible);
  const selected_BibleBook = useSelector((state: RootState) => state.selectedBibleBook);
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch<AppDispatch>();
  
  const flatListRef = useRef<FlatList<any>>(null);
  const [c_Index, setc_Index] = useState(selected_BibleBook.verse - 1);

  const [previousNav, setPreviousNav] = useState(false);
  const [nextNav, setNextNav] = useState(true)

  useEffect(() => {
    setc_Index(selected_BibleBook.verse - 1);

    const getEndChapter = getBibleEndChapter(selected_BibleBook);
    if (selected_BibleBook.chapter == 1) {
      setPreviousNav(false);
    } else {
      setPreviousNav(true);
    }

    if (selected_BibleBook.chapter == getEndChapter.length) {
      setNextNav(false);
    } else {
      setNextNav(true);
    }

  }, [selected_BibleBook]);

  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: c_Index,
        animated: true,
      });
    }, 400);
  }, [c_Index]);
  

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const onClickVerse = (_bible: bibleInterface) => {
    dispatch(bibleVerseDetails([_bible]));

    bottomSheetRef.current?.present();
  }

  const onClickNavigate = (action: "Previous" | "Next") => {
    // console.log(action);

    const getEndChapter = getBibleEndChapter(selected_BibleBook);
    if (action == "Previous" && selected_BibleBook.chapter == 1) return;
    if (action == "Next" && selected_BibleBook.chapter == getEndChapter.length) return;

    const newChapter = action == 'Next' ? selected_BibleBook.chapter + 1 : selected_BibleBook.chapter - 1;

    dispatch(set_SelectedBible({
      book_name: selected_BibleBook.book_name,
      book: selected_BibleBook.book,
      chapter: newChapter,
      verse: 1,
    }));

    const Bible: any = selected_BibleBook.book > 39 ? bible_KJV.new : bible_KJV.old;

    const _selected = getBibleBookVerses(
      Bible,
      selected_BibleBook.book_name,
      newChapter,
    );

    dispatch(bibleDetails(_selected.bible));

    if (selected_BibleBook.chapter == 1) {
      setPreviousNav(false);
    } else {
      setPreviousNav(true);
    }
    
    if (selected_BibleBook.chapter == getEndChapter.length) {
      setNextNav(false);
    } else {
      setNextNav(true);
    }
  }

  const themeStyles = StyleSheet.create({
    text: {
      // marginBottom: 16,
      textAlign: 'justify',
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
      fontSize: settings.fontSize
    },
    background: {
      backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.background : Colors.light.background
    }
  });


  return (
    <SafeAreaView>
      <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

      <View style={styles.container}>
        <BottomSheet ref={bottomSheetRef} />

        <Swipeable
          renderRightActions={() => <><Text> </Text></>}
          renderLeftActions={() => <><Text> </Text></>}
          onSwipeableWillOpen={(direction) => {
            if (direction == 'right') {
              onClickNavigate("Next")
            }
            if (direction == 'left') {
              onClickNavigate("Previous")
            }
          }}
        >
          <View>
            <FlatList
              data={Bible}
              ref={flatListRef}
              initialScrollIndex={c_Index}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => onClickVerse(item)}>
                  <Text style={styles.verseTextContainer}>
                    <Text style={{ fontWeight: 'bold', fontSize: settings.fontSize + 5, color: Colors.primary }}>
                      {`${item.verse}. `}
                    </Text>
                    <Text style={themeStyles.text}>
                      {/* {item.text.trim()} */}
                      {formatBibleVerseToDisplay(item.text.trim())}
                    </Text>
                  </Text>
                </TouchableOpacity>
              )}
              onScrollToIndexFailed={info => {
                const wait = new Promise(resolve => setTimeout(resolve, 500));
                wait.then(() => {
                  flatListRef.current?.scrollToIndex({ index: c_Index, animated: true })
                })
              }}
              keyExtractor={item => item.verse.toString()}

              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Image source={require('@/assets/images/empty.png')} style={{ width: 200, height: 200 }} />
                  <Text style={styles.emptySearchText}>Bible referrence not found</Text>
                </View>
              }
            />
          </View>
        </Swipeable>


        {/* <View style={{
          paddingHorizontal: 16,
        }}>
          <TouchableOpacity onPress={() => onClickNavigate("Previous")} style={[styles.chapterNavigationContainer, {left: 0, display: previousNav ? 'flex': 'none'}]}>
            <Ionicons name="chevron-back" size={40} color='#fff' />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onClickNavigate("Next")} style={[styles.chapterNavigationContainer, {right: 0, display: nextNav ? 'flex': 'none'}]}>
            <Ionicons name="chevron-forward" size={40} color='#fff' />
          </TouchableOpacity>
        </View> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: 16,
    // paddingVertical: 10,
  },
  verseTextContainer: {
    marginBottom: 10,
    // textAlign: 'justify',
    // color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '50%',
  },
  emptySearchText: {
    color: 'gray',
    fontSize: 20,
    textAlign: 'center'
  },
  chapterNavigationContainer: {
    backgroundColor: Colors.primary, 
    borderRadius: 100,
    position: 'absolute',
    bottom: 20,
  }
});
