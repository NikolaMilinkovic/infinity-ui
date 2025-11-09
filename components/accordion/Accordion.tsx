import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalStyles } from '../../constants/globalStyles';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import CustomText from '../../util-components/CustomText';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  initiallyExpanded?: boolean;
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  containerStyle,
  titleStyle,
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
      <Pressable onPress={toggle} style={({ pressed }) => [styles.headerContainer, pressed && { opacity: 0.6 }]}>
        <CustomText variant="bold" style={[styles.header, titleStyle]}>
          {title}
        </CustomText>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={26}
          color={colors.defaultText}
          style={styles.icon}
        />
      </Pressable>

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
      backgroundColor: colors.buttonNormal1,
      borderRadius: 6,
      paddingHorizontal: 10,
      padding: 1,
    },
    headerContainer: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      borderBottomColor: colors.secondaryLight,
      borderBottomWidth: 0.5,
    },
    header: {
      fontSize: 16,
      color: colors.highlightText,
      flex: 1,
      textAlign: 'center',
    },
    icon: {
      flex: 0,
    },
  });
}

export default Accordion;
