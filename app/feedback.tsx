import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useSelector } from 'react-redux';
import { RootState } from '@/state/store';

import Colors from '@/constants/Colors';
import Toast from 'react-native-root-toast';


export default function feedback() {
    const settings = useSelector((state: RootState) => state.settings);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const onSubmitFeedbackForm = () => {


        const msg = ``;
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
        playlistTitleInput: {
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.contentBackground : Colors.light.contentBackground,
            borderColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff",
            // fontSize: settings.fontSize
        },
        inputContainer: {
            borderColor: settings.colorTheme == 'dark' ? "#f6f3ea43" : "#fff",
        },
        textSearchVerse: {
            textAlign: 'justify',
            color: settings.colorTheme == 'dark' ? Colors.dark.text : Colors.light.text,
            fontSize: settings.fontSize + 5
        },
        headerBackground: {
            backgroundColor: settings.colorTheme == 'dark' ? Colors.dark.headerBackground : Colors.light.headerBackground
        },
    });
    
    

    return (
        <SafeAreaView style={{flex: 1}}>
            <StatusBar style={settings.colorTheme == 'dark' ? 'light' : 'dark'} backgroundColor={Colors.primary} />

            <View style={{marginBottom: 20}}>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    color: themeStyles.textColor.color,
                    
                }}>Please help us get better!</Text>
            </View>

            <View style={{paddingHorizontal: 16, marginTop: 10, flex: 1}}>
                <View style={[styles.inputContainer, themeStyles.inputContainer]}>
                    <Text style={[themeStyles.textColor, {fontSize: 24, marginBottom: 10}]}>
                        <Text>Full Name(s) </Text>
                        <Text style={{color: '#de2341'}}> *</Text>
                    </Text>

                    <TextInput
                        style={[styles.playlistTitleInput, themeStyles.playlistTitleInput]}
                        onChangeText={setName}
                        value={name}
                        selectionColor={themeStyles.textColor.color}
                        placeholder="What name should we call you..."
                        placeholderTextColor={'gray'}
                        keyboardType="default"
                        returnKeyType="next"
                        // blurOnSubmit={true}
                        inputMode="text"
                        enterKeyHint="next"
                        // autoFocus={true}
                    />
                </View>

                <View style={[styles.inputContainer, themeStyles.inputContainer, {marginTop: 25}]}>
                    <Text style={[themeStyles.textColor, {fontSize: 24, marginBottom: 10}]}>
                        <Text>Email</Text>
                        <Text style={{color: '#de2341'}}> *</Text>
                    </Text>

                    <TextInput
                        style={[styles.playlistTitleInput, themeStyles.playlistTitleInput]}
                        onChangeText={setEmail}
                        value={email}
                        selectionColor={themeStyles.textColor.color}
                        placeholder="Enter your valid email address"
                        placeholderTextColor={'gray'}
                        keyboardType="email-address"
                        returnKeyType="next"
                        // blurOnSubmit={true}
                        inputMode="email"
                        enterKeyHint="next"
                    />
                </View>

                <View style={[styles.inputContainer, themeStyles.inputContainer, {marginTop: 25}]}>
                    <Text style={[themeStyles.textColor, {fontSize: 24, marginBottom: 10}]}>
                        <Text>Message</Text>
                        <Text style={{color: '#de2341'}}> *</Text>
                    </Text>

                    <TextInput
                        style={[styles.playlistDescriptionInput, themeStyles.playlistTitleInput]}
                        onChangeText={setMessage}
                        value={message}
                        selectionColor={themeStyles.textColor.color}
                        multiline={true}
                        editable={true}
                        // numberOfLines={5}
                        placeholder="Please be as apecific as possible so we can better help you."
                        placeholderTextColor={'gray'}
                        keyboardType="default"
                        returnKeyType="done"
                        // blurOnSubmit={true}
                        inputMode="text"
                        enterKeyHint="done"
                    />
                </View>

                <View style={{marginTop: 'auto', marginBottom: 20}}>
                    <TouchableOpacity
                        onPress={() => { onSubmitFeedbackForm(); }}
                        disabled={name && email && message ? false : true}
                        style={[styles.btnContainer, { backgroundColor: name && email && message ? Colors.primary : Colors.primaryDark }]}
                    >
                        <Text style={[themeStyles.textColor, styles.btnText, { color: name && email && message ? themeStyles.textColor.color : 'gray' } ]}>
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}


const styles = StyleSheet.create({
    playlistTitleInput: {
      // height: 40,
      // margin: 16,
      borderWidth: 0.4,
      borderRadius: 5,
      // borderColor: 'gray',
      padding: 10,
      fontSize: 16,
      flexGrow: 1,
    },
    playlistDescriptionInput: {
      // flexGrow: 1,
      borderWidth: 0.4,
      borderRadius: 5,
      // borderColor: 'gray',
      // maxHeight: 150,
      // backgroundColor: '#fff',
      height: 150,
      fontSize: 16,
      padding: 10
    },
    inputContainer: {
      // flexDirection: 'row',
      // padding: 16,
      borderBottomWidth: 1,
    },
    btnContainer: {
      padding: 7,
      borderRadius: 5,
    },
    btnText: {
      fontSize: 20,
      textAlign: 'center',
      textTransform: 'uppercase'
    }
  });
  
  