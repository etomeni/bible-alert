import { useState, useEffect } from 'react';
import { Animated, StyleSheet, Text, Easing, View } from 'react-native';

const Loading = () => {
  const [scale, setScale] = useState(new Animated.Value(1));
  
  useEffect(() => {
      Animated.loop(
          Animated.sequence([
              Animated.timing(scale, {
                  toValue: 1.1,
                  duration: 1000,
                  useNativeDriver: true,
              }),
              Animated.timing(scale, {
                  toValue: 1,
                  duration: 1000,
                  useNativeDriver: true,
              }),
          ])
      ).start();
  }, []);

  
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
        <Animated.Image
          source={require('./../assets/images/icon.png')}
          style={[styles.logo, { transform: [{ scale }] }]}
        />
      </View>
    );
};

export default Loading;

const styles = StyleSheet.create({
  logo: {
      // Adjust size, alignment, and other styling as needed
      width: 100,
      height: 100,
      marginBottom: 30
  },
});
