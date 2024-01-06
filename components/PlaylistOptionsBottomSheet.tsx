import { forwardRef, useCallback, useEffect, useMemo, useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet'
import Toast from 'react-native-root-toast';

import { FontAwesome5 } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons';

import Colors from '@/constants/Colors';
import { AppDispatch, RootState } from '@/state/store';
import { useDispatch, useSelector } from 'react-redux';
import { initializeTemptPlaylist } from '@/state/slices/temptDataSlice';
import { deletePlaylist } from '@/state/slices/playlistSlice';
import { copyBibleVerseToClipboard, shareBibleVerse } from '@/constants/bibleResource';


export type Ref = BottomSheetModal;
const PlaylistOptionsBottomSheet = forwardRef<Ref>((props, ref) => {

    // const snapPoints = useMemo(() => ['25%', '50%', '75%'], []);
    const snapPoints = useMemo(() => ['40%'], []);
    const renderBackdrop = useCallback((props: any) => 
        <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} { ...props } />
    ,[]);
    const { dismiss } = useBottomSheetModal();

    const [sharedText, setSharedText] = useState('');

    const settings = useSelector((state: RootState) => state.settings);
    const temptPlaylist = useSelector((state: RootState) => state.temptData.temptPlaylist);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        let textt = temptPlaylist.title + "\n\n";
        temptPlaylist.lists.every((verse) => {
            textt = textt + ` ${verse.book_name} ${ verse.chapter }:${ verse.verse }\n`;
        })
        textt = textt + "\n\n--Bible Alert";

        setSharedText(textt);
    }, [temptPlaylist]);


    const onShare = () => {
        shareBibleVerse(sharedText, '').then((res: boolean) => {
            if (res) {
                dismiss();
            }
        })
    }

    const copyToClipboard = () => {
        copyBibleVerseToClipboard(sharedText);
        dismiss();
    };

    const onClickDelete = () => {
        dispatch(deletePlaylist(temptPlaylist));
        const msg = `${ temptPlaylist.title } removed from playlist`;

        let toast = Toast.show(msg, {
            duration: Toast.durations.LONG,
            position: Toast.positions.BOTTOM,
            shadow: true,
            animation: true,
            // hideOnPress: true,
            delay: 0,
        });

        dispatch(initializeTemptPlaylist(""));
        dismiss();
    }

    const onClickEdit = () => {
        // dispatch(setTemptPlaylistData(temptPlaylist));
        router.push("/playlist/EditPlaylist");
        dismiss();
    }

    const themeStyles = StyleSheet.create({
        textColor: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        },
        background: {
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.background : Colors.light.background
        },
        iconColor: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.primary,
        },
        contentBg: {
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground
        },
        BSbackground: {
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.BottomSheetBackground : Colors.light.BottomSheetBackground
        },
    });

    return (
        <BottomSheetModal ref={ref} snapPoints={snapPoints} 
            overDragResistanceFactor={0}
            backgroundStyle={{
                backgroundColor: themeStyles.BSbackground.backgroundColor,
            }}
            handleIndicatorStyle={{ display: 'none' }}
            backdropComponent={renderBackdrop}
        >
            <View style={{ paddingHorizontal: 5 }}>
                <TouchableOpacity style={[styles.modalBTN, themeStyles.contentBg]} onPress={() => onClickEdit()}>
                    <Ionicons style={[styles.swiperIcon, themeStyles.iconColor]} name="settings" size={20} />
                    <Text style={[styles.optionText, themeStyles.textColor]}>Edit</Text>
                </TouchableOpacity>


              <TouchableOpacity style={[styles.modalBTN, themeStyles.contentBg]} onPress={()=> { router.push('/playlist/SchedulePlaylist'); dismiss();}}>
                <Ionicons name="timer-outline" size={20} style={[styles.swiperIcon, themeStyles.iconColor]} />
                <Text style={[styles.optionText, themeStyles.textColor]}>Schedule</Text>
              </TouchableOpacity>


                <TouchableOpacity style={[styles.modalBTN, themeStyles.contentBg]} onPress={() => copyToClipboard()}>
                    <Ionicons style={[styles.swiperIcon, themeStyles.iconColor]} name="copy" size={20} />
                    <Text style={[styles.optionText, themeStyles.textColor]}>Copy</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalBTN, themeStyles.contentBg]} onPress={() => onShare()}>
                    <Ionicons style={[styles.swiperIcon, themeStyles.iconColor]} name="share-social" size={20} />
                    <Text style={[styles.optionText, themeStyles.textColor]}>Share</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.modalBTN, themeStyles.contentBg]} onPress={() => onClickDelete()}>
                    <FontAwesome5 style={styles.swiperIcon} name="trash" size={20} color={'#de2341'} />
                    <Text style={[styles.optionText, themeStyles.textColor]}>Delete</Text>
                </TouchableOpacity>
            </View>
        </BottomSheetModal>
    )
});

export default PlaylistOptionsBottomSheet;

const styles = StyleSheet.create({
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
        fontSize: 20
    }
});
  