import { ScrollView, SafeAreaView, StyleSheet, Text, View, 
  TouchableOpacity
} from 'react-native';
import { Link, router } from 'expo-router';
import { StatusBar } from "expo-status-bar";

import { Ionicons } from '@expo/vector-icons';

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import Colors from "@/constants/Colors";

export default function Versions() {
  const settings = useSelector((state: RootState) => state.settings);

  const onSelectVersion = () => {
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
  });


  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

      <ScrollView>
        <View style={styles.container}>

          <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} onPress={() => onSelectVersion()}>
            <View style={{flexDirection:'row', alignContent: 'center', flexGrow: 1}}>
              <Ionicons name="radio-button-on" size={24} style={themeStyles.iconColor} />

              <View style={{paddingLeft: 16}}>
                <Text style={[{fontSize: 18}, themeStyles.textColor]}>KJV</Text>
                <Text style={[{color: 'gray'}]}>King James Version</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons style={styles.forwardIcon} name="chevron-forward" size={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} disabled>
            <View style={{flexDirection:'row', alignContent: 'center', flexGrow: 1}}>
              <Ionicons name="radio-button-off" size={24} color={'gray'} />

              <View style={{paddingLeft: 16}}>
                <Text style={[{fontSize: 18}, themeStyles.textColor]}>NKJV</Text>
                <Text style={[{color: 'gray'}]}>New King James Version</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ textTransform: 'capitalize', color: 'gray'}}>
                Coming Soon
              </Text>
              {/* <Ionicons style={styles.forwardIcon} name="chevron-forward" size={20} /> */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} disabled>
            <View style={{flexDirection:'row', alignContent: 'center', flexGrow: 1}}>
              <Ionicons name="radio-button-off" size={24} color={'gray'} />

              <View style={{paddingLeft: 16}}>
                <Text style={[{fontSize: 18}, themeStyles.textColor]}>NIV</Text>
                <Text style={[{color: 'gray'}]}>New International Version</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ textTransform: 'capitalize', color: 'gray'}}>
                Coming Soon
              </Text>
              {/* <Ionicons style={styles.forwardIcon} name="chevron-forward" size={20} /> */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} disabled>
            <View style={{flexDirection:'row', alignContent: 'center', flexGrow: 1}}>
              <Ionicons name="radio-button-off" size={24} color={'gray'} />

              <View style={{paddingLeft: 16}}>
                <Text style={[{fontSize: 18}, themeStyles.textColor]}>ESV</Text>
                <Text style={[{color: 'gray'}]}>English Standard Version</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ textTransform: 'capitalize', color: 'gray'}}>
                Coming Soon
              </Text>
              {/* <Ionicons style={styles.forwardIcon} name="chevron-forward" size={20} /> */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} disabled>
            <View style={{flexDirection:'row', alignContent: 'center', flexGrow: 1}}>
              <Ionicons name="radio-button-off" size={24} color={'gray'} />

              <View style={{paddingLeft: 16}}>
                <Text style={[{fontSize: 18}, themeStyles.textColor]}>ASV</Text>
                <Text style={[{color: 'gray'}]}>American Standard Version</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ textTransform: 'capitalize', color: 'gray'}}>
                Coming Soon
              </Text>
              {/* <Ionicons style={styles.forwardIcon} name="chevron-forward" size={20} /> */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.listContainer, themeStyles.contentBg]} disabled>
            <View style={{flexDirection:'row', alignContent: 'center', flexGrow: 1}}>
              <Ionicons name="radio-button-off" size={24} color={'gray'} />

              <View style={{paddingLeft: 16}}>
                <Text style={[{fontSize: 18}, themeStyles.textColor]}>NLT</Text>
                <Text style={[{color: 'gray'}]}>New Living Translation</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ textTransform: 'capitalize', color: 'gray'}}>
                Coming Soon
              </Text>
              {/* <Ionicons style={styles.forwardIcon} name="chevron-forward" size={20} /> */}
            </View>
          </TouchableOpacity>

        </View>
      </ScrollView>
      
    </SafeAreaView>
  )
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
    borderRadius: 7
  },
  forwardIcon: {
    color: 'gray'
  }
});
