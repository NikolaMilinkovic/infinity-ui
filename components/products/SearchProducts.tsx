import React, { useContext, useEffect, useRef, useState, useMemo } from 'react'
import { View, StyleSheet, Animated, Pressable, Text, TouchableWithoutFeedback  } from 'react-native'
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

interface SearchProductsPropTypes {
  searchData: string
  setSearchData: string
  isExpanded: boolean
  setIsExpanded: boolean
  updateSearchParam: (paramName: string, value: boolean) => void
}
function SearchProducts({ searchData, setSearchData, isExpanded, setIsExpanded, updateSearchParam }: SearchProductsPropTypes) {
  // EXPAND ANIMATION & TOGGLING
  const toggleExpandAnimation = useRef(new Animated.Value(isExpanded ? 10 : 568)).current;
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  function handleToggleExpand(){
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  }

  // EXPAND ANIMATION
  useEffect(() => {
    Animated.timing(toggleExpandAnimation, {
      toValue: isExpanded ? 568 : 10,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isExpanded]);

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
  useEffect(() => {
    updateSearchParam('onColorsSearch', selectedColors)
  }, [selectedColors])


  // SIZE CHECKBOXES
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  useEffect(() => {
    updateSearchParam('onSizeSearch', selectedSizes);
  },[selectedSizes])

  // CATEGORIES
  const categoriesCtx = useContext(CategoriesContext);
  const [selectedCategory, setSelectedCategory] = useState('');
  useEffect(() => {
    if(selectedCategory && selectedCategory?.name === 'Resetuj izbor'){
      resetDropdown();
      return 
    }
    updateSearchParam('onCategorySearch', selectedCategory.name)
  }, [selectedCategory])
  // Dropdown Reset
  const [resetKey, setResetKey] = useState(0);
  function resetDropdown(){
    updateSearchParam('onCategorySearch', '');
    setResetKey(prevKey => prevKey + 1);
    setSelectedCategory('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <InputField
          label='Pretraži proizvode'
          isSecure={false}
          inputText={searchData}
          setInputText={setSearchData}
          containerStyles={styles.inputField}
          labelBorders={false}
          background={Colors.white}
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

              {/* STOCK AVAILABILITY FILTER INPUT */}
              <View style={styles.radioGroupContainer}>
                <Text style={styles.filtersH2}>Stanje na lageru</Text>
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

                {/* SIZES FILTER INPUT */}
                <SizePickerCheckboxes
                  sizes={['XS', 'S', 'M', 'L', 'XL', 'UNI']}
                  selectedSizes={selectedSizes}
                  setSelectedSizes={setSelectedSizes}
                />

                {/* COLORS FILTER INPUT */}
                <MultiDropdownList
                  data={colorsData}
                  setSelected={setSelectedColors}
                  isOpen={true}
                  label='Boje'
                  placeholder='Filtriraj po bojama'
                />
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
    marginBottom: 8
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
  },
})

export default SearchProducts