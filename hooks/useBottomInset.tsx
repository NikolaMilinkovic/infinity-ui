import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function useBottomInset() {
  const insets = useSafeAreaInsets();
  return insets.bottom;
}
