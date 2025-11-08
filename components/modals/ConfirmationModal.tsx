import React, { useState } from 'react';
import { ActivityIndicator, Image, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeColors, useTheme, useThemeColors } from '../../store/theme-context';
import Button from '../../util-components/Button';

interface ConfirmModalProps {
  isVisible: boolean;
  onConfirm: () => Promise<void> | void;
  onConfirmBtnText?: string;
  onCancel: () => void;
  onCancelBtnText?: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmModalProps> = ({
  isVisible,
  onConfirm,
  onConfirmBtnText = 'Nastavi',
  onCancel,
  onCancelBtnText = 'Odustani',
  message,
}) => {
  const [loading, setLoading] = useState(false);
  const themeContext = useTheme();
  const colors = useThemeColors();
  const styles = getStyles(colors);

  if (!isVisible) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, position: 'absolute' }}>
      <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onCancel}>
        <TouchableWithoutFeedback onPress={!loading ? onCancel : undefined}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.content}>
                {themeContext.theme === 'dark' && (
                  <Image
                    source={require('../../assets/infinity-white.png')}
                    resizeMode="contain"
                    style={styles.image}
                  />
                )}

                {themeContext.theme === 'light' && (
                  <Image source={require('../../assets/infinity.png')} resizeMode="contain" style={styles.image} />
                )}
                <Text style={styles.text}>{loading ? 'Molimo sačekajte...' : message}</Text>

                {loading && <ActivityIndicator size="small" color={colors.defaultText} style={{ marginBottom: 10 }} />}

                <View style={styles.buttonContainer}>
                  <Button
                    disabled={loading}
                    textStyles={{ fontSize: 14, color: colors.defaultText }}
                    backColor={colors.buttonNormal1}
                    backColor1={colors.buttonNormal2}
                    textColor={colors.white}
                    containerStyles={styles.button}
                    onPress={onCancel}
                  >
                    {onCancelBtnText}
                  </Button>
                  <Button
                    disabled={loading}
                    textStyles={{ fontSize: 14, color: colors.defaultText }}
                    backColor={colors.buttonNormal1}
                    backColor1={colors.buttonNormal2}
                    textColor={colors.white}
                    containerStyles={styles.button}
                    onPress={handleConfirm}
                  >
                    {loading ? 'Obrađuje se...' : onConfirmBtnText}
                  </Button>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.75)',
    },
    content: {
      width: '80%',
      maxWidth: 350,
      padding: 20,
      backgroundColor: colors.background,
      borderRadius: 10,
      alignItems: 'center',
    },
    image: {
      height: 80,
      resizeMode: 'contain',
      marginBottom: 20,
    },
    text: {
      fontSize: 16,
      color: colors.defaultText,
      textAlign: 'center',
      marginBottom: 20,
    },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      gap: 8,
    },
    button: {
      flex: 1,
    },
  });
}

export default ConfirmationModal;
