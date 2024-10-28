import React, { useContext, useEffect, useMemo, useState } from 'react'
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native'
import InputField from '../../../util-components/InputField'
import { Colors } from '../../../constants/colors';
import { useExpandAnimation } from '../../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../../hooks/useFadeAnimation';
import ExpandButton from '../../../util-components/ExpandButton';
import { RadioButtonProps, RadioGroup } from 'react-native-radio-buttons-group';
import Button from '../../../util-components/Button';
import { CategoriesContext } from '../../../store/categories-context';
import { CategoryTypes } from '../../../types/allTsTypes';
import DropdownList from '../../../util-components/DropdownList';
import { CouriersContext } from '../../../store/couriers-context';

interface PropTypes {
  searchData: string
  setSearchData: (data: string | number | undefined) => void
  updateSearchParam: (data: boolean) => void
}
function SearchOrders({ searchData, setSearchData, updateSearchParam }: PropTypes) {
  const [isExpanded, setIsExpanded] = useState(false);
  const screenHeight = Dimensions.get('window').height;
  const toggleExpandAnimation = useExpandAnimation(isExpanded, 10, screenHeight - 172, 180);
  const toggleFade = useToggleFadeAnimation(isExpanded, 180);
  function handleToggleExpand(){
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  }

    // PROCESSED | UNPROCESSED RADIO BUTTONS
    const processedUnprocessedButtons: RadioButtonProps[] = useMemo(() => ([
      {
          id: '1', 
          label: 'Neizvršene',
          value: 'unprocessed',
      },
      {
          id: '2',
          label: 'Izvršene',
          value: 'processed',
      },
    ]), []);
    type ProcessedUnprocessedTypes = {
      processed: boolean;
      unprocessed: boolean;
    };
    const [areProcessedOrders, setAreProcessedOrders] = useState<string>('1');
    useEffect(() => {
      const updateParams: Record<string, ProcessedUnprocessedTypes> = {
        '1': { processed: false, unprocessed: true },
        '2': { processed: true, unprocessed: false },
      };
      const params = updateParams[areProcessedOrders];
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          updateSearchParam(key as keyof ProcessedUnprocessedTypes, value);
        });
      }
    }, [areProcessedOrders]);


    // PACKED | UNPACKED RADIO BUTTONS
    const packedUnpackedButtons: RadioButtonProps[] = useMemo(() => ([
      {
          id: '1', 
          label: 'Za pakovanje',
          value: 'unpacked',
      },
      {
          id: '2',
          label: 'Spakovane',
          value: 'packed',
      },
    ]), []);
    type ActiveProductsParams = {
      packed: boolean;
      unpacked: boolean;
    };
    const [arePacked, setArePacked] = useState<string>('1');
    useEffect(() => {
      const updateParams: Record<string, ActiveProductsParams> = {
        '1': { unpacked: true, packed: false },
        '2': { unpacked: false, packed: true },
      };
      const params = updateParams[arePacked];
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          updateSearchParam(key as keyof ActiveProductsParams, value);
        });
      }
    }, [arePacked]);

    // ASCENDING | DESCENDING RADIO BUTTONS
    const ascendDescendFilterButtons: RadioButtonProps[] = useMemo(() => ([
      {
          id: '1',
          label: 'Najstarije prvo',
          value: 'ascending',
      },
      {
          id: '2', 
          label: 'Najnovije prvo',
          value: 'descending',
      },
    ]), []);
    type AscDescPropTypes = {
      ascending: boolean;
      descending: boolean;
    };
    const [isAscending, setIsAscending] = useState<string>('1');
    useEffect(() => {
      const updateParams: Record<string, AscDescPropTypes> = {
        '1': { ascending: true, descending: false },
        '2': { ascending: false, descending: true },
      };
      const params = updateParams[isAscending];
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          updateSearchParam(key as keyof AscDescPropTypes, value);
        });
      }
    }, [isAscending]);

    // CATEGORY FILTER
    const couriersCtx = useContext(CouriersContext);
    const [selectedCourier, setSelectedCourier] = useState<CategoryTypes | null>(null);
    useEffect(() => {
      if (selectedCourier && selectedCourier?.name === 'Resetuj izbor') {
      }
      updateSearchParam('onCourierSearch', selectedCourier?.name);
    }, [selectedCourier]);


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

          {/* Ascending | Descending */}
          <View style={styles.radioGroupContainer}>
            <Text style={styles.filtersH2absolute}>Redosled</Text>
            <View style={styles.radioGroup}>
              <RadioGroup 
                radioButtons={ascendDescendFilterButtons} 
                onPress={setIsAscending}
                selectedId={isAscending}
                containerStyle={styles.radioComponentContainer}
                layout='row'
              />
            </View>
          </View>

          {/* Processed | Unprocessed */}
          <View style={styles.radioGroupContainer}>
            <Text style={styles.filtersH2absolute}>Da li je porudžbina izvršena</Text>
            <View style={styles.radioGroup}>
              <RadioGroup 
                radioButtons={processedUnprocessedButtons} 
                onPress={setAreProcessedOrders}
                selectedId={areProcessedOrders}
                containerStyle={styles.radioComponentContainer}
                layout='row'
              />
            </View>
          </View>

          {/* Packed | Unpacked */}
          <View style={styles.radioGroupContainer}>
            <Text style={styles.filtersH2absolute}>Da li je porudžbine spakovana</Text>
            <View style={styles.radioGroup}>
              <RadioGroup 
                radioButtons={packedUnpackedButtons} 
                onPress={setArePacked}
                selectedId={arePacked}
                containerStyle={styles.radioComponentContainer}
                layout='row'
              />
            </View>
          </View>



          {/* Courier */}
          <Text style={styles.filtersH2}>Pretraga na osnovu kurira</Text>
          <DropdownList
            data={couriersCtx.couriers}
            onSelect={setSelectedCourier}
            placeholder='Izaberite kurira'
            defaultValue={couriersCtx.couriers[1].name}
          />

          {/* Date | Ascending | Descending */}
          <View>

          </View>



          {/* On Date search */}


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
    marginBottom: 8,
    paddingTop: 20,
    marginTop: 10,
  },
  radioGroup: {
  },
  radioComponentContainer: {
    justifyContent: 'flex-start',
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
  // type AscDescPropTypes = {
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



