// ConfirmationModal.js
import { Animated, Image, Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { ThemeColors, useTheme, useThemeColors } from '../store/theme-context';
import Button from './Button';
import CustomText from './CustomText';

interface ConfirmModalTypes {
  isVisible: boolean;
  onConfirm: () => void;
  onConfirmBtnText?: string;
  onCancel: () => void;
  onCancelBtnText?: string;
  message: string;
}

function ConfirmationModal({
  isVisible,
  onConfirm,
  onConfirmBtnText = 'Nastavi',
  onCancel,
  onCancelBtnText = 'Odustani',
  message,
}: ConfirmModalTypes) {
  const colors = useThemeColors();
  const themeContext = useTheme();
  const styles = getStyles(colors);
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              {/* IMAGE */}

              {/* ISSUE - Ikona aplikacije treba biti bele boje, modal je isto bele boje te se ne vidi slika */}
              {/* <Image
                source={{ uri: boutique.data.settings.appIcon.appIconUri }}
                resizeMode="contain"
                style={styles.image}
              /> */}
              {themeContext.theme === 'dark' && (
                <Image source={require('../assets/infinity-white.png')} resizeMode="contain" style={styles.image} />
              )}

              {themeContext.theme === 'light' && (
                <Image source={require('../assets/infinity.png')} resizeMode="contain" style={styles.image} />
              )}

              {/* TEXT */}
              <CustomText style={styles.modalText}>
                {message || 'Da li sigurno želiš da nastaviš dalje sa ovom akcijom?'}
              </CustomText>

              {/* BUTTONS */}
              <View style={styles.buttonContainer}>
                <Button
                  containerStyles={styles.button}
                  textStyles={styles.buttonText}
                  backColor={colors.buttonNormal1}
                  backColor1={colors.buttonNormal2}
                  textColor={colors.defaultText}
                  onPress={onCancel}
                >
                  {onCancelBtnText}
                </Button>
                <Button
                  containerStyles={styles.button}
                  textStyles={styles.buttonText}
                  backColor={colors.buttonNormal1}
                  backColor1={colors.buttonNormal2}
                  textColor={colors.defaultText}
                  onPress={onConfirm}
                >
                  {onConfirmBtnText}
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default ConfirmationModal;

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999,
    },
    modalContent: {
      width: 300,
      padding: 20,
      backgroundColor: colors.background,
      borderRadius: 10,
      alignItems: 'center',
      borderWidth: 0.5,
      borderColor: colors.borderColor,
    },
    image: {
      height: 80,
      marginBottom: 18,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
      color: colors.defaultText,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      maxWidth: '100%',
      gap: 10,
      alignItems: 'center',
    },
    button: {
      flex: 2,
      height: 42,
    },
    buttonText: {
      fontSize: 14,
      textAlign: 'center',
    },
    cancelButton: {
      backgroundColor: 'gray',
      padding: 5,
      borderRadius: 5,
    },
    cancelButtonText: {
      color: 'white',
      fontSize: 16,
    },
  });
}
