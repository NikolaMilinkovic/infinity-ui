import { useContext, useEffect, useState } from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import DressColor from '../../models/DressColor';
import PurseColor from '../../models/PurseColor';
import { AuthContext } from '../../store/auth-context';
import { CategoriesContext } from '../../store/categories-context';
import { ColorsContext } from '../../store/colors-context';
import { SuppliersContext } from '../../store/suppliers-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { useUser } from '../../store/user-context';
import {
  CategoryTypes,
  ColorTypes,
  DressColorTypes,
  ProductImageTypes,
  PurseColorTypes,
  SupplierTypes,
} from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import CustomText from '../../util-components/CustomText';
import DropdownList from '../../util-components/DropdownList';
import MultilineInput from '../../util-components/MultilineInput';
import { popupMessage } from '../../util-components/PopupMessage';
import { addDress, addPurse } from '../../util-methods/FetchMethods';
import { betterErrorLog } from '../../util-methods/LogMethods';
import Card from '../layout/Card';
import GenericProductInputComponents from './GenericProductInputComponents';
import AddDressComponents from './unique_product_components/add/AddDressComponents';
import AddPurseComponents from './unique_product_components/add/AddPurseComponents';

function AddProduct() {
  const authCtx = useContext(AuthContext);
  const categoriesCtx = useContext(CategoriesContext);
  const colorsCtx = useContext(ColorsContext);
  const suppliersCtx = useContext(SuppliersContext);
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const { user } = useUser();

  // Other data
  const [allCategories, setAllCategories] = useState<CategoryTypes[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryTypes>();
  const [allColors, setAllColors] = useState<ColorTypes[]>([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [previewImage, setPreviewImage] = useState('');

  useEffect(() => {
    if (!selectedColors) return;
    setItemColors((prevItemColors) => {
      // Add new colors that are in selectedColors but not in prevItemColors
      const newColors = selectedColors
        .filter((color) => !prevItemColors.some((existingColor) => existingColor.color === color))
        .map((color) => {
          if (!selectedCategory) return;
          if (selectedCategory.stockType === 'Boja-Veličina-Količina') {
            const d = new DressColor();
            d.setColor(color);
            return d;
          }
          if (selectedCategory.stockType === 'Boja-Količina') {
            const d = new PurseColor();
            d.setColor(color);
            return d;
          }
          const d = new DressColor();
          d.setColor(color);
          return d;
        });

      // Keep only colors that are still in selectedColors
      const updatedItemColors = prevItemColors.filter((existingColor) => selectedColors.includes(existingColor.color));

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
    setAllColors(colorsCtx.colors);
  }, [categoriesCtx, colorsCtx]);

  function handleOutsideClick() {
    Keyboard.dismiss();
  }
  function setErrorHandler(errMsg: string) {
    popupMessage(errMsg, 'danger');
  }
  function verifyInputsData() {
    if (!productName) {
      setErrorHandler('Proizvod mora imati ime.');
      return false;
    }
    if (!price) {
      setErrorHandler('Proizvod mora imati cenu.');
      return false;
    }
    if (!selectedCategory) {
      setErrorHandler('Izaberite kategoriju proizvoda.');
      return false;
    }
    if (selectedCategory.stockType === 'Boja-Količina' && !itemColors.length) {
      setErrorHandler('Proizvod mora imati boje');
      return false;
    }

    return true;
  }
  function resetInputsHandler() {
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

  // Handles adding a new DRESS
  async function handleAddDress() {
    // Verify all data
    const isVerified = verifyInputsData();
    if (!isVerified) return;

    // Add new dress
    const dressData = {
      productName,
      selectedCategory,
      stockType: selectedCategory?.stockType,
      price,
      itemColors,
      productImage,
      description,
      supplier: selectedSupplier?.name || '',
    };

    let result = false;
    if (dressData && authCtx.token) {
      result = await addDress(dressData, authCtx.token);

      // Reset all inputs
      if (result) resetInputsHandler();
    }
  }

  // Handles adding a new PURSE
  async function handleAddPurse() {
    // Verify all data
    const isVerified = verifyInputsData();
    if (!isVerified) return;

    // Add new dress
    const purseData = {
      productName,
      selectedCategory,
      stockType: selectedCategory?.stockType,
      price,
      itemColors,
      productImage,
      description,
      supplier: selectedSupplier?.name || '',
    };

    let result = false;
    if (purseData && authCtx.token) {
      result = await addPurse(purseData, authCtx.token);

      // Reset all inputs
      if (result) resetInputsHandler();
    }
  }

  // Handles choosing correct method to add a product
  const [isAdding, setIsAdding] = useState(false);
  async function handleAddProduct() {
    try {
      if (!user?.permissions?.products?.create) {
        return popupMessage('Nemate dozvolu za kreiranje proizvoda.', 'danger');
      }
      if (isAdding) {
        return popupMessage('Dodavanje proizvoda u toku..', 'info');
      }
      if (!selectedCategory) {
        return popupMessage('Izaberite Kategoriju proizvoda', 'danger');
      } else {
        setIsAdding(true);
        if (!selectedCategory.name) return popupMessage('Morate izabrati kategoriju', 'danger');

        // Methods for adding productus based on category
        if (selectedCategory.stockType === 'Boja-Veličina-Količina') return await handleAddDress();
        if (selectedCategory.stockType === 'Boja-Količina') return await handleAddPurse();
      }
    } catch (error) {
      setIsAdding(false);
      betterErrorLog('> Došlo je do errora prilikom dodavanja novog proizvoda', error);
      popupMessage('Došlo je do problema prilikom dodavanja novog proizvoda', 'danger');
    } finally {
      setIsAdding(false);
    }
  }

  // Used in combination for resetInputsHandler to again populate the Categories and Colors
  // This has to be done because components dont have methods to full input reset..
  useEffect(() => {
    if (allColors.length > 0 && allCategories.length > 0) return;
    if (allColors.length === 0) {
      setAllColors(colorsCtx.colors);
    }
    if (allCategories.length === 0) {
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
  function resetDropdown() {
    setResetKey((prevKey) => prevKey + 1);
    setSelectedSupplier();
  }

  return (
    <TouchableWithoutFeedback onPress={handleOutsideClick} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Card cardStyles={{ marginBottom: 40 }}>
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
          />

          {/* DRESES */}
          {selectedCategory && selectedCategory.stockType === 'Boja-Veličina-Količina' && (
            <AddDressComponents dressColors={itemColors as any} setDressColors={setItemColors} />
          )}
          {/* PURSES */}
          {selectedCategory && selectedCategory.stockType === 'Boja-Količina' && (
            <AddPurseComponents purseColors={itemColors as any} setPurseColors={setItemColors} />
          )}
          {/* GENERIC */}
          {/* {selectedCategory && selectedCategory.stockType !== 'Boja-Veličina-Količina' && selectedCategory.stockType !== 'Boja-Veličina' && (
          <AddDressComponents
          dressColors={itemColors}
          setDressColors={setItemColors}
        /> */}
          {/* )} */}
          {/* <Text style={[styles.sectionText, styles.dodatneInfo]}>Dodatne informacije:</Text> */}
          <MultilineInput
            label="Opis proizvoda"
            value={description}
            setValue={(text: string | number | undefined) => setDescription(text as string)}
            containerStyles={styles.descriptionField}
            numberOfLines={4}
            background={colors.background}
            color={colors.defaultText}
          />

          <View style={styles.wrapper}>
            <CustomText variant="header" style={[styles.sectionText, styles.sectionTextTopMargin]}>
              Dobavljač
            </CustomText>
            <DropdownList
              key={resetKey}
              data={[{ _id: '', name: 'Resetuj izbor' }, ...suppliersCtx.suppliers]}
              placeholder="Izaberite dobavljača"
              onSelect={setSelectedSupplier}
              buttonContainerStyles={{ marginTop: 4 }}
              isDefaultValueOn={false}
            />
            {/* <DropdownList2
              key={resetKey} // keeps reset working
              data={[{ _id: '', name: 'Resetuj izbor' }, ...suppliersCtx.suppliers]}
              value={selectedSupplier?._id || null}
              onChange={(item) => setSelectedSupplier(item)}
              placeholder="Izaberite dobavljača"
              labelField="name"
              valueField="_id"
              containerStyle={{ marginTop: 4 }}
              resetValue={selectedSupplier?.name === 'Resetuj izbor'}
            /> */}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              onPress={handleAddProduct}
              textColor={colors.whiteText}
              backColor={colors.buttonHighlight1}
              backColor1={colors.buttonHighlight2}
              containerStyles={{ marginTop: 16 }}
            >
              Sačuvaj Proizvod
            </Button>
          </View>
        </Card>
      </View>
    </TouchableWithoutFeedback>
  );
}
function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      display: 'flex',
      position: 'relative',
      backgroundColor: colors.containerBackground,
    },
    card: {
      backgroundColor: colors.background1,
      padding: 10,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.borderColor,
      marginBottom: 16,
      margin: 10,
    },
    wrapper: {
      marginBottom: 0,
    },
    buttonContainer: {},
    sectionText: {
      fontSize: 16,
    },
    sectionTextTopMargin: {
      marginTop: 16,
      color: colors.highlightText,
    },
    descriptionField: {
      justifyContent: 'flex-start',
      textAlignVertical: 'top',
      marginTop: 18,
      marginBottom: 8,
      backgroundColor: colors.background,
      color: colors.defaultText,
    },
    inputFieldLabelStyles: {
      backgroundColor: colors.background,
    },
  });
}

export default AddProduct;
