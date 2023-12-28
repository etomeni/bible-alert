import { View, Text, StyleSheet,
    TouchableOpacity, Share, Pressable
} from 'react-native';
import { useNavigation, Link } from 'expo-router';

import * as Clipboard from 'expo-clipboard';
import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet'
import Toast from 'react-native-root-toast';

import { FontAwesome5 } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { AppDispatch, RootState } from '@/state/store';
import { useDispatch, useSelector } from 'react-redux';
import { getLocalStorage, setLocalStorage } from '@/constants/resources';
import { playlistInterface } from '@/constants/modelTypes';
import { initializeTemptPlaylist, setTemptPlaylistData } from '@/state/slices/temptDataSlice';
import { deletePlaylist } from '@/state/slices/playlistSlice';


export type Ref = BottomSheetModal;
const PlaylistOptionsBottomSheet = forwardRef<Ref>((props, ref) => {
    const navigation: any = useNavigation();

    // const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
    const snapPoints = useMemo(() => ['50%'], []);
    const renderBackdrop = useCallback((props: any) => 
        <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} { ...props } />
    ,[]);
    const { dismiss } = useBottomSheetModal();

    const [sharedText, setSharedText] = useState('');
    const [selectedBibleBook, setSelectedBibleBook] = useState('');

    const settings = useSelector((state: RootState) => state.settings);
    const temptBibleVerse = useSelector((state: RootState) => state.temptData.temptBibleVerse);
    const temptPlaylist = useSelector((state: RootState) => state.temptData.temptPlaylist);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        setSharedText(`${ temptBibleVerse.text } \n\n---${ temptBibleVerse.book_name } ${ temptBibleVerse.chapter }:${ temptBibleVerse.verse } \nBible Alert`);
        setSelectedBibleBook(`${ temptBibleVerse.book_name } ${ temptBibleVerse.chapter }:${ temptBibleVerse.verse }`);
    }, [temptBibleVerse]);
    
    const onShare = async () => {
        try {
            const shareResult = await Share.share({
                title: selectedBibleBook,
                message: sharedText
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

    const copyToClipboard = async () => {
        await Clipboard.setStringAsync(sharedText);

        const msg = `copied to clipboard!`;
        let toast = Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            hideOnPress: true,
            delay: 0,
        });

        dismiss();
    };

    const onClickPlay = () => {
        dispatch(setTemptPlaylistData(temptPlaylist));
        navigation.navigate('PlaylistView');
        dismiss();
    }

    const onClickDelete = () => {
        dispatch(deletePlaylist(temptPlaylist));
        
        const msg = `${ temptBibleVerse.book_name } ${ temptBibleVerse.chapter }:${ temptBibleVerse.verse } removed from playlist`;
        let toast = Toast.show(msg, {
            duration: Toast.durations.LONG,
            // position: Toast.positions.BOTTOM,
            // shadow: true,
            // animation: true,
            // hideOnPress: true,
            // delay: 0,
        });

        dispatch(initializeTemptPlaylist(""));
        dismiss();
    }
    
    const onClickEdit = () => {
        dispatch(setTemptPlaylistData(temptPlaylist));
        navigation.navigate('PlaylistEdit');
        dismiss();
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
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.primary,
        },
        contentBg: {
            // backgroundColor: '#f6f3ea43', // #f6f3ea43
            backgroundColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff"
        },
        BSbackground: {
            backgroundColor: settings.colorTheme == 'dark' ? "rgb(60, 60, 60)" : 'rgb(241, 241, 241)'
        },
    });

    return (
        <BottomSheetModal ref={ref} snapPoints={snapPoints} 
            overDragResistanceFactor={0}
            backgroundStyle={{
                // backgroundColor: 'rgb(241, 241, 241)'
                backgroundColor: themeStyles.BSbackground.backgroundColor,
            }}
            backdropComponent={renderBackdrop}
        >
            <View style={{ paddingHorizontal: 5 }}>
                {/* <Text style={[styles.titleText, themeStyles.textColor]}>{selectedBibleBook}</Text> */}

                <TouchableOpacity style={[styles.modalBTN, themeStyles.contentBg]} onPress={() => onClickPlay()}>
                    <FontAwesome5 style={[styles.swiperIcon, themeStyles.iconColor]} name="play" size={24} />
                    <Text style={[styles.optionText, themeStyles.textColor]}>Listen</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalBTN, themeStyles.contentBg]} onPress={() => onClickEdit()}>
                    {/* <FontAwesome5 style={[styles.swiperIcon, themeStyles.iconColor]} name="pen" size={24} /> */}
                    <Ionicons style={[styles.swiperIcon, themeStyles.iconColor]} name="settings" size={24} />
                    <Text style={[styles.optionText, themeStyles.textColor]}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalBTN, themeStyles.contentBg]} onPress={() => copyToClipboard()}>
                    <Ionicons style={[styles.swiperIcon, themeStyles.iconColor]} name="copy" size={24} />
                    <Text style={[styles.optionText, themeStyles.textColor]}>Copy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalBTN, themeStyles.contentBg]} onPress={() => onShare()}>
                    <Ionicons style={[styles.swiperIcon, themeStyles.iconColor]} name="share-social" size={24} />
                    <Text style={[styles.optionText, themeStyles.textColor]}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalBTN, themeStyles.contentBg]} onPress={() => onClickDelete()}>
                    <FontAwesome5 style={styles.swiperIcon} name="trash" size={24} color={'#de2341'} />
                    <Text style={[styles.optionText, themeStyles.textColor]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </BottomSheetModal>
    )
});

export default PlaylistOptionsBottomSheet;


const styles = StyleSheet.create({
    titleText: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingLeft: 7,
        marginBottom: 16
    },
    swiperIcon: {
        paddingHorizontal: 12
    },
    modalBTN: {
        padding: 16,
        flexDirection: 'row',
        gap: 10,
        margin: 5,
        backgroundColor: '#fff',
        borderRadius: 10
    },
    optionText: {
        fontSize: 24
    }
});
  