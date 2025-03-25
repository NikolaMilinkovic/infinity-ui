import React, { useContext, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AppContext } from '../../store/app-context';
import InputField from '../../util-components/InputField';
import Constants from 'expo-constants';
import { useGetAppColors } from '../../constants/useGetAppColors';
import { AppColors } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import { Colors } from '../../constants/colors';

function Versions() {

  const appCtx = useContext(AppContext);
  const [remoteAppVersion, setRemoteAppVersion] = useState(appCtx.version);
  const [description, setDescription] = useState('');
  const [buildLink, setBuildLink] = useState('');
  const styles = getStyles(useGetAppColors());
  
  return (
    <View style={styles.container}>

      {/* Version */}
      <InputField
        label={'Version'}
        inputText={remoteAppVersion}
        setInputText={setRemoteAppVersion}
        labelBorders={false}
        />

      {/* Build link */}
      <InputField
        label={'Build Link'}
        inputText={buildLink}
        setInputText={setBuildLink}
        labelBorders={false}
        />

      {/* Description */}
      <InputField
        label={'Description'}
        inputText={description}
        setInputText={setDescription}
        multiline={true}
        numberOfLines={8}
        labelBorders={false}
      />

      {/* Save Btn */}
      <Button
        backColor={Colors.highlight}
        textColor={Colors.whiteText}
      >
        Save Build Version
      </Button>

      {/* Lista svih verzija > Kao sto je za proizvod display isto tako za verzije, znaci da se expand [Za duzinu mozda da racunam na osnovu karaktera u opisu? Staviti max width] */}
    </View>
  )
}

function getStyles(Colors: AppColors){
  return StyleSheet.create({
    container: {
      padding: 10,
      paddingTop: 30,
      gap: 16
    }
  });
}

export default Versions