import { AntDesign, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import CustomText from '../../../util-components/CustomText';

interface ButtonChildrenTypes {
  onPress: () => void;
  icon: string | undefined;
  color: string | undefined;
  backgroundColor?: any;
  size: number | undefined;
  text: string | undefined;
  type: 'Ant' | 'Ionicons' | 'MaterialIcons' | 'MaterialCommunityIcons';
}
const NavigationButton: React.FC<ButtonChildrenTypes> = ({
  onPress,
  icon,
  color,
  size = 20,
  text,
  type = 'Ant',
  backgroundColor,
}) => {
  const colors = useThemeColors();
  const styles = getStyles(colors, size, color);
  let Icon: any;

  if (type === 'Ant') {
    Icon = <AntDesign name={icon} color={color} size={size + 6} />;
  }
  if (type === 'Ionicons') {
    Icon = <Ionicons name={icon} color={color} size={size + 6} />;
  }
  if (type === 'MaterialIcons') {
    Icon = <MaterialIcons name={icon} color={color} size={size + 6} />;
  }
  if (type === 'MaterialCommunityIcons') {
    Icon = <MaterialCommunityIcons name={icon} color={color} size={size + 6} />;
  }

  return (
    <Pressable
      key={backgroundColor}
      onPress={onPress}
      style={({ pressed }) => [styles.pressable, { backgroundColor: backgroundColor }, pressed && styles.pressed]}
      android_ripple={{ color: colors.secondaryLight }}
    >
      <View style={styles.container}>
        {Icon}
        <CustomText style={styles.text}>{text}</CustomText>
      </View>
    </Pressable>
  );
};

function getStyles(colors: ThemeColors, size: number | undefined, color: string | undefined) {
  return StyleSheet.create({
    pressable: {
      padding: 10,
      paddingLeft: 36,
      borderTopRightRadius: 8,
      borderBottomRightRadius: 8,
    },
    pressed: {
      opacity: Platform.OS === 'ios' ? 0.7 : 1,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      gap: 20,
    },
    text: {
      fontSize: size,
      color: color,
    },
  });
}

export default NavigationButton;
