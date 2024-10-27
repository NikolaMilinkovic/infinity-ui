import React, { useContext, useEffect, useMemo, useState } from 'react'
import Button from '../../../util-components/Button'
import { Colors } from '../../../constants/colors';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import InputField from '../../../util-components/InputField';
import ImagePicker from '../../../util-components/ImagePicker';
import MultiDropdownList from '../../../util-components/MultiDropdownList';
import { ColorsContext } from '../../../store/colors-context';
import AddDressComponents from '../unique_product_components/add/AddDressComponents';
import AddPurseComponents from '../unique_product_components/add/AddPurseComponents';
import { ProductTypes, CategoryTypes, DressColorTypes, PurseColorTypes, ProductImageTypes } from '../../../types/allTsTypes';
import DressColor from '../../../models/DressColor';
import PurseColor from '../../../models/PurseColor';
import { betterConsoleLog, betterErrorLog } from '../../../util-methods/LogMethods';
import DropdownList from '../../../util-components/DropdownList';
import { CategoriesContext } from '../../../store/categories-context';
import RadioButtonsGroup, { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';
import { popupMessage } from '../../../util-components/PopupMessage';
import { handleFetchingWithFormData } from '../../../util-methods/FetchMethods';
import { AuthContext } from '../../../store/auth-context';
import { getMimeType } from '../../../util-methods/ImageMethods';

interface PropTypes {
  item: ProductTypes;
  setItem: (data: ProductTypes | null) => void;
}

function EditProductComponent({ item, setItem }: PropTypes) {
  const authCtx = useContext(AuthContext);
  const colorsCtx = useContext(ColorsContext);
  const categoryCtx = useContext(CategoriesContext)

  const token = authCtx.token;
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState<number | string>(item.price.toString());
  const [productImage, setProductImage] = useState<ProductImageTypes>(item.image);
  const [previewImage, setPreviewImage] = useState(item.image);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [category, setCategory] = useState<CategoryTypes>(item.category);
  const [isActive, setIsActive] = useState(item.active)
  const [allColors, setAllColors] = useState(colorsCtx.colors);
  const [colorsDefaultOptions, setColorsDefaultOptions] = useState<string[]>(item.colors.map((obj) => obj.color));
  const [itemColors, setItemColors] = useState<(DressColorTypes | PurseColorTypes)[]>(item.colors);

  // useEffect(() => {
  //   betterConsoleLog('> All colors are', allColors);
  // }, [allColors])
  // useEffect(() => {
  //   betterConsoleLog('> All categories are', categoryCtx.getCategories());
  // }, [categoryCtx])
  // useEffect(() => {
  //   betterConsoleLog('> Colors Default options are', colorsDefaultOptions);
  // }, [colorsDefaultOptions])
  // useEffect(() => {
  //   betterConsoleLog('> Item colors are', itemColors);
  // }, [itemColors])

  useEffect(() => {
    betterConsoleLog('> CATEGORY: ', category);
  }, [category])
  useEffect(() => {
    betterConsoleLog('> SELECTED COLORS: ', selectedColors);
  }, [selectedColors])

  function verifyInputsData(){
    if(!name) {popupMessage('Proizvod mora imati ime','danger'); return false}
    if(!price) {popupMessage('Proizvod mora imati cenu','danger'); return false}
    if(!productImage) {popupMessage('Proizvod mora imati sliku','danger'); return false}
    if(selectedColors?.length === 0) {popupMessage('Proizvod mora imati izabrane boje','danger'); return false}
    if(!category) {popupMessage('Proizvod mora imati kategoriju','danger'); return false}
    return true;
  }

  // Sends all the data to the server for product update
  async function handleProductUpdate(){
    try{
      if(!token) return popupMessage('Morate biti ulogovani kako bi izvršili izmenu proizvoda', 'danger');
      const isVerified = verifyInputsData();
      if(!isVerified) return;
  
      const newColors = itemColors.map(({ _id, ...colorWithoutId }) => colorWithoutId);
      const formData = new FormData();
      formData.append('previousStockType', item.stockType);
      formData.append('active', isActive.toString());
      formData.append('name', name);
      formData.append('price', price.toString());
      formData.append('category', category.name);
      formData.append('stockType', category?.stockType);
      formData.append('colors', JSON.stringify(newColors));
  
      betterConsoleLog('> Product image is: ', productImage)
      if (productImage) {
        formData.append('image', {
          uri: productImage.uri,
          name: productImage?.fileName || productImage?.imageName,
          type: getMimeType(productImage?.mimeType, productImage.uri)
        });
      }
  
      const response = await handleFetchingWithFormData(formData, token, `products/update/${item._id}`, "PUT");
      betterConsoleLog('> Logging response', response);
      if(!response) return popupMessage('Došlo je do problema prilikom ažuriranja prozvoda', 'danger');
  
      if (!response.ok) {
        const parsedResponse = await response.json();
        return popupMessage(parsedResponse.message,'danger');
      }
  
      const parsedResponse = await response.json(); 
      popupMessage(parsedResponse.message,'success');
    } catch(error) {
      return betterErrorLog('> Error while handling product update', error);
    }
  }

  // Changes category and resets selected colors and default options if
  // new stockType is different then previous
  function setCategoryHandler(newCategory: CategoryTypes){
    if(item.stockType === newCategory.stockType){
      setCategory(newCategory);
    } else {
      // setColorsDefaultOptions([]);
      // setSelectedColors([]);
      setCategory(newCategory);
    }
  }

  useEffect(() => {
    betterConsoleLog('> colorsDefaultOptions', colorsDefaultOptions);
  }, [colorsDefaultOptions])


  // Sets default size / stock value 
  useEffect(() => {
    setItemColors((prevItemColors) => {
      // Filter out existing colors already in `selectedColors`
      const existingColors = prevItemColors.filter(existingColor =>
        selectedColors.includes(existingColor.color)
      );
  
      if (!category) return existingColors;
      betterConsoleLog('> SELECTED COLORS: ', selectedColors);
      // Create new color entries for any newly selected colors not in `existingColors`
      const newColors = selectedColors
        .filter(color => !existingColors.some(ec => ec.color === color))
        .map(color => {
          const newColor = category.stockType === 'Boja-Veličina-Količina'
            ? new DressColor()
            : new PurseColor();
          newColor.setColor(color);
          return newColor;
        })
        .filter(Boolean); // Remove any `undefined` entries
  
      return [...existingColors, ...newColors];
    });
  }, [category, selectedColors]);
  
  // This must run after the default size / stock value useEffect in order to rerun it
  // And therefore populate the fields..
  useEffect(() => {
    const colors = item.colors.map((obj) => obj.color);
    setItemColors(item.colors);
    setSelectedColors(colors);
    setColorsDefaultOptions(colors);
  }, [item, setItemColors, setSelectedColors, setColorsDefaultOptions]);

  function handleOnPress(){
    setItem(null);
  }
  // Define the radio buttons with `useMemo` for optimization
  const activeButtons: RadioButtonProps[] = useMemo(() => [
    { id: '1', label: 'Aktivan', value: 'active' },
    { id: '2', label: 'Neaktivan', value: 'inactive' },
  ], []);
  // Handle the radio button selection
  const handleRadioSelect = (selectedId: string | undefined) => {
    setIsActive(selectedId === '1');
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Aktivan | Neaktivan</Text>
        <RadioGroup
          radioButtons={activeButtons}
          onPress={handleRadioSelect}
          selectedId={isActive ? '1' : '2'}
          containerStyle={styles.radioButtionsContainer}
        />
      </View>
      <View>
      <Text style={styles.sectionText}>Osnovne Informacije</Text>
      <InputField
        label='Naziv Proizvoda'
        isSecure={false}
        inputText={name}
        setInputText={setName}
        background={Colors.white}
        color={Colors.primaryDark}
        activeColor={Colors.secondaryDark}
        containerStyles={{ marginTop: 18 }}
      />
    </View>
    <View>
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
    <View>
      <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Slika Proizvoda</Text>
      <ImagePicker
        onTakeImage={setProductImage}
        previewImage={previewImage}
        setPreviewImage={setPreviewImage}
      />
    </View>
    <View>
      <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Kategorija</Text>
      <DropdownList
        data={categoryCtx.categories}
        placeholder='Kategorija Proizvoda'
        onSelect={(category) => setCategoryHandler(category)}
        defaultValue={item.category}
        buttonContainerStyles={{marginTop: 4}}
      />
    </View>
    <View>
      <Text style={[styles.sectionText, styles.sectionTextTopMargin]}>Boje, veličine i količina lagera</Text>
      {colorsDefaultOptions && allColors && (
        <MultiDropdownList
          data={allColors}
          setSelected={setSelectedColors}
          isOpen={true}
          placeholder='Izaberi boje'
          label='Boje Proizvoda'
          containerStyles={{marginTop: 4}}
          defaultValues={colorsDefaultOptions.length === 0 ? [] : colorsDefaultOptions}
        />
      )}
    </View>
    {/* DRESES */}
    {category && category.stockType === 'Boja-Veličina-Količina' && (
      <AddDressComponents
        dressColors={itemColors}
        setDressColors={setItemColors}
      />
    )}
    {/* PURSES */}
    {category && category.stockType === 'Boja-Količina' && (
      <AddPurseComponents
        purseColors={itemColors}
        setPurseColors={setItemColors}
      />
    )}


      {/* BUTTONS */}
      <View style={styles.buttonsContainer}>
        <Button
          onPress={handleProductUpdate}
          textColor={Colors.white}
          backColor={Colors.secondaryDark}
          containerStyles={styles.button}
          textStyles={{}}
        >
          Sačuvaj izmene
        </Button>
        <Button
          onPress={handleOnPress}
          textColor={Colors.white}
          backColor={Colors.error}
          containerStyles={styles.button}
          textStyles={{}}
        >
          Nazad
        </Button>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    display: 'flex',
    padding: 16,
  },
  sectionText: {
    fontSize: 18,
  },
  sectionTextTopMargin: {
    marginTop: 16
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    backgroundColor: 'white',
  },
  input:{
    marginTop: 22
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    gap: 10,
    marginTop: 10,
    marginBottom: 25
  },
  button: {
    flex: 2,
    height: 50,
  },
  radioButtionsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  }

})

export default EditProductComponent