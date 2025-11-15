import { Platform, StyleSheet, Switch, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { useUser } from '../../../store/user-context';
import CustomText from '../../../util-components/CustomText';

function OrdersManagerSettings() {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const { user, updateUser, getUserValueForField } = useUser();

  async function toggleCroppingWhenAddingBuyerImage() {
    updateUser('enableCroppingForBuyerImage', !getUserValueForField('enableCroppingForBuyerImage', true));
  }
  async function toggleUseAspectRationWhenCroppingBuyerImage() {
    updateUser('useAspectRatioForBuyerImage', !getUserValueForField('useAspectRatioForBuyerImage', true));
  }

  return (
    <View style={styles.container}>
      {/* USE IMAGE CROPPING */}
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <CustomText style={[styles.text, { maxWidth: '100%' }]}>
          Sečenje slike prilikom dodavanja slike kupca?
        </CustomText>
        <Switch
          value={user?.settings?.ordersManager.enableCroppingForBuyerImage}
          onValueChange={toggleCroppingWhenAddingBuyerImage}
          trackColor={{ false: colors.grayText, true: colors.highlight }}
          thumbColor={colors.thumbColor}
          style={styles.switch}
        />
      </View>

      {/* USE RATIO? */}
      <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
        <CustomText style={[styles.text, { maxWidth: '100%' }]}>
          Koristi predefinisan aspect ratio za sečenje slike prilikom dodavanja slike kupca?
        </CustomText>
        <Switch
          value={user?.settings?.ordersManager.useAspectRatioForBuyerImage}
          onValueChange={toggleUseAspectRationWhenCroppingBuyerImage}
          trackColor={{ false: colors.grayText, true: colors.highlight }}
          thumbColor={colors.thumbColor}
          style={styles.switch}
        />
      </View>
    </View>
  );
}

export default OrdersManagerSettings;

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
