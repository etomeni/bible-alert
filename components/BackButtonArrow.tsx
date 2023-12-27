import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';
import Colors from '@/constants/Colors';


export default function BackButtonArrow() {
    const navigation = useNavigation();
    const settings = useSelector((state: RootState) => state.settings);

    const themeStyles = StyleSheet.create({
        backButtonArrowIcon: {
            fontSize: 24,
            fontWeight: 'bold',
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        }
    });


    return (
        <TouchableOpacity onPress={() => { navigation.goBack() }}>
            <Ionicons name="arrow-back" size={24} style={themeStyles.backButtonArrowIcon} />
        </TouchableOpacity>
    )
}