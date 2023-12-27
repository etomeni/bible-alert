import { View, Text, SafeAreaView } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/state/store';
import Colors from '@/constants/Colors';


export default function ViewPlaylist() {
  const settings = useSelector((state: RootState) => state.settings);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

      <View>
        <Text>ViewPlaylist</Text>
      </View>
    </SafeAreaView>
  )
}