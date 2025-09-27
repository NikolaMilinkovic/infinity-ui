import React from 'react';
import { Image, Modal, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { Colors } from '../../constants/colors';
import Button from '../../util-components/Button';

interface ConfirmModalProps {
  isVisible: boolean;
  onConfirm: () => void;
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
  return (
    <Modal visible={isVisible} transparent animationType="fade" onRequestClose={onCancel}>
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.content}>
              <Image source={require('../../assets/infinity.png')} style={styles.image} />
              <Text style={styles.text}>{message || 'Are you certain you wish to continue with this action?'}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  textStyles={{ fontSize: 14 }}
                  backColor={Colors.primaryDark}
                  textColor={Colors.white}
                  containerStyles={styles.button}
                  onPress={onCancel}
                >
                  {onCancelBtnText}
                </Button>
                <Button
                  textStyles={{ fontSize: 14 }}
                  backColor={Colors.primaryDark}
                  textColor={Colors.white}
                  containerStyles={styles.button}
                  onPress={onConfirm}
                >
                  {onConfirmBtnText}
                </Button>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    color: Colors.primaryDark,
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

export default ConfirmationModal;
