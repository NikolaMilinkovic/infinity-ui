import React, { useContext, useEffect, useState } from 'react'
import { ScrollView, Keyboard, StyleSheet, TouchableWithoutFeedback, View, Text } from 'react-native'
import { Colors } from '../../constants/colors';
import { CategoriesContext } from '../../store/categories-context';
import { ColorsContext } from '../../store/colors-context';
import Button from '../../util-components/Button';
import DressColor from '../../models/DressColor';
import { AuthContext } from '../../store/auth-context';
import { popupMessage } from '../../util-components/PopupMessage';
import { addDress, addPurse } from '../../util-methods/FetchMethods';
import AddDressComponents from './unique_product_components/add/AddDressComponents';
import GenericProductInputComponents from './GenericProductInputComponents';
import AddPurseComponents from './unique_product_components/add/AddPurseComponents';
import PurseColor from '../../models/PurseColor';
import { CategoryTypes, ColorTypes, DressColorTypes, PurseColorTypes, ProductImageTypes, SupplierTypes } from '../../types/allTsTypes';
import { betterConsoleLog } from '../../util-methods/LogMethods';
import InputField from '../../util-components/InputField';
import DropdownList from '../../util-components/DropdownList';
import { SuppliersContext } from '../../store/suppliers-context';
import { types } from '@babel/core';

function AddProduct(){
  const authCtx = useContext(AuthContext);
  const categoriesCtx = useContext(CategoriesContext);
  const colorsCtx = useContext(ColorsContext);
  const suppliersCtx = useContext(SuppliersContext);

  // Other data
  const [allCategories, setAllCategories] = useState<CategoryTypes[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryTypes>();
  const [allColors, setAllColors] = useState<ColorTypes[]>([]);
  const [isMultiDropdownOpen, setIsMultiDropdownOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if(!selectedColors) return;
    setItemColors(prevItemColors => {
      // Add new colors that are in selectedColors but not in prevItemColors
      const newColors = selectedColors.filter(
        color => !prevItemColors.some(existingColor => existingColor.color === color)
      ).map(color => {
        if(!selectedCategory) return;
        if(selectedCategory.stockType === 'Boja-Veličina-Količina'){
          const d = new DressColor();
          d.setColor(color);
          return d;
        }
        if(selectedCategory.stockType === 'Boja-Količina'){
          const d = new PurseColor();
          d.setColor(color);
          return d;
        }
        const d = new DressColor();
        d.setColor(color);
        return d;
      });
  
      // Keep only colors that are still in selectedColors
      const updatedItemColors = prevItemColors.filter(existingColor =>
        selectedColors.includes(existingColor.color)
      );
  
      betterConsoleLog('> Selected color obj are:',[...updatedItemColors, ...newColors]);
      // Return combined list of existing valid and newly added dress colors
      return [...updatedItemColors, ...newColors];
    });
  }, [selectedColors, selectedCategory]);

  // New product data
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [productImage, setProductImage] = useState<ProductImageTypes>();
  const [itemColors, setItemColors] = useState<(DressColorTypes | PurseColorTypes)[]>([]);
  const [description, setDescription] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierTypes>();


  useEffect(() => {
    setAllCategories(categoriesCtx.getCategories());
    setAllColors(colorsCtx.getColors());
  }, [categoriesCtx, colorsCtx])
  
  function handleOutsideClick() {
    Keyboard.dismiss();
  }
  function setErrorHandler(errMsg){
    popupMessage(errMsg, 'danger');
  }
  function verifyInputsData(){
    console.log('> Verifying data...')
    if(!productName){
      setErrorHandler('Proizvod mora imati ime.');
      return false;
    } 
    if(!price){
      setErrorHandler('Proizvod mora imati cenu.');
      return false;
    } 
    if(!selectedCategory){
      setErrorHandler('Izaberite kategoriju proizvoda.');
      return false;
    } 
    if(selectedCategory.stockType === 'Boja-Količina' && !itemColors.length){
      setErrorHandler('Proizvod mora imati boje');
      return false;
    }

    console.log('Validation passed');
    return true;
  }
  function resetInputsHandler(){
    setItemColors([]);
    setSelectedColors([]);
    setProductName('');
    setSelectedCategory();
    setPrice('');
    setAllCategories([]);
    setAllColors([]);
    setPreviewImage('');
    setProductImage(undefined);
    setDescription('');
    setSelectedSupplier();
    resetDropdown();
  }

  // useEffect(() => {
  //   betterConsoleLog('> Selected category', selectedCategory);
  // }, [selectedCategory])

  // Handles adding a new DRESS
  async function handleAddDress(){
    // Verify all data
    const isVerified = verifyInputsData();
    if(!isVerified) return;

    // Add new dress
    const dressData ={
      productName,
      selectedCategory,
      stockType: selectedCategory?.stockType,
      price,
      itemColors,
      productImage,
      description,
      supplier: selectedSupplier?.name || ''
    }

    let result = false;
    if(dressData && authCtx.token){
      result = await addDress(dressData, authCtx.token);

      // Reset all inputs
      if (result) resetInputsHandler();
    }
  }

  // Handles adding a new PURSE
  async function handleAddPurse(){
    // Verify all data
    const isVerified = verifyInputsData();
    if(!isVerified) return;

    // Add new dress
    const purseData = {
      productName,
      selectedCategory,
      stockType: selectedCategory?.stockType,
      price,
      itemColors,
      productImage,
      description,
      supplier: selectedSupplier?.name || ''
    }

    let result = false;
    if(purseData && authCtx.token){
      result = await addPurse(purseData, authCtx.token);

      // Reset all inputs
      if (result) resetInputsHandler();
    }
  }

  // Handles choosing correct method to add a product
  const [isAdding, setIsAdding] = useState(false);
  async function handleAddProduct(){
    try{
      if(isAdding){
        return popupMessage('Dodavanje proizvoda u toku..', 'info');
      }
      if(!selectedCategory){
        return popupMessage('Izaberite Kategoriju proizvoda', 'danger');
      } else {
        setIsAdding(true);
        if(!selectedCategory.name) return popupMessage('Morate izabrati kategoriju','danger');
  
        // Methods for adding productus based on category
        if(selectedCategory.stockType === 'Boja-Veličina-Količina') return await handleAddDress();
        if(selectedCategory.stockType === 'Boja-Količina') return await handleAddPurse();
      }
    } catch (error){
      setIsAdding(false);
      betterConsoleLog('> Došlo je do errora prilikom dodavanja novog proizvoda', error);
      popupMessage('Došlo je do problema prilikom dodavanja novog proizvoda', 'danger');
    } finally {
      setIsAdding(false);
    }
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
  }, [allColors]);

  // Supplier Dropdown Reset
  useEffect(() => {
    if (selectedSupplier && selectedSupplier?.name === 'Resetuj izbor') {
      resetDropdown();
      return;
    }
  }, [selectedSupplier]);
  const [resetKey, setResetKey] = useState(0);
  function resetDropdown(){
    setResetKey(prevKey => prevKey + 1);
    setSelectedSupplier();
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick} style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <GenericProductInputComponents
          productName={productName}
          setProductName={setProductName}
          price={price}
          setPrice={setPrice}
          setProductImage={setProductImage}
          previewImage={previewImage}
          setPreviewImage={setPreviewImage}
          allCategories={allCategories}
          setSelectedCategory={setSelectedCategory}
          allColors={allColors}
          setSelectedColors={setSelectedColors}
          isMultiDropdownOpen={isMultiDropdownOpen}
        />

        {/* DRESES */}
        {selectedCategory && selectedCategory.stockType === 'Boja-Veličina-Količina' && (
          <AddDressComponents
            dressColors={itemColors}
            setDressColors={setItemColors}
          />
        )}
        {/* PURSES */}
        {selectedCategory && selectedCategory.stockType === 'Boja-Količina' && (
          <AddPurseComponents
            purseColors={itemColors}
            setPurseColors={setItemColors}
          />
        )}
        {/* GENERIC */}
        {/* {selectedCategory && selectedCategory.stockType !== 'Boja-Veličina-Količina' && selectedCategory.stockType !== 'Boja-Veličina' && (
          <AddDressComponents
          dressColors={itemColors}
          setDressColors={setItemColors}
        /> */}
        {/* )} */}
        <Text style={styles.sectionText}>Dodatne informacije:</Text>
        <InputField
          label='Opis proizvoda'
          labelStyles={styles.inputFieldLabelStyles}
          inputText={description}
          setInputText={(text: string | number | undefined) => setDescription(text as string)}
          containerStyles={styles.descriptionField}
          selectTextOnFocus={true}
          multiline={true}
          numberOfLines={4}
          labelBorders={true}
        />
        <View style={styles.wrapper}>
          <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Dobavljač</Text>
          <DropdownList
            key={resetKey}
            data={[{_id: '', name: 'Resetuj izbor'}, ...suppliersCtx.suppliers]}
            placeholder='Izaberite dobavljača'
            onSelect={setSelectedSupplier}
            buttonContainerStyles={{marginTop: 4}}
            isDefaultValueOn={false}
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
  descriptionField: {
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    marginTop: 18,
    marginBottom: 8,
    backgroundColor: Colors.white,
  },
  inputFieldLabelStyles: {
    backgroundColor: Colors.white,
  }
})

export default AddProduct