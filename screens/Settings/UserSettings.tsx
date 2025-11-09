import { ScrollView, StyleSheet, View } from 'react-native';
import LinearGradientBackground from '../../components/gradients/LinearBackgroundGradient';
import useAuthToken from '../../hooks/useAuthToken';
import useTextForActiveLanguage from '../../hooks/useTextForActiveLanguage';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { useUser } from '../../store/user-context';
import { User } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import CustomText from '../../util-components/CustomText';
import { popupMessage } from '../../util-components/PopupMessage';
import { handleFetchingWithBodyData } from '../../util-methods/FetchMethods';
import CheckForUpdates from './userSettingsComponents/CheckForUpdates';
import CouriersSettings from './userSettingsComponents/CouriersSettings';
import KeyboardSettings from './userSettingsComponents/KeyboardSettings';
import ListProductsByDropdown from './userSettingsComponents/ListProductsByDropdown';
import ThemeSelector from './userSettingsComponents/ThemeSelector';

function UserSettings() {
  const authToken = useAuthToken();
  const { user, setUser } = useUser();
  const text = useTextForActiveLanguage('settings');
  const colors = useThemeColors();
  const styles = getStyles(colors);

  /**
   * @param field Attribute that we are updating in settings.defaults
   * @param value New value that we are assigning to the Attribute
   * @returns Void
   */
  async function updateDefault(field: string, value: any) {
    setUser((prevUser: User) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        settings: {
          ...prevUser.settings,
          defaults: {
            ...prevUser.settings?.defaults,
            [field]: value,
          },
        },
      };
    });
  }

  /**
   * @param field Attribute that we are updating in settings
   * @param value New value that we are assigning to the Attribute
   * @returns Void
   */
  async function updateUserSetting(field: string, value: any) {
    setUser((prevUser: User) => {
      if (!prevUser) return null;
      return {
        ...prevUser,
        settings: {
          ...prevUser.settings,
          [field]: value,
        },
      };
    });
  }

  /**
   * Sends the current user settings to the backend for updating
   */
  async function saveAndUpdateUserSettings() {
    if (!authToken) return;
    const response = await handleFetchingWithBodyData(
      { settings: user?.settings },
      authToken,
      'user/update-user-settings',
      'POST'
    );
    if (!response) return;
    if (response.status === 200) {
      const parsedResponse = await response.json();
      popupMessage(parsedResponse.message, 'success');
    } else {
      popupMessage('Došlo je do problema prilikom ažuriranja podešavanja', 'danger');
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <LinearGradientBackground
          containerStyles={{ padding: 18 }}
          color1={colors.cardBackground1}
          color2={colors.cardBackground2}
        >
          {/* UPDATES */}
          <CustomText style={[styles.h1, { marginTop: 0 }]} variant="bold">
            Ažuriranje | Updates:
          </CustomText>
          <View style={styles.sectionOutline}>
            <CheckForUpdates />
          </View>

          {/* LIST PRODUCTS BY */}
          <CustomText variant="bold" style={styles.h1}>
            {text.listProductsBy_header}
          </CustomText>
          <View style={styles.sectionOutline}>
            <ListProductsByDropdown updateDefault={updateDefault} />
          </View>

          {/* DEFAULT COURIER */}
          <CustomText variant="bold" style={styles.h1}>
            Kuriri
          </CustomText>
          <View style={styles.sectionOutline}>
            <CouriersSettings updateDefault={updateDefault} />
          </View>

          {/* THEME SELECTOR */}
          <CustomText variant="bold" style={[styles.h1]}>
            {text.theme_header}
          </CustomText>
          <View style={styles.sectionOutline}>
            <ThemeSelector updateDefault={updateDefault} />
          </View>

          {/* LANGUAGE SELECTOR */}
          {/* <Text style={[styles.h1, {marginBottom: 0}]}>{text.language_header}</Text>
        <View style={styles.sectionOutline}>
        <LanguageSelector updateUserSetting={updateUserSetting} />
        </View> */}

          {/* KEYBOARD SETTINGS */}
          <CustomText variant="bold" style={[styles.h1]}>
            Tastatura
          </CustomText>
          <View style={styles.sectionOutline}>
            <KeyboardSettings />
          </View>

          {/* SAVE BTN */}
          <Button
            containerStyles={styles.saveButton}
            onPress={saveAndUpdateUserSettings}
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
      backgroundColor: colors.cardBackground,
      borderColor: colors.borderColor,
      borderTopColor: colors.borderColorHighlight,
      borderRadius: 4,
      borderWidth: 1,
      margin: 10,
      padding: 1,
      marginBottom: 60,
    },
    h1: {
      fontSize: 16,
      marginBottom: 8,
      marginTop: 16,
      color: colors.highlightText,
      borderBottomWidth: 1.5,
      borderBottomColor: colors.secondaryLight,
    },
    h2: {
      color: colors.defaultText,
    },
    text: {
      fontSize: 16,
      color: colors.defaultText,
    },
    sectionOutline: {
      paddingTop: 0,
      borderColor: colors.secondaryLight,
      borderRadius: 10,
    },
    dropdown: {
      backgroundColor: '#ffffff',
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
      color: colors.whiteText,
    },
  });
}

export default UserSettings;
