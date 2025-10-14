import { SafeAreaView } from 'react-native-safe-area-context';

export default function SafeView({ children, style }: any) {
  return (
    <SafeAreaView edges={['bottom']} style={[style, { flex: 1 }]}>
      {children}
    </SafeAreaView>
  );
}
