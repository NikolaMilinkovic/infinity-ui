import React, { ReactNode } from 'react';
import { PixelRatio, Pressable, StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import CustomText from '../../util-components/CustomText';

export type RadioButtonProps = {
  accessibilityLabel?: string;
  borderSize?: number;
  containerStyle?: StyleProp<ViewStyle>;
  description?: ReactNode | string;
  descriptionStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  id: string;
  key?: string;
  label?: ReactNode | string;
  labelStyle?: StyleProp<TextStyle>;
  layout?: 'row' | 'column';
  onPress?: (id: string) => void;
  selected?: boolean;
  size?: number;
  testID?: string;
  value?: string;
  background: string;
  highlight: string;
  borderColor?: string;
  color?: string;
};

export default function RadioButton({
  accessibilityLabel,
  borderSize = 2,
  containerStyle,
  description,
  descriptionStyle,
  disabled = false,
  id,
  label,
  labelStyle,
  layout = 'row',
  onPress,
  selected = false,
  size = 24,
  testID,
  color,
  background,
  highlight,
  borderColor,
}: RadioButtonProps) {
  const styles = getStyles();
  const borderWidth = PixelRatio.roundToNearestPixel(borderSize);
  const sizeHalf = PixelRatio.roundToNearestPixel(size * 0.65);
  const sizeFull = PixelRatio.roundToNearestPixel(size);

  const orientation: ViewStyle = layout === 'column' ? { alignItems: 'center' } : { flexDirection: 'row' };
  const marginStyle: ViewStyle = layout === 'column' ? { marginTop: 10 } : { marginLeft: 10 };

  function handlePress() {
    onPress?.(id);
  }

  const labelComp = label ? (
    React.isValidElement(label) ? (
      label
    ) : (
      <CustomText style={[marginStyle, labelStyle, { color: color, alignSelf: 'center' }]}>{label}</CustomText>
    )
  ) : null;

  const descComp = description ? (
    React.isValidElement(description) ? (
      description
    ) : (
      <Text style={[marginStyle, { color: color }, descriptionStyle]}>{description}</Text>
    )
  ) : null;

  return (
    <>
      <Pressable
        accessibilityHint={typeof description === 'string' ? description : undefined}
        accessibilityLabel={accessibilityLabel || (typeof label === 'string' ? label : undefined)}
        accessibilityRole="radio"
        accessibilityState={{ checked: selected, disabled }}
        disabled={disabled}
        onPress={handlePress}
        style={[styles.container, orientation, { opacity: disabled ? 0.2 : 1 }, containerStyle]}
        testID={testID}
      >
        <View
          style={[
            styles.border,
            {
              borderColor: borderColor,
              borderWidth,
              width: sizeFull,
              height: sizeFull,
              borderRadius: sizeHalf,
              backgroundColor: background,
            },
          ]}
        >
          {selected && (
            <View
              style={{
                backgroundColor: highlight,
                width: sizeHalf,
                height: sizeHalf,
                borderRadius: sizeHalf,
              }}
            />
          )}
        </View>
        {labelComp}
      </Pressable>
      {descComp}
    </>
  );
}

function getStyles() {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      marginHorizontal: 10,
      marginVertical: 5,
    },
    border: {
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
}
