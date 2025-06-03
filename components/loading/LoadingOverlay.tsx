import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

interface LoadingOverlayTypes {
  message?: string;
}
function LoadingOverlay({ message }: LoadingOverlayTypes) {
  return (
    <View style={styles.rootContainer}>
      <Image source={require('../../assets/infinity.png')} style={styles.image} />
      <Text style={styles.message}>{message}</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default LoadingOverlay;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  message: {
    fontSize: 16,
    marginBottom: 12,
  },
  image: {
    maxHeight: 140,
    aspectRatio: 16 / 9,
    resizeMode: 'contain',
    marginBottom: 24,
  },
});
