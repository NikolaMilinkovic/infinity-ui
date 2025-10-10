import React from 'react';
import { Image, Modal, SafeAreaView, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Colors } from '../../constants/colors';
import Button from '../../util-components/Button';

interface AlertModalProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
  btnText?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({ isVisible, message, onClose, btnText = 'OK' }) => {
  if (!isVisible) return null;

  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onClose} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.content}>
                <Image source={require('../../assets/infinity.png')} style={styles.image} />
                <Text style={styles.text}>{message}</Text>
                <View style={styles.buttonContainer}>
                  <Button
                    onPress={onClose}
                    backColor={Colors.highlight}
                    textColor={Colors.whiteText}
                    textStyles={{ fontSize: 14 }}
                  >
                    {btnText}
                  </Button>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  content: {
    width: '80%',
    maxWidth: 350,
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 8,
    alignItems: 'center',
  },
  image: {
    height: 80,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: Colors.primaryDark,
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
});

export default AlertModal;
