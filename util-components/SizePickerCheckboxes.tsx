import React, { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native';
import CustomCheckbox from './CustomCheckbox';
import { Colors } from '../constants/colors';

interface PropTypes {
  selectedSizes: string[]
  setSelectedSizes: (prev: any) => void
  sizes: string[]
}
function SizePickerCheckboxes({ selectedSizes, setSelectedSizes, sizes = [] }: PropTypes) {
  const [sizeData, setSizeData] = useState<string[]>([]);
  useEffect(() => {
    setSizeData(sizes);
  },[sizes])
  const [sizeValues, setSizevalue] = useState({
    XS: false,
    S: false,
    M: false,
    L: false,
    XL: false,
    UNI: false,
  }) 
  function insertSizeHandler(size: string){
    setSelectedSizes((prev) => [...prev, size]);
  }
  function removeSizeHandler(size: string){
    setSelectedSizes((prev) => prev.filter((s) => s !== size));
  }
  return (
    <View style={styles.checkboxesContainer}>
      {sizeData.map((size) => (
        <CustomCheckbox
          key={`key-size-${size}`}
          label={size}
          checked={sizeValues[size]}
          onCheckedChange={
            (newValue) => {
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
            }
          }
        />
      ))
    }
  </View>
  )
}

const styles = StyleSheet.create({
  checkboxesContainer: {
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    marginTop: 8,
    borderRadius: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})

export default SizePickerCheckboxes