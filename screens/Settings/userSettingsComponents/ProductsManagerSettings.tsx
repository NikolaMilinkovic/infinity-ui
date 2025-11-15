import { Platform, StyleSheet, Switch, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { useUser } from '../../../store/user-context';
import CustomText from '../../../util-components/CustomText';
import ListProductsByDropdown from './ListProductsByDropdown';

function ProductsManagerSettings() {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const { user, updateUser, getUserValueForField } = useUser();

  async function toggleCroppingWhenAddingProductImage() {
    updateUser('enableCroppingForProductImage', !getUserValueForField('enableCroppingForProductImage', true));
  }
  async function toggleUseAspectRationWhenCroppingProductImage() {
    updateUser('useAspectRatioForProductImage', !getUserValueForField('useAspectRatioForProductImage', true));
  }
  return (
    <View style={styles.container}>
      {/* USE IMAGE CROPPING */}
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <CustomText style={[styles.text, { maxWidth: '100%' }]}>Sečenje slike prilikom dodavanja proizvoda?</CustomText>
        <Switch
          value={user?.settings?.productsManager.enableCroppingForProductImage}
          onValueChange={toggleCroppingWhenAddingProductImage}
          trackColor={{ false: colors.grayText, true: colors.highlight }}
          thumbColor={colors.thumbColor}
          style={styles.switch}
        />
      </View>

      {/* USE RATIO? */}
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <CustomText style={[styles.text, { maxWidth: '100%' }]}>
          Koristi predefinisan aspect ratio za sečenje slike prilikom dodavanja proizvoda?
        </CustomText>
        <Switch
          value={user?.settings?.productsManager.useAspectRatioForProductImage}
          onValueChange={toggleUseAspectRationWhenCroppingProductImage}
          trackColor={{ false: colors.grayText, true: colors.highlight }}
          thumbColor={colors.thumbColor}
          style={styles.switch}
        />
      </View>

      <ListProductsByDropdown />
    </View>
  );
}

export default ProductsManagerSettings;

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flexDirection: 'column',
    },
    text: {
      fontSize: 14,
      color: colors.secondaryText,
      flex: 2,
    },
    switch: {
      marginLeft: 'auto',
      transform: Platform.select({
        ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        android: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
      }),
    },
  });
}
