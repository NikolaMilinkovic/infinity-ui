import Constants from 'expo-constants';
import { useContext, useEffect, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { AppContext } from '../store/app-context';
import ConfirmationModal from './ConfirmationModal';

function AppUpadteModal() {
  // Handles update modal
  const boutique = useContext(AppContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const buildLink =
    Platform.OS === 'android' ? boutique.versionData.buildLinkAndroid : boutique.versionData.buildLinkIOS;
  const [version, setVersion] = useState('');
  useEffect(() => {
    if (!boutique.versionData || !boutique.versionData.version || !Constants?.expoConfig?.version) return;
    setVersion(boutique.versionData.version);
    if (boutique.versionData.version !== Constants?.expoConfig?.version) {
      setIsModalVisible(true);
    }
  }, [boutique.versionData.version, Constants?.expoConfig?.version]);

  useEffect(() => {
    console.log(`> buildLink: ${buildLink}`);
  }, [buildLink]);

  if (!buildLink || !boutique.versionData?.version || !Constants?.expoConfig?.version) return null;
  function onConfirm() {
    Linking.openURL(buildLink);
  }
  function onDecline() {
    setIsModalVisible(false);
  }

  return (
    <ConfirmationModal
      isVisible={isModalVisible}
      onConfirm={onConfirm}
      onConfirmBtnText="Update App"
      onCancel={onDecline}
      onCancelBtnText="Odustani"
      message={`Nova verzija aplikacije je dostupna\nTrenutna: ${Constants?.expoConfig?.version}\nNova: ${version}`}
    />
  );
}

export default AppUpadteModal;
