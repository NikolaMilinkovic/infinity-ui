import { Pressable, StyleSheet, Text, View } from 'react-native';
interface ButtonTypes {
  children?: any,
  onPress?: any,
  textColor?: string,
  backColor?: string
}

function Button({ children, onPress, textColor, backColor } :ButtonTypes) {


  const styles = getStyles(textColor, backColor)

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default Button;

function getStyles(
  textColor = 'black', 
  backColor = 'white'
){
  return(
    StyleSheet.create({
      button: {
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: backColor,
        elevation: 2,
        shadowColor: backColor,
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: '100%',
      },
      pressed: {
        opacity: 0.7,
      },
      buttonText: {
        textAlign: 'center',
        color: textColor,
        fontSize: 16,
        fontWeight: 'bold'
      },
    })
  )
}