import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

export default function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e: KeyboardEvent) => setKeyboardHeight(e.endCoordinates.height)
    );
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () =>
      setKeyboardHeight(0)
    );

    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  // iOS → return real height
  // Android → return 0 (let RN handle it)
  return Platform.OS === 'ios' ? keyboardHeight : 0;
}
