import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import { useGlobalStyles } from '../../constants/globalStyles';
import { ThemeColors, useThemeColors } from '../../store/theme-context';

interface AccordionWithPassableHeaderProps {
  header: React.ReactNode;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  initiallyExpanded?: boolean;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const AccordionWithPassableHeader: React.FC<AccordionWithPassableHeaderProps> = ({
  header,
  children,
  containerStyle,
  isExpanded,
  setIsExpanded,
  initiallyExpanded = false,
}) => {
  const [contentHeight, setContentHeight] = useState(0);
  const animation = useRef(new Animated.Value(initiallyExpanded ? 1 : 0)).current;
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

  // Update interpolation whenever contentHeight changes
  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const opacityInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const toggle = () => setIsExpanded(!isExpanded);

  // Measure content whenever it changes
  const handleContentLayout = (e: any) => {
    const newHeight = e.nativeEvent.layout.height;
    if (newHeight !== contentHeight) {
      setContentHeight(newHeight);
    }
  };

  return (
    <View style={[styles.container, globalStyles.border, containerStyle]}>
      <Pressable onPress={toggle}>{header}</Pressable>

      {/* Hidden measurement view - always present to track height changes */}
      <View
        style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity: 0, zIndex: -1 }}
        onLayout={handleContentLayout}
        pointerEvents="none"
      >
        {children}
      </View>

      {/* Animated visible content */}
      <Animated.View style={{ height: heightInterpolate, overflow: 'hidden' }}>
        <Animated.View style={{ opacity: opacityInterpolate }}>{children}</Animated.View>
      </Animated.View>
    </View>
  );
};

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderRadius: 6,
    },
  });
}

export default AccordionWithPassableHeader;
