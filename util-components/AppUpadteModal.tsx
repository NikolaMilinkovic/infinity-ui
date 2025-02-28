import React, { useContext, useEffect, useState } from 'react'
import ConfirmationModal from './ConfirmationModal'
import { AppContext } from '../store/app-context';
import { Linking } from 'react-native';
import Constants from 'expo-constants';

function AppUpadteModal() {
  // Handles update modal
  const appCtx = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [buildLink, setBuildLink] = useState(appCtx.buildLink);
  const [version, setVersion] = useState('');
  useEffect(() => {
    setBuildLink(appCtx.buildLink);
    setVersion(appCtx.version);
    if(appCtx.version !== Constants?.expoConfig?.version){
      setIsModalVisible(true);
    }
  }, [appCtx.buildLink, appCtx.version, Constants?.expoConfig?.version]);
  
  console.log('===============================================================');
  console.log(`> Expo Version ${Constants?.expoConfig?.version}`);
  console.log('===============================================================');
  function onConfirm(){
    Linking.openURL(buildLink);
  }
  function onDecline(){
    setIsModalVisible(false);
  }
  return (
    <ConfirmationModal
      isVisible={isModalVisible}
      onConfirm={onConfirm}
      onConfirmBtnText='Update App'
      onCancel={onDecline}
      onCancelBtnText='Odustani'
      message={`Nova verzija aplikacije je dostupna\nTrenutna: ${Constants?.expoConfig?.version}\nNova: ${version}`}
    />
  )
}

export default AppUpadteModal