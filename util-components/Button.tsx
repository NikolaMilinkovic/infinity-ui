import { Pressable, StyleSheet, Text, View } from 'react-native';
import { globalStyles } from '../constants/globalStyles';
interface ButtonTypes {
  children?: any;
  onPress?: any;
  textColor?: string;
  backColor?: string;
  containerStyles?: {};
  textStyles?: {};
}

function Button({ children, onPress, textColor, backColor, containerStyles, textStyles }: ButtonTypes) {
  const styles = getStyles(textColor, backColor);

  return (
    <Pressable
      style={({ pressed }) => [globalStyles.elevation_1, styles.button, pressed && styles.pressed, containerStyles]}
      onPress={onPress}
    >
      <View>
        <Text style={[styles.buttonText, textStyles]}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default Button;

function getStyles(textColor = 'black', backColor = 'white') {
  return StyleSheet.create({
    button: {
      borderRadius: 4,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: backColor,
      width: '100%',
    },
    pressed: {
      opacity: 0.7,
    },
    buttonText: {
      textAlign: 'center',
      justifyContent: 'center',
      color: textColor,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
}
