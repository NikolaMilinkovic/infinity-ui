import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SafeView from '../../components/layout/SafeView';
import { useBoutique } from '../../store/app-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import Button from '../../util-components/Button';
import InputField from '../../util-components/InputField';

function Versions() {
  const boutique = useBoutique();
  const [remoteAppVersion, setRemoteAppVersion] = useState(boutique.versionData.version);
  const [description, setDescription] = useState('');
  const [buildLink, setBuildLink] = useState('');
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <SafeView>
      <View style={styles.container}>
        {/* Version */}
        <InputField
          label={'Version'}
          inputText={remoteAppVersion}
          setInputText={setRemoteAppVersion}
          labelBorders={false}
        />

        {/* Build link */}
        <InputField label={'Build Link'} inputText={buildLink} setInputText={setBuildLink} labelBorders={false} />

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
        <Button backColor={colors.highlight} textColor={colors.whiteText}>
          Save Build Version
        </Button>

        {/* Lista svih verzija > Kao sto je za proizvod display isto tako za verzije, znaci da se expand [Za duzinu mozda da racunam na osnovu karaktera u opisu? Staviti max width] */}
      </View>
    </SafeView>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      padding: 10,
      paddingTop: 30,
      gap: 16,
    },
  });
}

export default Versions;
