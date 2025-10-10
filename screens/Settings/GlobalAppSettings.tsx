import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import SafeView from '../../components/layout/SafeView';
import SetAppIcon from '../../components/settings/SetAppIcon';
import { useGetAppColors } from '../../constants/useGetAppColors';
import useTextForActiveLanguage from '../../hooks/useTextForActiveLanguage';
import { useGetAppContexts } from '../../store/app-context';
import { AuthContext } from '../../store/auth-context';
import { AppColors, ProductImageTypes } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import { handleFetchingWithFormData } from '../../util-methods/FetchMethods';
import { betterErrorLog } from '../../util-methods/LogMethods';

function GlobalAppSettings() {
  const appCtx = useGetAppContexts();
  const auth = useContext(AuthContext);
  const [appSettings, setAppSettings] = useState(appCtx.appSettings);
  const [appIcon, setAppIcon] = useState<ProductImageTypes | null>(appCtx?.appSettings?.appIcon?.appIconUri);
  const styles = getStyles(useGetAppColors());
  const text = useTextForActiveLanguage('globalSettings');

  async function handleUpdateAppSettings() {
    try {
      const formData = new FormData();
      if (appIcon) {
        formData.append('appIcon', {
          uri: appIcon.uri,
          type: appIcon.mimeType || 'image/jpeg',
          name: appIcon.fileName || 'product_image.jpg',
        } as any);
      }

      if (auth.token) {
        await handleFetchingWithFormData(formData, auth.token, `app/update-global-settings`, 'POST');
      }
    } catch (error) {
      betterErrorLog('> Error while updating app settings', error);
    }
  }
  return (
    <SafeView>
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          {/* UPLOAD APP ICON */}
          <Text style={[styles.h1, { marginTop: 0 }]}>{text.app_icon}</Text>
          <View style={styles.sectionOutline}>
            <Text>{text.app_icon_description}</Text>
            <SetAppIcon appIcon={appIcon} setAppIcon={setAppIcon} />
          </View>

          <Button
            containerStyles={styles.saveButton}
            onPress={handleUpdateAppSettings}
            textStyles={styles.saveButtonText}
          >
            Sačuvaj
          </Button>
        </View>
      </ScrollView>
    </SafeView>
  );
}

function getStyles(Colors: AppColors) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      position: 'relative',
      backgroundColor: Colors.primaryLight,
    },
    card: {
      backgroundColor: Colors.white,
      padding: 10,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: Colors.secondaryLight,
      marginBottom: 16,
      margin: 10,
    },
    h1: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
      marginTop: 16,
      color: Colors.defaultText,
      borderBottomWidth: 1,
      borderBottomColor: Colors.secondaryLight,
    },
    h2: {
      color: Colors.defaultText,
    },
    text: {
      fontSize: 16,
      color: Colors.defaultText,
    },
    sectionOutline: {
      padding: 10,
      paddingTop: 0,
      borderColor: Colors.secondaryLight,
      borderRadius: 10,
      backgroundColor: Colors.white,
    },
    dropdown: {
      backgroundColor: Colors.buttonBackground,
      marginTop: 10,
      elevation: 1,
      shadowOffset: { width: 1, height: 1 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      borderWidth: 0.5,
      borderColor: Colors.secondaryLight,
    },
    dropdownText: {
      color: Colors.defaultText,
    },
    saveButton: {
      backgroundColor: Colors.highlight,
      marginTop: 10,
    },
    saveButtonText: {
      color: Colors.white,
    },
  });
}

export default GlobalAppSettings;
