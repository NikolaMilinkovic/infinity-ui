import React, { useContext, useEffect, useRef, useState } from 'react'
import { ScrollView, Keyboard, StyleSheet, TouchableWithoutFeedback, View, Text, Platform } from 'react-native'
import InputField from '../../util-components/InputField'
import { Colors } from '../../constants/colors';
import { CategoriesContext } from '../../store/categories-context';
import DropdownList from '../../util-components/DropdownList';
import MultiDropdownList from '../../util-components/MultiDropdownList';
import { ColorsContext } from '../../store/colors-context';
import ColorSizeInputs from '../../util-components/ColorSizeInputs';
import Button from '../../util-components/Button';
import DressColor from '../../models/DressColor';
import { AuthContext } from '../../store/auth-context';
import { popupMessage } from '../../util-components/PopupMessage';
import ImagePicker from '../../util-components/ImagePicker';

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
interface ProductImageTypes {
  assetId: string | null;
  base64: string | null;
  duration: number | null;
  exif: object | null;
  fileName: string;
  fileSize: number;
  height: number;
  mimeType: string;
  rotation: number | null;
  type: string;
  uri: string;
  width: number;
}

function AddProduct(){
  const authCtx = useContext(AuthContext);
  const categoriesCtx = useContext(CategoriesContext);
  const colorsCtx = useContext(ColorsContext);

  // Other data
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [allColors, setAllColors] = useState<Color[]>([]);
  const [isMultiDropdownOpen, setIsMultiDropdownOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [previewImage, setPreviewImage] = useState('');
  const [error, setError] = useState('');

  // Handles adding / removing and updating the dressColors data
  // In the ColorSizeInputs component
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
  }, [selectedColors]);

  // New product data
  const [productName, setProductName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category[] | undefined[]>([]);
  const [price, setPrice] = useState<number | string>('');
  const [dressColors, setDressColors] = useState<DressColorTypes[]>([]);
  const [productImage, setProductImage] = useState<ProductImageTypes>();

  useEffect(() => {
    setAllCategories(categoriesCtx.getCategories());
    setAllColors(colorsCtx.getColors());
  }, [categoriesCtx, colorsCtx])
  
  function handleOutsideClick() {
    Keyboard.dismiss();
  }
  function setErrorHandler(errMsg){
    popupMessage(errMsg, 'danger');
    setError(errMsg);
  }
  function verifyInputsData(){
    if(!productName){
      setErrorHandler('Proizvod mora imati ime.');
      return false;
    } 
    if(!price){
      setErrorHandler('Proizvod mora imati cenu.');
      return false;
    } 
    if(selectedCategory && selectedCategory.length === 0){
      setErrorHandler('Izaberite kategoriju proizvoda.');
      return false;
    } 
    if(selectedCategory.name === 'Haljina' && !dressColors.length){
      setErrorHandler('Proizvod mora imati boje');
      return false;
    }
    return true;
  }
  function resetInputsHandler(){
    setSelectedColors([])
    setProductName('')
    setSelectedCategory([])
    setPrice('')
    setAllCategories([]);
    setAllColors([]);
    setPreviewImage('');
    setProductImage(undefined);
  }

  // Used in combination for resetInputsHandler to again populate the Categories and Colors
  // This has to be done because components dont have methods to full input reset..
  useEffect(() => {
    if(allColors.length > 0 && allCategories.length > 0) return;
    if(allColors.length === 0){
      setAllColors(colorsCtx.getColors());
    }
    if(allCategories.length === 0){
      setAllCategories(categoriesCtx.getCategories());
    }
  }, [allColors])

  async function handleAddProduct(){
    // Validate all data
    const isVerified = verifyInputsData();
    if(!isVerified) return;

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('category', selectedCategory.name);
    formData.append('price', price);
    formData.append('colors', JSON.stringify(dressColors));

    if (productImage) {
      // console.log('Product Image:', JSON.stringify(productImage, null, 2));
      formData.append('image', {
        uri: productImage.uri,
        type: productImage.mimeType || 'image/jpeg',
        name: productImage.fileName || 'product_image.jpg',
      });
    }

    const timeout = 30000; // 30 seconds
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try{
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/products/dress`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authCtx.token}`,
        },
        body: formData,
        signal: controller.signal,
      })

      if(!response.ok) {
        const parsedResponse = await response.json();
        popupMessage(parsedResponse.message, 'danger');
        return;
      }

      popupMessage(`Proizvod pod imenom ${productName} je uspešno dodat.`, 'success');
      resetInputsHandler();
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request timed out');
        popupMessage('Request timed out. Please try again.', 'danger');
      } else {
        console.error('Fetch error:', error);
        popupMessage(`Network error: ${error.message}`, 'danger');
      }
    } finally {
      clearTimeout(id);
    }
  }

  useEffect(() => {
    console.log('> Logging productImage:');
    console.log(productImage);
  }, [productImage])

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={[styles.wrapper, {marginTop: 22}]}>
          <Text style={styles.sectionText}>Osnovne Informacije</Text>
          <InputField
            label='Naziv Proizvoda'
            isSecure={false}
            inputText={productName}
            setInputText={setProductName}
            background={Colors.white}
            color={Colors.primaryDark}
            activeColor={Colors.secondaryDark}
            containerStyles={{ marginTop: 18 }}
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
            containerStyles={{ marginTop: 18 }}
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Slika Proizvoda</Text>
          <ImagePicker
            onTakeImage={setProductImage}
            previewImage={previewImage}
            setPreviewImage={setPreviewImage}
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Kategorija</Text>
          <DropdownList
            data={allCategories}
            placeholder='Kategorija Proizvoda'
            onSelect={setSelectedCategory}
            defaultValue='Haljina'
          />
        </View>
        <View style={styles.wrapper}>
          <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Boje, veličine i količina lagera</Text>
          <MultiDropdownList
            data={allColors}
            setSelected={setSelectedColors}
            isOpen={isMultiDropdownOpen}
            placeholder='Izaberi boje'
            label='Boje Proizvoda'
          />
        </View>
        <View style={[styles.wrapper, {marginTop: 10}]}>
          <ColorSizeInputs 
            colorsData={dressColors}
            setColorsData={setDressColors}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={handleAddProduct}
            backColor={Colors.highlight}
            textColor={Colors.whiteText}
            containerStyles={{ marginTop: 16 }}
          >Sačuvaj Proizvod</Button>
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
    marginBottom: 0,
  },
  buttonContainer: {
    marginBottom: 50
  },
  sectionText: {
    fontSize: 18,
  },
  sectionTextTopMargin: {
    marginTop: 16
  },
})

export default AddProduct