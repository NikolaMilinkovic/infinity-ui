import { StyleProp, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import RadioButton, { RadioButtonProps } from './RadioButton';

type RadioGroupProps = {
  accessibilityLabel?: string;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  layout?: 'row' | 'column';
  onPress?: (selectedId: string) => void;
  radioButtons: RadioButtonProps[];
  selectedId?: string;
  testID?: string;
  color: string;
  background: string;
  highlight: string;
  borderColor: string;
};
export default function CustomRadioGroup({
  accessibilityLabel,
  containerStyle,
  labelStyle,
  layout = 'column',
  onPress,
  radioButtons,
  selectedId,
  testID,
  color,
  background,
  highlight,
  borderColor,
}: RadioGroupProps) {
  function handlePress(id: string) {
    if (id !== selectedId) {
      if (onPress) {
        onPress(id);
      }
      const button = radioButtons.find((rb) => rb.id === id);
      if (button?.onPress) {
        button.onPress(id);
      }
    }
  }

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="radiogroup"
      style={[styles.container, { flexDirection: layout }, containerStyle]}
      testID={testID}
    >
      {radioButtons.map((button) => (
        <RadioButton
          {...button}
          key={button.id}
          selected={button.id === selectedId}
          onPress={handlePress}
          color={color}
          background={background}
          highlight={highlight}
          borderColor={borderColor}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
});
