import { ScrollView, SafeAreaView, StyleSheet, Text, View, 
  TouchableOpacity, Pressable, TextInput, Share
} from 'react-native';
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { setColorTheme, setFontSize, setSearchResultLimit } from '@/state/slices/settingsSlice';
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet'
import Toast from 'react-native-root-toast';
import Slider from '@react-native-community/slider';
import Colors from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';


export default function TabFourScreen() {
  const navigation: any = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const settings = useSelector((state: RootState) => state.settings);

  const snapPoints = useMemo(() => ['25%'], []);
  const renderBackdrop = useCallback((props: any) => 
      <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} { ...props } />
  ,[]);
  const { dismiss } = useBottomSheetModal();
  const fontSizeRef = useRef<BottomSheetModal>(null);
  const searchResultLimitRef = useRef<BottomSheetModal>(null);

  const [fontSizeValue, setFontSizeValue] = useState(settings.fontSize);
  const [searchResultLimitValue, setSearchResultLimitValue] = useState(settings.searchResultLimit);


  const toggleColorTheme = () => {
    const newColorTheme = settings.colorTheme === 'dark' ? 'light' : 'dark';
    dispatch(setColorTheme(newColorTheme));
  }

  const saveFontSize = () => {
    dispatch(setFontSize(fontSizeValue));
    dismiss();
  }

  const saveSearchResultLimit = () => {
    dispatch(setSearchResultLimit(searchResultLimitValue));
    dismiss();
  }


  const shareApp = async () => {
    try {
      const appUrl = '';
      const shareResult = await Share.share({
        title: "Bible Alert Mobile App",
        message: `Download the Bible Alert Mobile App \n\n ${appUrl}`
      });

      if (shareResult.action === Share.sharedAction) {
        // if (shareResult.activityType) {
        //     console.log("shared with activity type of: ", shareResult.activityType);
        // } else {
        //     console.log("shared");
        // }

        const msg = `shared!`;
        let toast = Toast.show(msg, {
          duration: Toast.durations.LONG,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 0,
        });

        dismiss();
      }
    } catch (error) {
      console.log(error);

      const msg = `Request failed to share.!`;
      let toast = Toast.show(msg, {
        duration: Toast.durations.LONG,
        position: Toast.positions.BOTTOM,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
      });
    }
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
    BSbackground: {
      backgroundColor: settings.colorTheme == 'dark' ? "rgb(60, 60, 60)" : 'rgb(241, 241, 241)'
    },
    searchResultLimitInput: {
      fontSize: settings.fontSize,
      backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff"
    }
  });


  const fontSizeScreenView = () => (
    <View style={{padding: 16}}>
      <Text style={{ ...themeStyles.text, fontSize: fontSizeValue }}>Font Size ({fontSizeValue}) </Text>
      <Slider
        style={{width: '100%', height: 'auto'}}
        minimumValue={15}
        maximumValue={45}
        minimumTrackTintColor={Colors.primary}
        maximumTrackTintColor="#fff"
        thumbTintColor={Colors.primary}
        value={fontSizeValue}
        onValueChange={(value) => setFontSizeValue(Number(value.toFixed(1)))}
      />

      <TouchableOpacity style={styles.bottomSheetBTN} onPress={() => saveFontSize()}>
        <Text style={styles.bottomSheetBTNtext}>Save</Text>
      </TouchableOpacity>
    </View>
  );

  const searchResultLimitScreenView = () => (
    <View style={{paddingHorizontal: 16}}>
      <Text style={{fontSize: 24, fontWeight: 'bold', ...themeStyles.textColor }}>Search Result Limit</Text>
      <TextInput
          style={[styles.searchResultLimitInput, themeStyles.searchResultLimitInput]}
          onChangeText={(text) => setSearchResultLimitValue(Number(text))}
          value={searchResultLimitValue.toString()}
          placeholder="Search Result Limit"
          keyboardType="numeric"
          returnKeyType="default"
          // blurOnSubmit={true}
          inputMode="numeric"
          enterKeyHint="enter"
          onKeyPress={({nativeEvent: {key: keyValue}}) => {
            // const enteredKey = nativeEvent.key;
            // console.log(keyValue);
            if (keyValue == 'Enter') {
              saveSearchResultLimit();
            }
          }}
          autoFocus={true}
        />

      <TouchableOpacity style={styles.bottomSheetBTN} onPress={() => saveSearchResultLimit()}>
        <Text style={styles.bottomSheetBTNtext}>Save</Text>
      </TouchableOpacity>
    </View>
  );

  
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

      <ScrollView>
        <BottomSheetModal ref={fontSizeRef} snapPoints={snapPoints} 
          overDragResistanceFactor={0}
          backgroundStyle={{
            backgroundColor: themeStyles.BSbackground.backgroundColor,
            borderRadius: 0
          }}
          handleIndicatorStyle={{ display: 'none' }}
          backdropComponent={renderBackdrop}
        >
          { fontSizeScreenView() }
        </BottomSheetModal>

        <BottomSheetModal ref={searchResultLimitRef} snapPoints={snapPoints} 
          overDragResistanceFactor={0}
          backgroundStyle={{
            backgroundColor: themeStyles.BSbackground.backgroundColor,
            borderRadius: 0
          }}
          handleIndicatorStyle={{ display: 'none' }}
          backdropComponent={renderBackdrop}
        >
          { searchResultLimitScreenView() }
        </BottomSheetModal>

        <View style={styles.container}>
          <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} onPress={() => fontSizeRef.current?.present()}>
            <Ionicons name="options-outline" size={24} style={themeStyles.iconColor} />
            <Text style={[styles.text, themeStyles.textColor]}>Font Size</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={themeStyles.textColor}>{ settings.fontSize }</Text>
              <Ionicons style={styles.forwardIcon} name="chevron-forward" size={24} />
            </View>
          </TouchableOpacity>

          <Link href="/bookmark" asChild>
            <Pressable>
              <View style={[styles.listContainer, themeStyles.contentBg]}>
                <Ionicons name="bookmarks-outline" size={24} style={themeStyles.iconColor} />
                <Text style={[styles.text, themeStyles.textColor]}>Bookmark</Text>
                <Ionicons style={styles.forwardIcon} name="chevron-forward" size={24} />
              </View>
            </Pressable>
          </Link>

          <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} onPress={() => toggleColorTheme() }>
            <MaterialCommunityIcons name="theme-light-dark" size={24} style={themeStyles.iconColor} />
            <Text style={[styles.text, themeStyles.textColor]}>Theme</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ textTransform: 'capitalize', ...themeStyles.textColor}}>{ settings.colorTheme }</Text>
              <Ionicons style={styles.forwardIcon} name="chevron-forward" size={24} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} onPress={() => searchResultLimitRef.current?.present()}>
            <Ionicons name="search-outline" size={24} style={themeStyles.iconColor} />
            <Text style={[styles.text, themeStyles.textColor]}>Search Result Limit</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={themeStyles.textColor}>{ settings.searchResultLimit }</Text>
              <Ionicons style={styles.forwardIcon} name="chevron-forward" size={24} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} onPress={() => shareApp()}>
            <Ionicons name="share-social-outline" size={24} style={themeStyles.iconColor} />
            <Text style={[styles.text, themeStyles.textColor]}>Share App</Text>
            <Ionicons style={styles.forwardIcon} name="chevron-forward" size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]}>
            <Ionicons name="information-circle-outline" size={24} style={themeStyles.iconColor} />
            <Text style={[styles.text, themeStyles.textColor]}>About Us</Text>
            <Ionicons style={styles.forwardIcon} name="chevron-forward" size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]}>
            <Ionicons name="help-circle-outline" size={24} style={themeStyles.iconColor} />
            <Text style={[styles.text, themeStyles.textColor]}>Feedback/Help Center</Text>
            <Ionicons style={styles.forwardIcon} name="chevron-forward" size={24} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]}>
            <Ionicons name="star-outline" size={24} style={themeStyles.iconColor} />
            <Text style={[styles.text, themeStyles.textColor]}>Rate on Playstore</Text>
            <Ionicons style={styles.forwardIcon} name="chevron-forward" size={24} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 2,
    // backgroundColor: 'white',
    borderRadius: 7
  },
  text: {
    flexGrow: 1,
    fontSize: 24,
    paddingLeft: 16
  },
  forwardIcon: {
    color: 'gray'
  },
  bottomSheetBTN: {
    padding: 16, 
    backgroundColor: Colors.primary, 
    marginTop: 30, 
    borderRadius: 7
  },
  bottomSheetBTNtext: {
    fontSize: 24, 
    textAlign: 'center', 
    color: '#fff', 
    textTransform: 'uppercase'
  },
  searchResultLimitInput: {
    borderBottomWidth: 3,
    borderRadius: 5,
    borderColor: Colors.primary,
    padding: 16,
    // fontSize: 16,
    // backgroundColor: '#fff',
    marginTop: 20
  }
});
