# Bible Alert

Complete offline bible with scheduled reminders to read or listen to the Bible

# Bible Alert React Native Expo App

Bible Alert is a ...

# Installation

Atfer git cloning run

```bash
npm install
```

to install all needed dependencies ensure you have installed node and react native globally.

# Testing or development

To test/run the application use

```bash
npm start
```

then follow the instruction after.

::: To open IOS Simulator

```bash
open -a Simulator
```

## Getting Started with Expo

first go to expo website and register, you'll need the email and password to login via terminal.

````link
expo.io


Now install the expo command line globally then login using this command
```link
    sudo npm install -g eas-cli && eas login
````

EAS login details:::::
username => etomeni
password => usze9Mm?k8fyM6&

## Generate test apk for android

````
then login to this account in the terminal before running this command to build the apk

```bash
eas build -p android --profile androidapk
````

## Generate test ipa achieve for ios simulator ONLY

```bash
eas build -p ios --profile simulatorbuild
```

## Deploy Apps to thier stores

First run this commands for iOS

```bash
eas build -p ios
```

Then this for android

```bash
eas build -p android
```

## iOS APP SUBMISSION

To submit the binary to the App Store, run

```bash
    eas submit -p ios --latest
```

from inside your project directory.

## android .abb Build for Store Submission

```bash
    eas build --platform android
```
