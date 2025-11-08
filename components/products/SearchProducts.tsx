import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import useBackClickHandler from '../../hooks/useBackClickHandler';
import { useExpandAnimation } from '../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../hooks/useFadeAnimation';
import useTextForComponent from '../../hooks/useTextForComponent';
import { CategoriesContext } from '../../store/categories-context';
import { ColorsContext } from '../../store/colors-context';
import { SuppliersContext } from '../../store/suppliers-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { SearchParamsTypes, SupplierTypes } from '../../types/allTsTypes';
import CustomText from '../../util-components/CustomText';
import DropdownList from '../../util-components/DropdownList';
import ExpandButton from '../../util-components/ExpandButton';
import InputField from '../../util-components/InputField';
import KeyboardAvoidingWrapper from '../../util-components/KeyboardAvoidingWrapper';
import MultiDropdownList from '../../util-components/MultiDropdownList';
import SizePickerCheckboxes from '../../util-components/SizePickerCheckboxes';

interface SearchProductsPropTypes {
  searchData: string;
  setSearchData: any;
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
  updateSearchParam: <K extends keyof SearchParamsTypes>(paramName: K, value: SearchParamsTypes[K]) => void;
}
function SearchProducts({
  searchData,
  setSearchData,
  isExpanded,
  setIsExpanded,
  updateSearchParam,
}: SearchProductsPropTypes) {
  // EXPAND ANIMATION & TOGGLING
  const screenHeight = Dimensions.get('window').height;
  const toggleExpandAnimation = useExpandAnimation(isExpanded, 10, screenHeight - 132, 180);
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  const text = useTextForComponent('searchProducts');
  const colors = useThemeColors();
  const styles = getStyles(colors);

  function handleToggleExpand() {
    setIsExpanded((prevIsExpanded: boolean) => !prevIsExpanded);
  }
  useBackClickHandler(isExpanded, handleToggleExpand);
  const [areActiveProducts, setAreActiveProducts] = useState<string>('1');
  type ActiveProductsParams = {
    active: boolean;
    inactive: boolean;
  };
  useEffect(() => {
    const updateParams: Record<string, ActiveProductsParams> = {
      '1': { active: true, inactive: false },
      '2': { active: false, inactive: true },
    };
    const params = updateParams[areActiveProducts];
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        updateSearchParam(key as keyof ActiveProductsParams, value);
      });
    }
  }, [areActiveProducts]);

  // RADIO BUTTONS
  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1',
        label: 'Na lageru',
        value: 'OnStock',
      },
      {
        id: '2',
        label: 'Rasprodato',
        value: 'isNotOnStock',
      },
      {
        id: '3',
        label: 'Sve',
        value: 'onStockAndSoldOut',
      },
    ],
    []
  );
  const [selectedId, setSelectedId] = useState<string>('1');
  type SearchParams = {
    isOnStock: boolean;
    isNotOnStock: boolean;
    onStockAndSoldOut: boolean;
  };
  useEffect(() => {
    const updateParams: Record<string, SearchParams> = {
      '1': { isOnStock: true, isNotOnStock: false, onStockAndSoldOut: false },
      '2': { isOnStock: false, isNotOnStock: true, onStockAndSoldOut: false },
      '3': { isOnStock: false, isNotOnStock: false, onStockAndSoldOut: true },
    };
    const params = updateParams[selectedId];
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        updateSearchParam(key as keyof SearchParams, value);
      });
    }
  }, [selectedId]);

  // COLORS PICKER
  const colorsCtx = useContext(ColorsContext);
  interface ColorDataType {
    key: string | number;
    value: string | number;
  }
  const [colorsData, setColorsData] = useState<ColorDataType[]>([]);
  useEffect(() => {
    setColorsData(colorsCtx.getColorItemsForDropdownList());
  }, [colorsCtx.colors]);

  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // SIZE CHECKBOXES
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // CATEGORIES
  interface CategoryTypes {
    _id: string;
    name: string;
    stockType: string;
    __v: number;
  }
  const categoriesCtx = useContext(CategoriesContext);
  const suppliersCtx = useContext(SuppliersContext);
  const [selectedCategory, setSelectedCategory] = useState<CategoryTypes | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierTypes | null>(null);

  useEffect(() => {
    if (selectedCategory?.stockType !== 'Boja-Veličina-Količina') {
      setSelectedSizes([]);
    }
    if (selectedCategory && selectedCategory?.name === 'Resetuj izbor') {
      resetDropdown();
      return;
    }
    updateSearchParam('onCategorySearch', selectedCategory?.name);
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSupplier && selectedSupplier?.name === 'Resetuj izbor') {
      resetSupplierDropdown();
      return;
    }
    updateSearchParam('onSupplierSearch', selectedSupplier?.name);
  }, [selectedSupplier]);

  // COLOR | SIZE SEARCH UPDATE
  useEffect(() => {
    updateSearchParam('onColorsSearch', selectedColors);
    updateSearchParam('onSizeSearch', selectedSizes);
  }, [selectedColors, selectedSizes]);

  // Dropdown Reset
  const [resetKey, setResetKey] = useState(10000);
  const [supplierResetKey, setSupplierResetKey] = useState(0);
  function resetDropdown() {
    updateSearchParam('onCategorySearch', '');
    setResetKey((prevKey) => prevKey + 1);
    setSelectedCategory('');
  }
  function resetSupplierDropdown() {
    updateSearchParam('onSupplierSearch', '');
    setSupplierResetKey((prevKey) => prevKey + 1);
    setSelectedSupplier('');
  }

  return (
    <View style={styles.container}>
      {/* INPUT CONTAINER */}
      <View style={styles.inputContainer}>
        <InputField
          label={text.search_input_field}
          isSecure={false}
          inputText={searchData}
          setInputText={setSearchData}
          containerStyles={styles.inputField}
          labelBorders={false}
          background={colors.background}
          displayClearInputButton={true}
          activeColor={colors.highlight}
          selectionColor={colors.highlight}
        />
        <ExpandButton
          isExpanded={isExpanded}
          handleToggleExpand={handleToggleExpand}
          containerStyles={styles.expandButton}
        />
      </View>

      {/* FILTERS */}
      <Animated.View
        style={[styles.searchParamsContainer, { height: toggleExpandAnimation }]}
        pointerEvents={isExpanded ? 'auto' : 'none'}
      >
        <Animated.View style={{ opacity: toggleFade, height: screenHeight - 172 }}>
          <KeyboardAvoidingWrapper>
            <CustomText style={[styles.filtersH1, { marginTop: 20 }]}>Filteri</CustomText>
            {/* STOCK AVAILABILITY FILTER INPUT */}
            <View style={styles.radioGroupContainer}>
              <CustomText style={styles.filtersH2absolute}>Stanje na lageru</CustomText>
              <View style={styles.radioGroup}>
                <RadioGroup radioButtons={radioButtons} onPress={setSelectedId} selectedId={selectedId} layout="row" />
              </View>
            </View>
            {/* CATEGORIES FILTER INPUT */}
            <DropdownList
              key={resetKey}
              data={[{ _id: '', name: 'Resetuj izbor' }, ...categoriesCtx.categories]}
              onSelect={setSelectedCategory}
              placeholder="Izaberite kategoriju"
              isDefaultValueOn={false}
            />
            {/* <DropdownList2
            key={resetKey}
            data={[{ _id: '', name: 'Resetuj izbor' }, ...categoriesCtx.categories]}
            value={selectedCategory ? selectedCategory._id : null}
            labelField="name"
            valueField="_id"
            placeholder="Izaberite kategoriju"
            onChange={(item) => setSelectedCategory(item)}
            containerStyle={{ marginTop: 8 }}
            resetValue={selectedCategory === null}
          /> */}
            {/* SUPPLIER */}
            <View style={{ marginTop: 8 }}>
              <DropdownList
                key={supplierResetKey}
                data={[{ _id: '', name: 'Resetuj izbor' }, ...suppliersCtx.suppliers]}
                onSelect={setSelectedSupplier}
                placeholder="Izaberite dobavljača"
                isDefaultValueOn={false}
              />
              {/* <DropdownList2
              key={supplierResetKey}
              data={[{ _id: '', name: 'Resetuj izbor' }, ...suppliersCtx.suppliers]}
              value={selectedSupplier ? selectedSupplier._id : null}
              labelField="name"
              valueField="_id"
              placeholder="Izaberite dobavljača"
              onChange={(item) => setSelectedSupplier(item)}
              containerStyle={{ marginTop: 8 }}
              resetValue={selectedSupplier === null}
            /> */}
            </View>
            {/* SIZES FILTER INPUT */}
            {(!selectedCategory || selectedCategory?.stockType === 'Boja-Veličina-Količina') && (
              <SizePickerCheckboxes
                sizes={['UNI', 'XS', 'S', 'M', 'L', 'XL']}
                selectedSizes={selectedSizes}
                setSelectedSizes={setSelectedSizes}
              />
            )}
            {/* COLORS FILTER INPUT */}
            <View style={{ marginTop: 8 }}>
              <MultiDropdownList
                data={colorsData}
                setSelected={setSelectedColors}
                isOpen={true}
                label="Boje"
                placeholder="Filtriraj po bojama"
                dropdownStyles={{ maxHeight: 150 }}
              />
            </View>
          </KeyboardAvoidingWrapper>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      borderColor: colors.borderColor,
      backgroundColor: colors.background,
    },
    inputContainer: {
      flexDirection: 'row',
      flex: 1,
      marginBottom: 10,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 32,
    },
    inputField: {
      marginTop: 18,
      backgroundColor: colors.background,
      flex: 7,
      height: 50,
    },
    expandButton: {
      position: 'relative',
      flex: 1.5,
      marginLeft: 10,
      height: 45,
      right: 0,
      top: 10,
      marginBottom: 1,
    },
    searchParamsContainer: {
      // flex: 1,
    },
    overlay: {
      // flex: 1,
    },
    radioGroupContainer: {
      padding: 10,
      borderWidth: 0.5,
      borderColor: colors.borderColor,
      borderRadius: 4,
      marginBottom: 8,
      position: 'relative',
      marginTop: 10,
    },
    radioGroup: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    filtersH1: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.highlightText,
      marginBottom: 16,
    },
    filtersH2: {
      fontSize: 14,
      color: colors.highlightText,
      marginBottom: 8,
      backgroundColor: colors.background,
      paddingHorizontal: 18,
    },
    filtersH2absolute: {
      fontSize: 14,
      color: colors.defaultText,
      marginBottom: 8,
      position: 'absolute',
      left: 10,
      top: -12,
      backgroundColor: colors.background,
      borderRadius: 4,
      paddingHorizontal: 6,
    },
  });
}

export default SearchProducts;
