import React, { useState } from 'react'
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native'
import InputField from '../../../util-components/InputField'
import { Colors } from '../../../constants/colors';
import { useExpandAnimation } from '../../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../../hooks/useFadeAnimation';
import ExpandButton from '../../../util-components/ExpandButton';
import { RadioGroup } from 'react-native-radio-buttons-group';
import Button from '../../../util-components/Button';

interface PropTypes {
  searchData: string
  setSearchData: (data: string | number | undefined) => void
}
function SearchOrders({ searchData, setSearchData }: PropTypes) {
  const [isExpanded, setIsExpanded] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const toggleExpandAnimation = useExpandAnimation(isExpanded, 10, screenHeight - 172, 180);
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  function handleToggleExpand(){
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          label='Pretraži porudžbine'
          inputText={searchData}
          setInputText={setSearchData}
          background={Colors.white}
          color={Colors.primaryDark}
          labelBorders={false}
          containerStyles={styles.input}
        />
        <ExpandButton
          isExpanded={isExpanded}
          handleToggleExpand={handleToggleExpand}
          containerStyles={styles.expandButton}
        />
      </View>
      <Animated.ScrollView style={[styles.searchParamsContainer, { height: toggleExpandAnimation }]}>
          <Animated.ScrollView style={{ opacity: toggleFade }}>
            <Text style={styles.filtersH1}>Filteri</Text>
          </Animated.ScrollView>
          {/* CLOSE BUTTON */}
          <Animated.View style={{ opacity: toggleFade, pointerEvents: isExpanded ? 'auto' : 'none' }}>
            <Button
              onPress={() => setIsExpanded(!isExpanded)}
              backColor={Colors.highlight}
              textColor={Colors.white}
              containerStyles={{ marginBottom: 16, marginTop: 10}}
            >
              Zatvori
            </Button>
          </Animated.View>
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.white,
    paddingVertical: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    flex: 1,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
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
  },
  overlay: {
  },
  radioGroupContainer: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    borderRadius: 4,
    marginBottom: 8
  },
  radioGroup: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  filtersH1: {
    marginTop: 32,
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryDark
  },
  filtersH2: {
    fontSize: 14,
    color: Colors.primaryDark,
    marginBottom: 8,
  },
})

export default SearchOrders




  // // ACTIVE | INACTIVE RADIO BUTTONS
  // const activeRadioButtons: RadioButtonProps[] = useMemo(() => ([
  //   {
  //       id: '1', 
  //       label: 'Aktivni proizvodi',
  //       value: 'active',
  //   },
  //   {
  //       id: '2',
  //       label: 'Neaktivni proizvodi',
  //       value: 'inactive',
  //   },
  // ]), []);
  // const [areActiveProducts, setAreActiveProducts] = useState<string>('1');
  // type ActiveProductsParams = {
  //   active: boolean;
  //   inactive: boolean;
  // };
  // useEffect(() => {
  //   const updateParams: Record<string, ActiveProductsParams> = {
  //     '1': { active: true, inactive: false },
  //     '2': { active: false, inactive: true },
  //   };
  //   const params = updateParams[areActiveProducts];
  //   if (params) {
  //     Object.entries(params).forEach(([key, value]) => {
  //       updateSearchParam(key as keyof ActiveProductsParams, value);
  //     });
  //   }
  // }, [areActiveProducts]);

  // // RADIO BUTTONS
  // const radioButtons: RadioButtonProps[] = useMemo(() => ([
  //   {
  //       id: '1', 
  //       label: 'Na lageru',
  //       value: 'OnStock',
  //   },
  //   {
  //       id: '2',
  //       label: 'Rasprodato',
  //       value: 'isNotOnStock',
  //   },
  //   {
  //       id: '3',
  //       label: 'Sve',
  //       value: 'onStockAndSoldOut',
  //   }
  // ]), []);
  // const [selectedId, setSelectedId] = useState<string>('1');
  // type SearchParams = {
  //   isOnStock: boolean;
  //   isNotOnStock: boolean;
  //   onStockAndSoldOut: boolean;
  // };
  // useEffect(() => {
  //   const updateParams: Record<string, SearchParams> = {
  //     '1': { isOnStock: true, isNotOnStock: false, onStockAndSoldOut: false },
  //     '2': { isOnStock: false, isNotOnStock: true, onStockAndSoldOut: false },
  //     '3': { isOnStock: false, isNotOnStock: false, onStockAndSoldOut: true },
  //   };
  //   const params = updateParams[selectedId];
  //   if (params) {
  //     Object.entries(params).forEach(([key, value]) => {
  //       updateSearchParam(key as keyof SearchParams, value);
  //     });
  //   }
  // }, [selectedId]);

  // // COLORS PICKER
  // const colorsCtx = useContext(ColorsContext);
  // interface ColorDataType {
  //   key: string | number
  //   value: string | number
  // }
  // const [colorsData, setColorsData] = useState<ColorDataType[]>([]);
  // const [selectedColors, setSelectedColors] = useState<string[]>([]);
  // useEffect(() => {
  //   setColorsData(colorsCtx.colors.map(item => ({
  //     key: item.name,
  //     value: item.name
  //   })));
  // }, [colorsCtx.colors])


  // // SIZE CHECKBOXES
  // const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // // CATEGORIES
  // interface CategoryTypes {
  //   _id: string
  //   name: string
  //   stockType: string
  //   __v: number
  // }
  // const categoriesCtx = useContext(CategoriesContext);
  // const [selectedCategory, setSelectedCategory] = useState<CategoryTypes | null>(null);
 
  // useEffect(() => {
  //   if (selectedCategory && selectedCategory?.name === 'Resetuj izbor') {
  //     resetDropdown();
  //     return; 
  //   }
  //   updateSearchParam('onCategorySearch', selectedCategory?.name);
  // }, [selectedCategory]);

  // // COLOR | SIZE SEARCH UPDATE
  // useEffect(() => {
  //   updateSearchParam('onColorsSearch', selectedColors);
  //   updateSearchParam('onSizeSearch', selectedSizes);
  // }, [selectedColors, selectedSizes]);

  // // Dropdown Reset
  // const [resetKey, setResetKey] = useState(0);
  // function resetDropdown(){
  //   updateSearchParam('onCategorySearch', '');
  //   setResetKey(prevKey => prevKey + 1);
  //   setSelectedCategory('');
  // };



