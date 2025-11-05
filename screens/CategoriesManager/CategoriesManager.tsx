import { Animated, StyleSheet } from 'react-native';
import AddCategories from '../../components/categories/AddCategories';
import EditCategories from '../../components/categories/EditCategories';
import SafeView from '../../components/layout/SafeView';
import { useFadeAnimation } from '../../hooks/useFadeAnimation';

function CategoriesManager() {
  // Fade in animation
  const fadeAnimation = useFadeAnimation();

  return (
    <SafeView>
      <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
        <AddCategories />
        <EditCategories />
      </Animated.View>
    </SafeView>
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

export default CategoriesManager;
