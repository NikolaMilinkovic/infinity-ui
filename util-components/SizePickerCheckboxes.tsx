import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../constants/colors';
import CustomCheckbox from './CustomCheckbox';

interface PropTypes {
  selectedSizes: string[];
  setSelectedSizes: (prev: any) => void;
  sizes: string[];
  borders?: boolean;
}
function SizePickerCheckboxes({ selectedSizes, setSelectedSizes, sizes = [], borders = true }: PropTypes) {
  const [sizeData, setSizeData] = useState<string[]>([]);
  useEffect(() => {
    setSizeData(sizes);
  }, [sizes]);
  const [sizeValues, setSizevalue] = useState({
    UNI: false,
    XS: false,
    S: false,
    M: false,
    L: false,
    XL: false,
  });
  function insertSizeHandler(size: string) {
    setSelectedSizes((prev) => [...prev, size]);
  }
  function removeSizeHandler(size: string) {
    setSelectedSizes((prev) => prev.filter((s) => s !== size));
  }
  return (
    <View style={[styles.checkboxesContainer, !borders && { borderWidth: 0 }]}>
      {sizeData.map((size) => (
        <View key={`key-size-${size}`} style={styles.checkboxWrapper}>
          <CustomCheckbox
            key={`key-size-${size}`}
            label={size}
            checked={sizeValues[size]}
            onCheckedChange={(newValue) => {
              // Update the checkbox state
              setSizevalue((prev) => ({
                ...prev,
                [size]: newValue,
              }));

              // true > add size to checkedSizes arr
              if (newValue) {
                insertSizeHandler(size);

                // false > remove size from checkedSizes arr
              } else {
                removeSizeHandler(size);
              }
            }}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  checkboxesContainer: {
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    marginTop: 8,
    borderRadius: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  checkboxWrapper: {
    alignItems: 'center',
  },
});

export default SizePickerCheckboxes;
