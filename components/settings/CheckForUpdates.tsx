import { useEffect, useState } from "react";
import { Linking, StyleSheet, Text, View } from 'react-native';
import Button from "../../util-components/Button";
import { Colors } from "../../constants/colors";
import Constants from 'expo-constants';

// Handles updates from Settings screen > Opens the remote link where user
// can download the new version of the app
function CheckForUpdates({ appCtx }: any){
  const [currentVersion] = useState(Constants?.expoConfig?.version);
  const [buildLink, setBuildLink] = useState(appCtx.buildLink)
  const [remoteVersion, setRemoteVersion] = useState('');
  useEffect(() => {
    setRemoteVersion(appCtx?.version);
    setBuildLink(appCtx.buildLink);
  }, [appCtx?.version])
  
  function handleOnUpdate(){
    Linking.openURL(buildLink);
  }

  return(
    <View>
      {currentVersion === remoteVersion && (
        <View>
          <Text style={styles.text}>Aplikacija je već na najnovijoj verziji!</Text>
          <Text style={styles.text}>Trenutna verzija: {currentVersion}</Text>
        </View>
      )}
      {currentVersion !== remoteVersion && (
        <View>
          <Text style={styles.text}>Postoji nova verzija aplikacije!</Text>
          <Text style={styles.text}>Trenutna verzija: {currentVersion}</Text>
          <Text style={styles.text}>Nova verzija: {remoteVersion}</Text>
          <Button
            onPress={handleOnUpdate}
            containerStyles={{ borderWidth: 0.5, borderColor: Colors.primaryDark, marginTop: 10 }}
          >
            Ažuriraj aplikaciju
          </Button>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});

export default CheckForUpdates;