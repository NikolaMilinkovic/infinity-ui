import { useContext, useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';
import DressColor from '../../../models/DressColor';
import PurseColor from '../../../models/PurseColor';
import { AuthContext } from '../../../store/auth-context';
import { CategoriesContext } from '../../../store/categories-context';
import { ColorsContext } from '../../../store/colors-context';
import { SuppliersContext } from '../../../store/suppliers-context';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import {
  CategoryTypes,
  DressColorTypes,
  ProductImageTypes,
  ProductTypes,
  PurseColorTypes,
  SupplierTypes,
} from '../../../types/allTsTypes';
import Button from '../../../util-components/Button';
import CustomText from '../../../util-components/CustomText';
import DropdownList from '../../../util-components/DropdownList';
import ImagePicker from '../../../util-components/ImagePicker';
import InputField from '../../../util-components/InputField';
import MultiDropdownList from '../../../util-components/MultiDropdownList';
import MultilineInput from '../../../util-components/MultilineInput';
import { popupMessage } from '../../../util-components/PopupMessage';
import { handleFetchingWithFormData } from '../../../util-methods/FetchMethods';
import { getMimeType } from '../../../util-methods/ImageMethods';
import { betterErrorLog } from '../../../util-methods/LogMethods';
import ModalHeader from '../../modals/components/ModalHeader';
import AddDressComponents from '../unique_product_components/add/AddDressComponents';
import AddPurseComponents from '../unique_product_components/add/AddPurseComponents';

interface PropTypes {
  item: ProductTypes;
  setItem: (data: ProductTypes | null) => void;
  showHeader?: boolean;
}

function EditProductComponent({ item, setItem, showHeader = true }: PropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  if (!item) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: '100%' }}>
        <Text style={{ color: colors.white }}>Došlo je do problema prilikom ažuriranja izabranog proizvoda..</Text>
      </View>
    );
  }
  const authCtx = useContext(AuthContext);
  const colorsCtx = useContext(ColorsContext);
  const categoryCtx = useContext(CategoriesContext);
  const suppliersCtx = useContext(SuppliersContext);

  const token = authCtx.token;
  const [name, setName] = useState(item.name);
  const [price, setPrice] = useState<number | string>(item.price.toString());
  const [productImage, setProductImage] = useState<ProductImageTypes>(item.image);
  const [previewImage, setPreviewImage] = useState(item.image);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Note - item.category je string "Torbica" tako da moramo da pronadjemo ceo objekat prvo
  let initialCategory = categoryCtx.categories.find((cat) => cat.name === item.category);
  if (!initialCategory) {
    initialCategory = {
      _id: '',
      name: item.category,
      stockType: item.stockType,
    };
  }
  const [category, setCategory] = useState<CategoryTypes>(initialCategory);
  const [isActive, setIsActive] = useState(item.active);
  const [allColors] = useState(colorsCtx.colors);
  const [description, setDescription] = useState(item.description);
  const [colorsDefaultOptions, setColorsDefaultOptions] = useState<string[]>(item.colors.map((obj) => obj.color));
  const [itemColors, setItemColors] = useState<(DressColorTypes | PurseColorTypes)[]>(item.colors);
  const [supplier, setSupplier] = useState<SupplierTypes | string>(item?.supplier || '');

  const supplierData = useMemo(
    () => [{ _id: '', name: 'Resetuj izbor' }, ...suppliersCtx.suppliers],
    [suppliersCtx.suppliers]
  );
  const supplierDefaultValue = useMemo(
    () => (typeof supplier === 'string' ? supplier : supplier?.name || ''),
    [supplier]
  );

  function verifyInputsData() {
    if (!name) {
      popupMessage('Proizvod mora imati ime', 'danger');
      return false;
    }
    if (!price) {
      popupMessage('Proizvod mora imati cenu', 'danger');
      return false;
    }
    if (!productImage) {
      popupMessage('Proizvod mora imati sliku', 'danger');
      return false;
    }
    if (selectedColors?.length === 0) {
      popupMessage('Proizvod mora imati izabrane boje', 'danger');
      return false;
    }
    if (!category) {
      popupMessage('Proizvod mora imati kategoriju', 'danger');
      return false;
    }
    return true;
  }

  // Sends all the data to the server for product update
  async function handleProductUpdate() {
    try {
      if (!token) return popupMessage('Morate biti ulogovani kako bi izvršili izmenu proizvoda', 'danger');
      const isVerified = verifyInputsData();
      if (!isVerified) return;

      const newColors = itemColors.map(({ _id, ...colorWithoutId }) => colorWithoutId);
      const formData = new FormData();
      formData.append('previousStockType', item.stockType);
      formData.append('active', isActive.toString());
      formData.append('name', name);
      formData.append('price', price.toString());
      formData.append('category', category.name);
      formData.append('stockType', category?.stockType);
      formData.append('colors', JSON.stringify(newColors));
      formData.append('description', description);
      if (supplier?.name === 'Resetuj izbor') {
        formData.append('supplier', '');
      } else {
        formData.append('supplier', supplier?.name || '');
      }

      if (productImage) {
        formData.append('image', {
          uri: productImage.uri,
          name: productImage?.fileName || productImage?.imageName,
          type: getMimeType(productImage?.mimeType, productImage.uri),
        } as any);
      }

      const response = await handleFetchingWithFormData(formData, token, `products/update/${item._id}`, 'PUT');
      if (!response) return popupMessage('Došlo je do problema prilikom ažuriranja prozvoda', 'danger');

      if (!response.ok) {
        const parsedResponse = await response.json();
        return popupMessage(parsedResponse.message, 'danger');
      }

      const parsedResponse = await response.json();
      setItem(null);
      popupMessage(parsedResponse.message, 'success');
    } catch (error) {
      return betterErrorLog('> Error while handling product update', error);
    }
  }

  // Changes category and resets selected colors and default options if
  // new stockType is different then previous
  function setCategoryHandler(newCategory: CategoryTypes) {
    if (item.stockType === newCategory.stockType) {
      setCategory(newCategory);
    } else {
      // setColorsDefaultOptions([]);
      // setSelectedColors([]);
      setCategory(newCategory);
    }
  }

  // Sets default size / stock value
  useEffect(() => {
    setItemColors((prevItemColors) => {
      // Filter out existing colors already in `selectedColors`
      const existingColors = prevItemColors.filter((existingColor) => selectedColors.includes(existingColor.color));

      if (!category) return existingColors;
      // Create new color entries for any newly selected colors not in `existingColors`
      const newColors = selectedColors
        .filter((color) => !existingColors.some((ec) => ec.color === color))
        .map((color) => {
          const newColor = category.stockType === 'Boja-Veličina-Količina' ? new DressColor() : new PurseColor();
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

  function handleOnPress() {
    setItem(null);
  }
  // Define the radio buttons with `useMemo` for optimization
  const activeButtons: RadioButtonProps[] = useMemo(
    () => [
      { id: '1', label: 'Aktivan', value: 'active' },
      { id: '2', label: 'Neaktivan', value: 'inactive' },
    ],
    []
  );
  // Handle the radio button selection
  const handleRadioSelect = (selectedId: string | undefined) => {
    setIsActive(selectedId === '1');
  };

  // Supplier Dropdown Reset
  useEffect(() => {
    if (supplier && supplier?.name === 'Resetuj izbor') {
      resetDropdown();
      return;
    }
  }, [supplier]);
  const [resetKey, setResetKey] = useState(0);
  function resetDropdown() {
    setResetKey((prevKey) => prevKey + 1);
  }

  // Filtriramo kategorije, izvacujemo sve koje su razlicitog stock type
  // Ukoliko kategorija ne postoji za ovaj item u listi kategorija kreiramo fiktivnu
  // Ukoliko nemamo kategoriju i ne kreiramo fiktivnu kategoriju za item
  // Komponenta se nece renderovati, dolazimo do problema
  const filteredCategories = useMemo(() => {
    const matchingCategories = categoryCtx.categories.filter((cat) => cat.stockType === item.stockType);

    // Check if item's category exists in filtered list
    const hasItemCategory = matchingCategories.some((cat) => cat.name === item.category);

    if (matchingCategories.length > 0 && hasItemCategory) {
      return matchingCategories;
    } else {
      // Add fictive category to the list
      return [
        {
          _id: '',
          name: item.category,
          stockType: item.stockType,
        },
        ...matchingCategories,
      ];
    }
  }, [categoryCtx.categories, item.stockType, item.category]);

  return (
    <>
      {showHeader && <ModalHeader title={`TEST: ${item.name}`} />}

      {/* CONTENT */}
      <View style={styles.container}>
        <View style={styles.card}>
          {/* ACTIVE | INACTIVE */}
          <View>
            <CustomText style={[styles.sectionText]}>Aktivan | Neaktivan</CustomText>
            <RadioGroup
              radioButtons={activeButtons}
              onPress={handleRadioSelect}
              selectedId={isActive ? '1' : '2'}
              containerStyle={styles.radioButtionsContainer}
            />
          </View>

          {/* PRODUCT NAME */}
          <View>
            <CustomText style={styles.sectionText}>Osnovne Informacije</CustomText>
            <InputField
              labelBorders={false}
              label="Naziv Proizvoda"
              isSecure={false}
              inputText={name}
              setInputText={setName}
              background={colors.background}
              color={colors.defaultText}
              activeColor={colors.grayText}
              containerStyles={{ marginTop: 18 }}
            />
          </View>

          {/* PRICE */}
          <View>
            <InputField
              labelBorders={false}
              label="Cena"
              isSecure={false}
              inputText={price}
              setInputText={setPrice}
              background={colors.background}
              color={colors.defaultText}
              activeColor={colors.grayText}
              keyboard="numeric"
              containerStyles={{ marginTop: 18 }}
            />
          </View>

          {/* IMAGE PICKER */}
          <View>
            <CustomText style={[styles.sectionText, styles.sectionTextTopMargin]}>Slika Proizvoda</CustomText>
            <ImagePicker onTakeImage={setProductImage} previewImage={previewImage} setPreviewImage={setPreviewImage} />
          </View>

          {/* CATEGORY */}
          <View>
            <CustomText style={[styles.sectionText, styles.sectionTextTopMargin]}>Kategorija</CustomText>
            <DropdownList
              data={filteredCategories}
              placeholder="Kategorija Proizvoda"
              onSelect={(category) => setCategoryHandler(category)}
              defaultValue={item.category}
              buttonContainerStyles={{ marginTop: 4 }}
            />
            {/* <DropdownList2
              data={categoryCtx.categories}
              value={initialCategory as any}
              placeholder="Kategorija Proizvoda"
              onChange={setCategoryHandler}
              labelField="name"
              valueField="name"
              containerStyle={{ marginTop: 4 }}
            /> */}
          </View>

          {/* COLORS */}
          <View>
            <CustomText style={[styles.sectionText, styles.sectionTextTopMargin]}>
              Boje, veličine i količina lagera
            </CustomText>
            {colorsDefaultOptions && allColors && (
              <MultiDropdownList
                data={allColors}
                setSelected={setSelectedColors}
                isOpen={true}
                placeholder="Izaberi boje"
                label="Boje Proizvoda"
                containerStyles={{ marginTop: 4 }}
                defaultValues={colorsDefaultOptions.length === 0 ? [] : colorsDefaultOptions}
              />
            )}
          </View>
          {/* DRESES */}
          {category && category.stockType === 'Boja-Veličina-Količina' && (
            <AddDressComponents dressColors={itemColors as any} setDressColors={setItemColors} />
          )}
          {/* PURSES */}
          {category && category.stockType === 'Boja-Količina' && (
            <AddPurseComponents purseColors={itemColors as any} setPurseColors={setItemColors} />
          )}

          <CustomText style={[styles.sectionText, styles.sectionTextTopMargin]}>Dodatne informacije:</CustomText>
          <MultilineInput
            label="Opis proizvoda"
            value={description}
            setValue={(text: string | number | undefined) => setDescription(text as string)}
            containerStyles={styles.descriptionField}
            numberOfLines={4}
            background={colors.background}
            activeColor={colors.grayText}
          />

          {/* SUPPLIER */}
          <View>
            <CustomText style={[styles.sectionText, styles.sectionTextTopMargin]}>Dobavljač</CustomText>
            <DropdownList
              key={resetKey}
              data={supplierData}
              placeholder="Izaberite dobavljača"
              onSelect={setSupplier}
              buttonContainerStyles={{ marginTop: 4 }}
              defaultValue={supplierDefaultValue}
            />
            {/* <DropdownList2
              key={resetKey}
              data={supplierData}
              value={typeof supplier === 'string' ? supplier : supplier?.name || null}
              placeholder="Izaberite dobavljača"
              onChange={setSupplier}
              labelField="name"
              valueField="name"
              containerStyle={{ marginTop: 4 }}
            /> */}
          </View>

          {/* BUTTONS */}
          <View style={styles.buttonsContainer}>
            <Button
              onPress={handleOnPress}
              textColor={colors.defaultText}
              backColor={colors.buttonNormal1}
              backColor1={colors.buttonNormal2}
              containerStyles={styles.button}
            >
              Nazad
            </Button>
            <Button
              onPress={handleProductUpdate}
              textColor={colors.white}
              backColor={colors.buttonHighlight1}
              backColor1={colors.buttonHighlight2}
              containerStyles={styles.button}
            >
              Sačuvaj izmene
            </Button>
          </View>
        </View>
      </View>
    </>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    headerContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      left: 0,
      zIndex: 2,
      height: 60,
      backgroundColor: colors.navBackground,
      paddingHorizontal: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalHeader: {
      color: colors.highlightText,
      fontWeight: 'bold',
      fontSize: 20,
      textAlign: 'center',
    },
    container: {
      display: 'flex',
      position: 'relative',
      backgroundColor: colors.background2,
    },
    card: {
      marginTop: 10,
      backgroundColor: colors.background,
      padding: 10,
      borderRadius: 4,
      borderWidth: 1,
      borderColor: colors.borderColor,
      marginBottom: 16,
      margin: 10,
    },
    sectionText: {
      fontSize: 18,
      color: colors.highlightText,
    },
    sectionTextTopMargin: {
      marginTop: 16,
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      padding: 10,
    },
    input: {
      marginTop: 22,
      color: colors.defaultText,
    },
    buttonsContainer: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 20,
      paddingHorizontal: 4,
    },
    button: {
      flex: 1,
    },
    radioButtionsContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    descriptionField: {
      justifyContent: 'flex-start',
      textAlignVertical: 'top',
      marginTop: 18,
      marginBottom: 8,
      backgroundColor: colors.background,
    },
    inputFieldLabelStyles: {
      backgroundColor: colors.background,
      color: colors.highlightText,
    },
  });
}

export default EditProductComponent;
