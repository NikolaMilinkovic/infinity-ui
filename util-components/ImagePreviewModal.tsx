// ConfirmationModal.js
import React from 'react';
import { Animated, Modal, View, Text, StyleSheet, Image, TouchableWithoutFeedback } from 'react-native';
import { Colors } from '../constants/colors';
import Button from './Button';
import { useFadeAnimation } from '../hooks/useFadeAnimation';
import IconButton from './IconButton';
import { useShareMessage } from '../hooks/useShareMessage';
import { ImageTypes } from '../types/allTsTypes';

interface ImageModalPropTypes {
  isVisible: boolean
  onCancel: () => void
  image: ImageTypes
}

function ImagePreviewModal({ isVisible, onCancel, image }: ImageModalPropTypes) {

  async function shareImageHandler(){
    await useShareMessage({ message: undefined, image: image });
  }
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
                  <Image source={{ uri: image.uri }} resizeMode="contain" style={styles.image} />

                  <IconButton
                    size={26}
                    color={Colors.secondaryDark}
                    onPress={shareImageHandler}
                    key={`key-${image}-add-button`}
                    icon='share'
                    style={styles.shareButtonContainer} 
                    pressedStyles={styles.shareButtonPressed}
                  />
                </View>
                {/* <Button
                  backColor={Colors.highlight}
                  textColor={Colors.white}
                  onPress={onCancel}
                >
                  Zatvori
                </Button> */}
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
    backgroundColor: 'rgba(0,0,0,0.76)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999
  },
  modalContent: {
    width: '100%',
    marginHorizontal: 100,
    height: '70%',
    marginVertical: 100,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'black'
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
  shareButtonContainer : {
    position: 'absolute',
    bottom: 10,
    right: 10,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    padding: 10,
    elevation: 2
  },
  shareButtonPressed: {
    opacity: 0.7,
    elevation: 1,
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
