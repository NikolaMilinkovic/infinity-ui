import { Animated, StyleSheet } from 'react-native';
import AddProduct from '../../../components/products/AddProduct';
import KeyboardAvoidingWrapper from '../../../util-components/KeyboardAvoidingWrapper';

function AddItem() {
  // ANIMATIONS

  return (
    <KeyboardAvoidingWrapper>
      <Animated.View style={styles.container}>
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
