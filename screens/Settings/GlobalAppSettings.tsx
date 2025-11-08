import { useContext, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SwitchButton } from '../../components/buttons/SwitchButton';
import LinearGradientBackground from '../../components/gradients/LinearBackgroundGradient';
import useTextForActiveLanguage from '../../hooks/useTextForActiveLanguage';
import { useBoutique } from '../../store/app-context';
import { AuthContext } from '../../store/auth-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { ProductImageTypes } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import CustomText from '../../util-components/CustomText';
import { handleFetchingWithFormData } from '../../util-methods/FetchMethods';
import { betterErrorLog } from '../../util-methods/LogMethods';
import { updateNestedValue } from '../../util-methods/UpdateNestedValue';
import SetAppIcon from './globalAppSettingsComponents/SetAppIcon';

function GlobalAppSettings() {
  const boutique = useBoutique();
  const auth = useContext(AuthContext);
  const [appIcon, setAppIcon] = useState<ProductImageTypes | null>({
    uri: boutique.data?.settings?.appIcon?.appIconUri,
    fileName: boutique.data?.settings?.appIcon?.appIconName,
  });
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const text = useTextForActiveLanguage('globalSettings');

  async function handleUpdateAppSettings() {
    try {
      const formData = new FormData();
      if (appIcon) {
        formData.append('appIcon', {
          uri: appIcon.uri,
          type: appIcon.mimeType || 'image/jpeg',
          name: appIcon.fileName || 'icon_image.jpg',
        } as any);
      }
      formData.append('settings', JSON.stringify(boutique.data.settings));

      if (auth.token) {
        await handleFetchingWithFormData(formData, auth.token, `app/update-global-settings`, 'POST');
      }
    } catch (error) {
      betterErrorLog('> Error while updating app settings', error);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <LinearGradientBackground
          containerStyles={{ padding: 18, borderRadius: 4 }}
          color1={colors.cardBackground1}
          color2={colors.cardBackground2}
        >
          {/* UPLOAD APP ICON */}
          <CustomText variant="bold" style={[styles.h1, { marginTop: 0 }]}>
            {text.app_icon}
          </CustomText>
          <View style={styles.sectionOutline}>
            <CustomText style={styles.text}>{text.app_icon_description}</CustomText>
            <SetAppIcon appIcon={appIcon} setAppIcon={setAppIcon} />
          </View>

          {/* ORDER SETTINGS */}
          <CustomText variant="bold" style={[styles.h1, { marginTop: 16 }]}>
            Porudžbine
          </CustomText>
          <View style={[styles.sectionOutline, { paddingBottom: 8, paddingTop: 8 }]}>
            <SwitchButton
              value={boutique.data.settings.orders.requireBuyerImage}
              text="• Obavezna slika kupčevog profila?"
              onChange={() =>
                boutique.setAppData((prev) =>
                  updateNestedValue(prev, 'settings.orders.requireBuyerImage', !prev.settings.orders.requireBuyerImage)
                )
              }
            />
          </View>

          <Button
            containerStyles={styles.saveButton}
            onPress={handleUpdateAppSettings}
            textStyles={styles.saveButtonText}
            backColor={colors.buttonHighlight1}
            backColor1={colors.buttonHighlight2}
          >
            Sačuvaj
          </Button>
        </LinearGradientBackground>
      </View>
    </ScrollView>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      position: 'relative',
      backgroundColor: colors.background2,
    },
    card: {
      borderRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      margin: 10,
      padding: 0.5,
      borderTopColor: colors.borderColorHighlight,
      marginBottom: 70,
    },
    h1: {
      fontSize: 16,
      marginBottom: 8,
      marginTop: 16,
      color: colors.highlightText,
      borderBottomWidth: 1,
      borderBottomColor: colors.secondaryLight,
    },
    h2: {
      color: colors.defaultText,
    },
    text: {
      fontSize: 14,
      color: colors.defaultText,
    },
    sectionOutline: {
      borderColor: colors.secondaryLight,
      borderRadius: 10,
    },
    dropdown: {
      backgroundColor: colors.buttonBackground,
      marginTop: 10,
      elevation: 1,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      borderWidth: 0.5,
      borderColor: colors.secondaryLight,
    },
    dropdownText: {
      color: colors.defaultText,
    },
    saveButton: {
      marginTop: 10,
    },
    saveButtonText: {
      color: colors.white,
    },
  });
}

export default GlobalAppSettings;
