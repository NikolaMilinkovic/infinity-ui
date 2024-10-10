import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import InputField from '../../util-components/InputField'
import { Colors } from '../../constants/colors';
import { CategoriesContext } from '../../store/categories-context';
import DropdownList from '../../util-components/DropdownList';
import MultiDropdownList from '../../util-components/MultiDropdownList';
import { ColorsContext } from '../../store/colors-context';
import ColorSizeInputs from '../../util-components/ColorSizeInputs';
import Button from '../../util-components/Button';
import DressColor from '../../models/DressColor';

interface Category {
  _id: string,
  name: string
}
interface Color {
  _id: string,
  name: string,
  colorCode: string,
}
interface DressColorTypes{
  _id: string
  color: string
  colorCode: string
  sizes: { size: string; stock: number }[]
}

function AddProduct(){
  const categoriesCtx = useContext(CategoriesContext);
  const colorsCtx = useContext(ColorsContext);


  // Other data
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allColors, setAllColors] = useState<Color[]>([]);
  const [isMultiDropdownOpen, setIsMultiDropdownOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    setDressColors(prevDressColors => {
      // Add new colors that are in selectedColors but not in prevDressColors
      const newColors = selectedColors.filter(
        color => !prevDressColors.some(existingColor => existingColor.color === color)
      ).map(color => {
        const d = new DressColor();
        d.setColor(color);
        return d;
      });
  
      // Keep only colors that are still in selectedColors
      const updatedDressColors = prevDressColors.filter(existingColor =>
        selectedColors.includes(existingColor.color)
      );
  
      // Return combined list of existing valid and newly added dress colors
      return [...updatedDressColors, ...newColors];
    });
    console.log('Updated Dress Colors:', dressColors.length);
  }, [selectedColors]);

  // New product data
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category[]>([]);
  const [price, setPrice] = useState<number | string>('');
  const [dressColors, setDressColors] = useState<DressColorTypes[]>([]);



  useEffect(() => {
    setAllCategories(categoriesCtx.getCategories());
    setAllColors(colorsCtx.getColors());
  }, [categoriesCtx, colorsCtx])
  
  // Cursed solution for bad component, it is what it is..
  function handleOutsideClick() {
    Keyboard.dismiss();
    // setIsMultiDropdownOpen(!isMultiDropdownOpen);
  }
  // useEffect(() => {
  //   if(isMultiDropdownOpen){
  //     setIsMultiDropdownOpen(false)
  //   }
  // }, [isMultiDropdownOpen]);

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={[styles.wrapper, {marginTop: 22}]}>
          <InputField
            label='Naziv Proizvoda'
            isSecure={false}
            inputText={productName}
            setInputText={setProductName}
            background={Colors.white}
            color={Colors.primaryDark}
            activeColor={Colors.secondaryDark}
          />
        </View>
        <View style={styles.wrapper}>
          <InputField
            label='Cena'
            isSecure={false}
            inputText={price}
            setInputText={setPrice}
            background={Colors.white}
            color={Colors.primaryDark}
            activeColor={Colors.secondaryDark}
            keyboard='numeric'
          />
        </View>
        <View style={styles.wrapper}>
          <DropdownList
            data={allCategories}
            placeholder='Kategorija Proizvoda'
            onSelect={setSelectedCategory}
          />
        </View>
        <View style={styles.wrapper}>
          <MultiDropdownList
            data={allColors}
            setSelected={setSelectedColors}
            isOpen={isMultiDropdownOpen}
            placeholder='Izaberi boje'
            label='Boje'
          />
        </View>
        <View style={styles.wrapper}>
          <ColorSizeInputs 
            colorsData={dressColors}
            setColorsData={setDressColors}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            backColor={Colors.highlight}
            textColor={Colors.whiteText}
          >Dodaj</Button>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    padding: 16,
  },
  wrapper: {
    marginBottom: 8,
    marginTop: 8,
  },
  buttonContainer: {
    marginBottom: 50
  }
})

export default AddProduct