import { View, Text, Image, SafeAreaView, FlatList, TouchableOpacity, StyleSheet } from 'react-native'
import { useEffect, useState  } from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons } from '@expo/vector-icons';

import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import Colors from '@/constants/Colors';
import { getEnglishVoicesAsync } from '@/constants/resources';
import { Voice, VoiceQuality } from 'expo-speech';
import { setVoice } from '@/state/slices/settingsSlice';
import { router } from 'expo-router';
import Toast from 'react-native-root-toast';
import Loading from '@/components/Loading';


const defaultVoice = {
    identifier: "Default",
    name: "Default",
    quality: VoiceQuality.Default,
    language: "Default"
}

export default function Voices() {
    const dispatch = useDispatch<AppDispatch>();
    const [voices_, setVoices_] = useState<Voice[]>([]);
    const settings = useSelector((state: RootState) => state.settings)
    

    useEffect(() => {
        const fetchVoices = async () => {
          if (!voices_.length) {
            const res = await getEnglishVoicesAsync();
            setVoices_(res);
          }
        };
    
        const intervalId = setInterval(fetchVoices, 500);
    
        return () => clearInterval(intervalId);
    }, [voices_]);
    

    const onSelectVoice = (voice: Voice) => {
        dispatch(setVoice(voice));

        const msg = `Reader's voice has been set to ${voice.name}'s voice  ->  (${voice.language}).`;
        let toast = Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            // hideOnPress: true,
            // delay: 0,
        });
        router.back();
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
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground
        },
        BSbackground: {
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.BottomSheetBackground : Colors.light.BottomSheetBackground
        },
        searchResultLimitInput: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground
        }
    });

    return (
        <SafeAreaView style={{flex: 1}}>
            {
                voices_.length ? (
                    <View style={styles.container}>
                        {/* <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} onPress={() => onSelectVoice(defaultVoice)}>
                            <Text style={[styles.text, themeStyles.textColor]}>
                                Default
                            </Text>

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {
                                    settings.voice.name == 'Default' ? (
                                        <Ionicons name="radio-button-on" size={24} style={themeStyles.iconColor} />
                                    ) : (
                                        <Ionicons name="radio-button-off" size={24} color={'gray'} />
                                    ) 
                                }
                            </View>
                        </TouchableOpacity> */}

                        <FlatList
                            data={voices_}
                            // ref={flatListRef}
                            // initialScrollIndex={c_Index}
                            renderItem={({item, index}) => (
                                <>
                                    {
                                        index == 0 ? (
                                            <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} onPress={() => onSelectVoice(defaultVoice)}>
                                                <Text style={[styles.text, themeStyles.textColor]}>
                                                    Default
                                                </Text>
                
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    {
                                                        settings.voice.name == 'Default' ? (
                                                            <Ionicons name="radio-button-on" size={24} style={themeStyles.iconColor} />
                                                        ) : (
                                                            <Ionicons name="radio-button-off" size={24} color={'gray'} />
                                                        ) 
                                                    }
                                                </View>
                                            </TouchableOpacity>
                                        ) : (<></>)
                                    }

                                    <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} onPress={() => onSelectVoice(item)}>
                                        <Text style={[styles.text, themeStyles.textColor]}>
                                            {`${item.name}  `}
                                            {/* <Ionicons style={styles.forwardIcon} name="arrow-forward" size={18} />
                                            <Text style={{fontStyle: 'italic'}}>
                                                {`  (${item.language})`}
                                            </Text> */}
                                        </Text>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            {
                                                settings.voice.name == item.name ? (
                                                    <Ionicons name="radio-button-on" size={24} style={themeStyles.iconColor} />
                                                ) : (
                                                    <Ionicons name="radio-button-off" size={24} color={'gray'} />
                                                ) 
                                            }
                                        </View>
                                    </TouchableOpacity>
                                </>
                            )}
                            keyExtractor={(item, index) => `${index}`}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Image source={require('@/assets/images/empty.png')} style={{ width: 300, height: 300 }} />
                                    <Text style={styles.emptySearchText}>There's no voice to select from.</Text>
                                </View>
                            }
                        />
                    </View>
                ) : (
                    <View style={{flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <Loading />
                        <Text style={{
                            color: themeStyles.textColor.color,
                            fontSize: 18
                        }}>Loading...</Text>
                    </View>
                )
            }
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    container: {
    //   flex: 1,
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
      fontSize: 18,
    //   paddingLeft: 16
    },
    forwardIcon: {
      color: 'gray'
    },
    
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: '50%',
    },
    emptySearchText: {
        color: 'gray',
        fontSize: 24
    }
    
});
  