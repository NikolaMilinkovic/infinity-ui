import { StyleSheet, View } from 'react-native';
import { DressColorTypes } from '../../../../types/allTsTypes';
import ColorSizeInputs from '../../../../util-components/ColorSizeInputs';

interface PropTypes {
  dressColors: DressColorTypes[];
  setDressColors: (data: DressColorTypes[]) => void;
}

function AddDressComponents({ dressColors, setDressColors }: PropTypes) {
  return (
    <View style={[styles.wrapper, { marginTop: 10 }]}>
      <ColorSizeInputs colorsData={dressColors} setColorsData={setDressColors} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    padding: 16,
  },
  wrapper: {
    marginBottom: 0,
  },
  buttonContainer: {
    marginBottom: 50,
  },
  sectionText: {
    fontSize: 18,
  },
  sectionTextTopMargin: {
    marginTop: 16,
  },
});

export default AddDressComponents;
