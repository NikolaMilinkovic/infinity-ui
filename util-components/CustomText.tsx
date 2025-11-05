import React from 'react';
import { StyleProp, StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { useGlobalStyles } from '../constants/globalStyles';

type TextVariant = 'regular' | 'bold' | 'header';

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  color?: string;
  numberOfLines?: number;
  style?: StyleProp<TextStyle>;
}

const CustomText: React.FC<CustomTextProps> = ({
  children,
  variant = 'regular',
  color,
  numberOfLines,
  style,
  ...rest
}) => {
  const globalStyles = useGlobalStyles();
  let variantStyle = globalStyles.textRegular;
  if (variant === 'bold') variantStyle = globalStyles.textBold;
  else if (variant === 'header') variantStyle = globalStyles.header;

  // Merge style but keep our fontFamily intact
  const finalStyle: TextStyle = StyleSheet.flatten([variantStyle, color ? { color } : {}, style]);

  // Force our fontFamily from variant
  finalStyle.fontFamily = variantStyle.fontFamily;

  return (
    <Text style={finalStyle} numberOfLines={numberOfLines} ellipsizeMode="tail" {...rest}>
      {children}
    </Text>
  );
};

export default CustomText;
