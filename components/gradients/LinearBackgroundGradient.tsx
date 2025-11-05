import { LinearGradient } from 'expo-linear-gradient';
import { ReactNode } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
import { useThemeColors } from '../../store/theme-context';

interface LinearGradientBackgroundProps {
  children?: ReactNode;
  containerStyles?: StyleProp<ViewStyle>;
  color1?: string;
  color2?: string;
}
export default function LinearGradientBackground({
  children,
  containerStyles,
  color1,
  color2,
}: LinearGradientBackgroundProps) {
  const colors = useThemeColors();

  return (
    <LinearGradient
      colors={[color2 ? color2 : colors.buttonNormal2, color1 ? color1 : colors.buttonNormal1]}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={[{ flex: 1 }, containerStyles]}
    >
      {children}
    </LinearGradient>
  );
}
