import React, { useRef, useState, useEffect } from 'react';
import { Animated,Text } from 'react-native';

const Disappearing = ({text}) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
    });
  }, []);

  if (!isVisible) {
    return null;
  }

  return <Animated.View style={{ opacity }}><Text>{text}</Text></Animated.View>;
};

export default Disappearing;
