// transitions-context.tsx
import { createContext, ReactNode, useContext, useState } from 'react';
import { Animated, Dimensions, Easing, Image, StyleSheet } from 'react-native';
import { ThemeColors, useTheme } from './theme-context';

interface TransitionsContextType {
  triggerTransition: (theme: 'light' | 'dark', duration?: number) => void;
}

const TransitionsContext = createContext<TransitionsContextType>({
  triggerTransition: () => {},
});

export const useTransitions = () => useContext(TransitionsContext);

export const TransitionsProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [animValue] = useState(new Animated.Value(0));
  const themeContext = useTheme();
  const colors = themeContext.colors;
  const styles = getStyles(colors);

  const triggerTransition = (targetTheme: 'light' | 'dark', duration = 3000) => {
    setTheme(targetTheme);
    setVisible(true);
    animValue.setValue(0);

    Animated.timing(animValue, {
      toValue: 1,
      duration,
      easing: Easing.inOut(Easing.linear),
      useNativeDriver: false,
    }).start(() => {
      setVisible(false);
    });
  };

  const backgroundColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange:
      theme === 'light'
        ? ['#000000', '#ffffff'] // dark → light
        : ['#ffffff', '#000000'], // light → dark
  });

  const opacity = animValue.interpolate({
    inputRange: [0, 0.05, 0.95, 1],
    outputRange: [0, 1, 1, 0],
  });

  const { width, height } = Dimensions.get('window');

  return (
    <TransitionsContext.Provider value={{ triggerTransition }}>
      {children}
      {visible && (
        <Animated.View pointerEvents="auto" style={[styles.overlay, { backgroundColor, opacity, width, height }]}>
          {themeContext.theme === 'light' && <Image source={require('../assets/infinity.png')} style={styles.image} />}
          {themeContext.theme === 'dark' && (
            <Image source={require('../assets/infinity-white.png')} style={styles.image} />
          )}
        </Animated.View>
      )}
    </TransitionsContext.Provider>
  );
};

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 9999,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 40,
    },
    image: {
      maxHeight: 140,
      aspectRatio: 16 / 9,
      resizeMode: 'contain',
      marginBottom: 24,
    },
  });
}
