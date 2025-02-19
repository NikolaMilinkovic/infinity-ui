import React, { useContext, useEffect, useState, useMemo } from 'react'
import { View, StyleSheet, Animated, Text  } from 'react-native'
import InputField from '../../util-components/InputField'
import { Colors } from '../../constants/colors';
import ExpandButton from '../../util-components/ExpandButton';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';
import MultiDropdownList from '../../util-components/MultiDropdownList';
import { ColorsContext } from '../../store/colors-context';
import SizePickerCheckboxes from '../../util-components/SizePickerCheckboxes';
import Button from '../../util-components/Button';
import DropdownList from '../../util-components/DropdownList';
import { CategoriesContext } from '../../store/categories-context';
import { useToggleFadeAnimation } from '../../hooks/useFadeAnimation';
import { useExpandAnimation } from '../../hooks/useExpand';
import { Dimensions } from 'react-native';
import useBackClickHandler from '../../hooks/useBackClickHandler';
import { SuppliersContext } from '../../store/suppliers-context';
import { SupplierTypes } from '../../types/allTsTypes';
import useTextForComponent from '../../hooks/useTextForComponent';

interface SearchProductsPropTypes {
  searchData: string
  setSearchData: string
  isExpanded: boolean
  setIsExpanded: boolean
  updateSearchParam: (paramName: string, value: boolean) => void
}
function SearchProducts({ searchData, setSearchData, isExpanded, setIsExpanded, updateSearchParam }: SearchProductsPropTypes) {
  // EXPAND ANIMATION & TOGGLING
  const screenHeight = Dimensions.get('window').height;
  const toggleExpandAnimation = useExpandAnimation(isExpanded, 10, screenHeight - 132, 180);
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  const styles = getStyles(isExpanded);
  const text = useTextForComponent('searchProducts');

  function handleToggleExpand(){
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  }
  useBackClickHandler(isExpanded, handleToggleExpand)

  // ACTIVE | INACTIVE RADIO BUTTONS
  const activeRadioButtons: RadioButtonProps[] = useMemo(() => ([
    {
        id: '1', 
        label: 'Aktivni proizvodi',
        value: 'active',
    },
    {
        id: '2',
        label: 'Neaktivni proizvodi',
        value: 'inactive',
    },
  ]), []);
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
  const radioButtons: RadioButtonProps[] = useMemo(() => ([
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
    }
  ]), []);
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
    key: string | number
    value: string | number
  }
  const [colorsData, setColorsData] = useState<ColorDataType[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  useEffect(() => {
    setColorsData(colorsCtx.colors.map(item => ({
      key: item.name,
      value: item.name
    })));
  }, [colorsCtx.colors])


  // SIZE CHECKBOXES
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // CATEGORIES
  interface CategoryTypes {
    _id: string
    name: string
    stockType: string
    __v: number
  }
  const categoriesCtx = useContext(CategoriesContext);
  const suppliersCtx = useContext(SuppliersContext);
  const [selectedCategory, setSelectedCategory] = useState<CategoryTypes | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<SupplierTypes | null>(null);

  useEffect(() => {
    if(selectedCategory?.stockType !== 'Boja-Veličina-Količina'){
      setSelectedSizes([]);
    }
    if (selectedCategory && selectedCategory?.name === 'Resetuj izbor') {
      resetDropdown();
      return; 
    }
    updateSearchParam('onCategorySearch', selectedCategory?.name);
  }, [selectedCategory]);

  useEffect(() => {
    if(selectedSupplier && selectedSupplier?.name === 'Resetuj izbor'){
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
  function resetDropdown(){
    updateSearchParam('onCategorySearch', '');
    setResetKey(prevKey => prevKey + 1);
    setSelectedCategory('');
  };
  function resetSupplierDropdown(){
    updateSearchParam('onSupplierSearch', '');
    setSupplierResetKey(prevKey => prevKey + 1);
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
          background={Colors.white}
          displayClearInputButton={true}
        />
        <ExpandButton
          isExpanded={isExpanded}
          handleToggleExpand={handleToggleExpand}
          containerStyles={styles.expandButton}
        />
      </View>

      {/* FILTERS */}
      <Animated.View style={[styles.searchParamsContainer, { height: toggleExpandAnimation }]}>
          <Animated.View style={{ opacity: toggleFade, height: screenHeight - 172 }}>
            <Text style={styles.filtersH1}>Filteri</Text>

            {/* ACTIVE INACTIVE */}
            {/* <View style={styles.radioGroupContainer}>
              <Text style={styles.filtersH2absolute}>Izbor Aktivni | Neaktivni proizvodi</Text>
              <View style={styles.radioGroup}>
                <RadioGroup 
                  radioButtons={activeRadioButtons} 
                  onPress={setAreActiveProducts}
                  selectedId={areActiveProducts}
                  layout='row'
                />
              </View>
            </View> */}

            {/* STOCK AVAILABILITY FILTER INPUT */}
            <View style={styles.radioGroupContainer}>
              <Text style={styles.filtersH2absolute}>Stanje na lageru</Text>
              <View style={styles.radioGroup}>
                <RadioGroup 
                  radioButtons={radioButtons} 
                  onPress={setSelectedId}
                  selectedId={selectedId}
                  layout='row'
                />
              </View>
            </View>

            {/* CATEGORIES FILTER INPUT */}
            <DropdownList
              key={resetKey}
              data={[{_id: '', name: 'Resetuj izbor'}, ...categoriesCtx.categories]}
              onSelect={setSelectedCategory}
              placeholder='Izaberite kategoriju'
              isDefaultValueOn={false}
            />

            {/* SUPPLIER */}
            <View style={{marginTop: 8,}}>
              <DropdownList
                key={supplierResetKey}
                data={[{_id: '', name: 'Resetuj izbor'}, ...suppliersCtx.suppliers]}
                onSelect={setSelectedSupplier}
                placeholder='Izaberite dobavljača'
                isDefaultValueOn={false}
              />
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
              <View style={{ marginTop: 8, }}>
                <MultiDropdownList
                  data={colorsData}
                  setSelected={setSelectedColors}
                  isOpen={true}
                  label='Boje'
                  placeholder='Filtriraj po bojama'
                  dropdownStyles={{maxHeight: 150}}
                />
              </View>
          </Animated.View>
          {/* CLOSE BUTTON */}
          <Animated.View style={{ opacity: toggleFade, pointerEvents: isExpanded ? 'auto' : 'none' }}>
            <Button
              onPress={() => setIsExpanded(!isExpanded)}
              backColor={Colors.highlight}
              textColor={Colors.white}
              containerStyles={{ marginBottom: 10, marginTop: -90, position: 'static'}}
            >
              Zatvori
            </Button>
          </Animated.View>
      </Animated.View>
    </View>
  )
}

function getStyles(isExpanded?:boolean){
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      borderWidth: 0.5,
      borderColor: Colors.primaryDark,
      backgroundColor: Colors.white,
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
      backgroundColor: Colors.white,
      flex: 7,
      height: 50
    },
    expandButton: {
      position: 'relative',
      flex: 1.5,
      marginLeft: 10,
      height: 45,
      right: 0,
      top: 10
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
      borderColor: Colors.primaryDark,
      borderRadius: 4,
      marginBottom: 8,
      position: 'relative',
      marginTop: 10
    },
    radioGroup: {
      alignItems: 'center',
      justifyContent: 'center'
    },
    filtersH1: {
      fontSize: 20,
      fontWeight: 'bold',
      color: Colors.primaryDark
    },
    filtersH2: {
      fontSize: 14,
      color: Colors.primaryDark,
      marginBottom: 8,
      backgroundColor: Colors.white,
      paddingHorizontal: 18
    },
    filtersH2absolute: {
      fontSize: 14,
      color: Colors.primaryDark,
      marginBottom: 8,
      position: 'absolute',
      left: 10,
      top: -12,
      backgroundColor: Colors.white,
      borderRadius: 4,
      paddingHorizontal: 4
    }
  })
}

export default SearchProducts