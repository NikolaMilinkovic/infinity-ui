import React, { useContext, useEffect, useRef, useState, useMemo } from 'react'
import { View, StyleSheet, Animated, Pressable, Text  } from 'react-native'
import InputField from '../../util-components/InputField'
import { Colors } from '../../constants/colors';
import ExpandButton from '../../util-components/ExpandButton';
import RadioGroup, {RadioButtonProps} from 'react-native-radio-buttons-group';

interface SearchProductsPropTypes {
  searchData: string
  setSearchData: string
  isExpanded: boolean
  setIsExpanded: boolean
  updateSearchParam: (paramName: string, value: boolean) => void
}
function SearchProducts({ searchData, setSearchData, isExpanded, setIsExpanded, updateSearchParam }: SearchProductsPropTypes) {
  // EXPAND ANIMATION & TOGGLING
  const toggleExpandAnimation = useRef(new Animated.Value(isExpanded ? 10 : 400)).current;
  const toggleFade = useRef(new Animated.Value(isExpanded ? 0 : 1)).current;
  function handleToggleExpand(){
    setIsExpanded((prevIsExpanded) => !prevIsExpanded);
  }
  // EXPAND ANIMATION
  useEffect(() => {
    Animated.timing(toggleExpandAnimation, {
      toValue: isExpanded ? 400 : 10,
      duration: 180,
      useNativeDriver: false,
    }).start();
    Animated.timing(toggleFade, {
      toValue: isExpanded ? 1 : 0,
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
        label: 'Oba',
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
        <Animated.View style={[styles.searchParamsContainer, { height: toggleExpandAnimation }]}>
            <Animated.View style={{ opacity: toggleFade }}>
              <Text style={styles.filtersH1}>Filteri</Text>
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
              <View style={styles.colorsPickerContainer}>
                {/* TO DO - COLORS PICKER => MULTIPLEDROPDOWB */}
              </View>
              <View style={styles.sizesPickerContainer}>
                {/* TO DO - SIZES PICKER => CHECKBOXES */}
              </View>
            </Animated.View>
        </Animated.View>
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
    borderRadius: 12
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
  colorsPickerContainer: {

  },
  sizesPickerContainer: {

  }
})

export default SearchProducts