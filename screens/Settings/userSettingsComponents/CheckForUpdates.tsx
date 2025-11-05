import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { useBoutique } from '../../../store/app-context';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import Button from '../../../util-components/Button';
import CustomText from '../../../util-components/CustomText';

// Handles updates from Settings screen > Opens the remote link where user
// can download the new version of the app
function CheckForUpdates() {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const boutique = useBoutique();
  const [currentVersion] = useState(Constants?.expoConfig?.version);
  const buildLink =
    Platform.OS === 'android' ? boutique.versionData.buildLinkAndroid : boutique.versionData.buildLinkIOS;
  const [remoteVersion, setRemoteVersion] = useState('');

  useEffect(() => {
    setRemoteVersion(boutique?.versionData.version);
  }, [boutique?.versionData.version]);

  function handleOnUpdate() {
    Linking.openURL(buildLink);
  }

  return (
    <View>
      {currentVersion === remoteVersion && (
        <>
          <CustomText style={styles.text}>Aplikacija je već na najnovijoj verziji!</CustomText>
          <CustomText style={styles.text}>Trenutna verzija: {currentVersion}</CustomText>
        </>
      )}
      {remoteVersion && currentVersion !== remoteVersion && (
        <View>
          <CustomText style={styles.text}>Postoji nova verzija aplikacije!</CustomText>
          <CustomText style={styles.text}>Trenutna verzija: {currentVersion}</CustomText>
          <CustomText style={styles.text}>Nova verzija: {remoteVersion}</CustomText>
          <Button
            onPress={handleOnUpdate}
            containerStyles={styles.button}
            textStyles={styles.buttonText}
            backColor={colors.background}
            backColor1={colors.background1}
          >
            Ažuriraj aplikaciju
          </Button>
        </View>
      )}
      {!remoteVersion && (
        <View>
          <CustomText style={styles.text}>
            Došlo je do problema prilikom preuzivanja informacija o najnovijoj verziji.
          </CustomText>
          <CustomText style={styles.text}>Trenutna verzija: {currentVersion}</CustomText>
        </View>
      )}
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    text: {
      fontSize: 14,
      color: colors.defaultText,
    },
    button: {
      backgroundColor: colors.background,
      borderWidth: 0.5,
      borderTopWidth: 0.8,
      borderColor: colors.borderColor,
      borderTopColor: colors.borderColorHighlight,
      marginTop: 10,
    },
    buttonText: {
      color: colors.defaultText,
    },
  });
}

export default CheckForUpdates;
