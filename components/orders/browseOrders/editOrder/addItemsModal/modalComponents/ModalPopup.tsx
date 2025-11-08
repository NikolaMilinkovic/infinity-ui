import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { Colors } from '../../../../../../constants/colors';

interface ModalPopupProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'danger' | 'info' | 'warning';
  onHide?: () => void;
}

export default function ModalPopup({ visible, message, type = 'info', onHide }: ModalPopupProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.delay(1800),
        Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => onHide?.());
    }
  }, [visible]);

  if (!visible) return null;

  const bgColor =
    type === 'success'
      ? Colors.success
      : type === 'danger'
      ? Colors.error
      : type === 'warning'
      ? Colors.warning
      : Colors.info;

  return (
    <Animated.View style={[styles.container, { backgroundColor: bgColor, opacity }]}>
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    zIndex: 9999,
  },
  text: {
    color: Colors.whiteText,
    fontSize: 15,
  },
});
