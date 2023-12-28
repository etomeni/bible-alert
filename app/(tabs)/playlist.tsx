import { View, Text, FlatList, TouchableOpacity,
  StyleSheet, SafeAreaView, Image
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 

import Colors from '../../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import { useEffect, useRef, useState } from 'react';
import { _Playlists_, playlistInterface } from '@/constants/modelTypes';
import PlaylistOptionsBottomSheet from '@/components/PlaylistOptionsBottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
// import { setTemptPlaylistData } from '@/state/slices/temptPlaylistSlice';
import Toast from 'react-native-root-toast';
import { useNavigation } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { deletePlaylist } from '@/state/slices/playlistSlice';
import { setTemptPlaylistData } from '@/state/slices/temptDataSlice';


export default function PlaylistScreen() {
  const navigation: any = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const _reduxPlaylists = useSelector((state: RootState) => state.playlists);

  const [playlists, setPlaylist] = useState<_Playlists_[]>(_reduxPlaylists);
  const settings = useSelector((state: RootState) => state.settings);

  useEffect(() => {
    setPlaylist(_reduxPlaylists);
  }, [_reduxPlaylists]);
  
  
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const onClickPlaylistOptions = (_bible: _Playlists_) => {
    dispatch(setTemptPlaylistData(_bible));
    bottomSheetRef.current?.present();
  }

  const onClickPlay = (item: _Playlists_) => {
    dispatch(setTemptPlaylistData(item));
    navigation.navigate('playlist/ViewPlaylist');

    // dispatch(setTemptPlaylistData({ ...item, action: "Play" }));
    // navigation.navigate('PlaylistView');
  }

  const onClickDelete = (pItem: _Playlists_) => {
    dispatch(deletePlaylist(pItem));
    
    const msg = `${ pItem.title } removed from playlist`;
    let toast = Toast.show(msg, {
      duration: Toast.durations.LONG,
      // position: Toast.positions.BOTTOM,
      // shadow: true,
      // animation: true,
      // hideOnPress: true,
      // delay: 0,
    });
  }

  const onClickEdit = (item: _Playlists_) => {
    dispatch(setTemptPlaylistData(item));
    navigation.navigate('playlist/EditPlaylist');
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
    background: {
      backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.background : Colors.light.background
    },
    border: {
      borderColor: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
    },
    iconColor: {
      color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
    },
    contentBg: {
      // backgroundColor: '#f6f3ea43', // #f6f3ea43
      backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff"
    }
  });

  const RightSwipeActions = ({ item }: {item: _Playlists_}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'stretch',
          // paddingHorizontal: 0
        }}
      >
        <TouchableOpacity style={{ ...styles.swiperIconBTN, backgroundColor: Colors.primary }} onPress={() => onClickEdit(item)}>
          <FontAwesome5 style={styles.swiperIcon} name="pen" size={24} color={"#fff"} />
        </TouchableOpacity>

        <TouchableOpacity style={{ ...styles.swiperIconBTN, backgroundColor: '#de2341', borderEndEndRadius: 25, borderTopEndRadius: 25 }} onPress={() => onClickDelete(item)}>
          <FontAwesome5 style={styles.swiperIcon} name="trash" size={24} color={'#fff'} />
        </TouchableOpacity>
      </View>
    );
  };
  
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

      <PlaylistOptionsBottomSheet ref={bottomSheetRef} />

      <View style={{ margin: 15 }}>
        <FlatList
          data={playlists}
          // ref={flatListRef}
          // initialScrollIndex={c_Index}
          renderItem={({item}) => (
            <View style={[styles.listContainer, themeStyles.contentBg]}>
              <Swipeable
                renderRightActions={() => <RightSwipeActions item={item} />}
              >
                <View style={styles.listContent}>
                  <TouchableOpacity style={{flexGrow: 1}} onPress={() => onClickPlay(item)}>
                    <View style={{paddingVertical: 10}}>
                      <Text style={[styles.listTextContainer, themeStyles.text]}>{ item.title }</Text>
                      <Text style={{color: 'gray', fontSize: 18}}>
                        {`${item.lists.length} Verse${item.lists.length > 1 ? 's' : ''}`}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => onClickPlaylistOptions(item)}>
                    <View style={styles.iconsContainer}>
                      <Ionicons name="ellipsis-vertical" size={24} style={themeStyles.iconColor} />
                    </View>
                  </TouchableOpacity>
                </View>
              </Swipeable>
            </View>
          )}
          keyExtractor={(item, index) => `${index}`}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image source={require('@/assets/images/empty.png')} style={{ width: 350, height: 350 }} />
              <Text style={[styles.emptyPlaylistText, themeStyles.textColor]}>You don't have anything on your playlist yet.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: 'space-between',
    gap: 15,
    backgroundColor: 'transparent'
  },

  listContainer: {
    // backgroundColor: "white",
    marginVertical: 5,
    borderRadius: 30,
  },
  
  listContent: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  listTextContainer: {
    fontSize: 16,
    fontWeight: "600",
    
  },
  swiperIconBTN: {
    alignContent: 'center',
    justifyContent: 'center'
  },
  swiperIcon: {
    paddingHorizontal: 12
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '40%',
  },
  emptyPlaylistText: {
    // color: 'gray',
    fontSize: 24,
    textAlign: 'center'
  }
});
