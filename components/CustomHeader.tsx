import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButtonArrow from './BackButtonArrow';
import { useSelector } from 'react-redux';
import Colors from '@/constants/Colors';
import { RootState } from '@/state/store';


export default function CustomHeader(
    {headerTitleText} : {headerTitleText: string}
) {
    const settings = useSelector((state: RootState) => state.settings);

    const themeStyles = StyleSheet.create({
        textColor: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
        },
        headerBackground: {
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.headerBackground : Colors.light.headerBackground
        }
    });

    return (
        <SafeAreaView style={[themeStyles.headerBackground, styles.headerContainer]}>
            <BackButtonArrow />
            <Text style={[themeStyles.textColor, styles.headerTitle]}>
                { headerTitleText }
            </Text>
            <Text></Text>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    headerContainer: {
        // marginBottom: 16, 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: 16, 
    },
    headerTitle: {
        fontSize: 24,
        textTransform: 'uppercase'
        // fontWeight: 'bold'
    }
});
