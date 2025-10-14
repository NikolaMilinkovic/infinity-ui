import { Animated, StyleSheet } from 'react-native';
import AddProduct from '../../../components/products/AddProduct';
import { useFadeAnimation } from '../../../hooks/useFadeAnimation';
import KeyboardAvoidingWrapper from '../../../util-components/KeyboardAvoidingWrapper';

function AddItem() {
  // ANIMATIONS
  const fadeAnimation = useFadeAnimation();

  return (
    <KeyboardAvoidingWrapper>
      <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
        <AddProduct />
      </Animated.View>
    </KeyboardAvoidingWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tempText: {
    fontSize: 34,
  },
});

export default AddItem;
