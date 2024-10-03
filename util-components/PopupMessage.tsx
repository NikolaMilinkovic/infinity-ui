import { StyleSheet, View } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { showMessage, hideMessage } from "react-native-flash-message";
import FlashMessage from "react-native-flash-message";
import { Colors } from "../constants/colors";
import { useRef } from "react";

interface PopupMessageTypes {
  type: 'success' | 'warning' | 'info' | 'danger';
}
export function popupMessage(message:string, type:PopupMessageTypes['type']){
  let iconType = '';
  let backgroundColor = '';
  switch(type){
    case 'success':
      backgroundColor = Colors.success;
      iconType = 'checkcircleo'
    break;
    case 'warning':
      backgroundColor = Colors.warning;
      iconType = 'warning'
    break;
    case 'info':
      backgroundColor = Colors.info;
      iconType = 'infocirlceo'
    break;
    case 'danger':
      backgroundColor = Colors.error;
      iconType = 'closecircleo'
    break;
  }
  const styles = StyleSheet.create({
    text: {
      fontSize: 16
    },
    container: {
      backgroundColor: backgroundColor,
      paddingTop: 60,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    }
  })

  showMessage({
    animationDuration: 225,
    duration: 2000,
    style: styles.container, 
    titleStyle: styles.text,
    textStyle: styles.text,
    message: `${message}`,
    type: type,
    icon: props => <AntDesign size={20} color={Colors.whiteText} name={iconType} {...props}/>
  });
}

export function PopupMessagesComponent(){
  const otherView1Ref = useRef(null);
  const otherView2Ref = useRef(null);
  const otherView3Ref = useRef(null);

  return(
    <>
      <View ref={otherView1Ref}/>
      <View ref={otherView2Ref}/>
      <View ref={otherView3Ref}/>
      <FlashMessage position="top"/>
    </>
  )
}