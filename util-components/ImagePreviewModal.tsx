// ConfirmationModal.js
import React from 'react';
import { Animated, Modal, View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { Colors } from '../constants/colors';
import Button from './Button';
import { useFadeAnimation } from '../hooks/useFadeAnimation';

function ImagePreviewModal({ isVisible, onCancel, image }) {
  return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={onCancel}
      >
      <TouchableWithoutFeedback onPress={onCancel}>
        <Animated.View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                {/* IMAGE */}
                <View style={styles.imageContainer}>
                  <Image source={{ uri: image }} resizeMode="contain" style={styles.image} />
                </View>
                <Button
                  backColor={Colors.highlight}
                  textColor={Colors.white}
                  onPress={onCancel}
                >
                  Zatvori
                </Button>
              </View>
          </TouchableWithoutFeedback>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default ImagePreviewModal;

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
    zIndex: 999
  },
  modalContent: {
    width: '80%',
    marginHorizontal: 100,
    height: '70%',
    marginVertical: 100,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  imageContainer: {
    borderRadius: 4,
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  image: {
    minHeight: '100%',
    minWidth: '100%',
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
    height: 40
  },
  buttonText: {
    fontSize: 14,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  cancelButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
