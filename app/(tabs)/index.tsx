import { useEffect, useRef, useState } from 'react';
import { SafeAreaView, StyleSheet, FlatList, 
  TouchableOpacity, Text, View, Image
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { bibleInterface } from '@/constants/modelTypes';
import BottomSheet from '@/components/BottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { bibleVerseDetails } from '@/state/slices/selectedBibleVerseModalSlice';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';

// export default function TabOneScreen() {
export default function IndexScreen() {
  const Bible: bibleInterface[] = useSelector((state: RootState) => state.bible);
  const selectedBibleBook = useSelector((state: RootState) => state.selectedBibleBook);
  const settings = useSelector((state: RootState) => state.settings);
  const dispatch = useDispatch<AppDispatch>();
  
  const flatListRef = useRef<FlatList<any>>(null);
  const [c_Index, setc_Index] = useState(selectedBibleBook.verse - 1);

  useEffect(() => {
    setc_Index(selectedBibleBook.verse - 1);
  }, [selectedBibleBook]);

  useEffect(() => {
    flatListRef.current?.scrollToIndex({
      index: c_Index, 
      animated: true,
    })

  }, [c_Index]);
  

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const onClickVerse = (_bible: bibleInterface) => {
    dispatch(bibleVerseDetails([_bible]));

    bottomSheetRef.current?.present();
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
    <SafeAreaView style={{flex: 1}}>
      <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

      <View style={styles.container}>
        <BottomSheet ref={bottomSheetRef} />
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
                    {item.text}
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
    marginBottom: 16,
    textAlign: 'justify',
    // color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '50%',
  },
  emptySearchText: {
    color: 'gray',
    fontSize: 24,
    textAlign: 'center'
  }
  // verseSelectionContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   marginVertical: 10,
  //   marginBottom: 20,
  //   borderStyle: 'solid',
  //   borderWidth: 1,
  //   borderColor: 'white',
  //   borderRadius: 20
  // },
  // selctionText: {
  //   flexGrow: 1,
  //   flex: 1,
  //   textAlign: 'center',
  //   padding: 5,
  // },
  // bookSelction: {
  //   borderRightColor: "white",
  //   borderRightWidth: 1,
  //   borderStyle: 'solid'
  // },
  // versionSelction: {
  //   backgroundColor: '#f6f3ea43',
  //   borderRadius: 20
  // },
});
