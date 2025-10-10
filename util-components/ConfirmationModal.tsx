// ConfirmationModal.js
import React from 'react';
import { Animated, Image, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Colors } from '../constants/colors';
import Button from './Button';

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
  return (
    <Modal animationType="fade" transparent={true} visible={isVisible} onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              {/* IMAGE */}
              <Image source={require('../assets/infinity.png')} resizeMode="contain" style={styles.image} />

              {/* TEXT */}
              <Text style={styles.modalText}>
                {message || 'Da li sigurno želiš da nastaviš dalje sa ovom akcijom?'}
              </Text>

              {/* BUTTONS */}
              <View style={styles.buttonContainer}>
                <Button
                  containerStyles={styles.button}
                  textStyles={styles.buttonText}
                  backColor={Colors.primaryDark}
                  textColor={Colors.white}
                  onPress={onCancel}
                >
                  {onCancelBtnText}
                </Button>
                <Button
                  containerStyles={styles.button}
                  textStyles={styles.buttonText}
                  backColor={Colors.primaryDark}
                  textColor={Colors.white}
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
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
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  image: {
    height: 80,
    borderBottomColor: Colors.primaryDark,
    borderBottomWidth: 0.5,
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: 'black',
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
    height: 40,
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
