import React, { useContext, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/colors';
import { useExpandAnimationWithContentVisibility } from '../../hooks/useExpand';
import { AuthContext } from '../../store/auth-context';
import { NewOrderContext } from '../../store/new-order-context';
import Button from '../../util-components/Button';
import GalleryImagePicker from '../../util-components/GalleryImagePicker';
import InputField from '../../util-components/InputField';
import MultilineInput from '../../util-components/MultilineInput';
import { popupMessage } from '../../util-components/PopupMessage';
import { handleBuyerDataInputSort } from '../../util-methods/InputSortMethods';

interface PropTypes {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  onNext: () => void;
  buyerInfo: string;
  setBuyerInfo: (info: string) => void;
}

function SortUserInformationField({ isExpanded, setIsExpanded, onNext, buyerInfo, setBuyerInfo }: PropTypes) {
  const authCtx = useContext(AuthContext);
  const orderCtx = useContext(NewOrderContext);

  // Expand animation that makescontent visible when expanded
  // Used to fix the padding issue when expand is collapsed
  const [isContentVisible, setIsContentVisible] = useState(false);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(isExpanded, setIsContentVisible, 10, 904, 380);

  function handleToggleExpand() {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }

  // Sends buyer data for sorting and resets the input field
  const [isSortingUserInformation, setIsSortingUserInformation] = useState(false);
  async function handleInputSort() {
    try {
      if (isSortingUserInformation) return popupMessage('Sortiranje informacija u toku, sačekajte', 'info');
      setIsSortingUserInformation(true);
      const result = await handleBuyerDataInputSort(authCtx.token || '', buyerInfo, orderCtx);
      if (result) setBuyerInfo('');
      setIsSortingUserInformation(false);
    } catch (error) {
      setIsSortingUserInformation(false);
    }
  }

  // ON NEXT
  function handleOnNext() {
    if (
      orderCtx.buyerData?.name &&
      orderCtx.buyerData?.name !== '' &&
      orderCtx.buyerData?.name !== null &&
      orderCtx.buyerData?.name !== undefined &&
      orderCtx.buyerData?.address &&
      orderCtx.buyerData?.address !== '' &&
      orderCtx.buyerData?.address !== null &&
      orderCtx.buyerData?.address !== undefined &&
      orderCtx.buyerData?.phone &&
      orderCtx.buyerData?.phone !== '' &&
      orderCtx.buyerData?.phone !== null &&
      orderCtx.buyerData?.phone !== undefined &&
      orderCtx.profileImage &&
      orderCtx.profileImage !== null &&
      orderCtx.profileImage !== undefined &&
      orderCtx.buyerData?.place &&
      orderCtx.buyerData?.place !== '' &&
      orderCtx.buyerData?.place !== null &&
      orderCtx.buyerData?.place !== undefined
    ) {
      onNext();
    } else {
      if (!orderCtx.buyerData?.name) return popupMessage('Unesite ime / prezime kupca', 'danger');
      if (!orderCtx.buyerData?.address) return popupMessage('Unesite adresu kupca', 'danger');
      if (!orderCtx.buyerData?.place) return popupMessage('Unesite mesto kupca', 'danger');
      if (!orderCtx.buyerData?.phone) return popupMessage('Unesite broj telefona kupca', 'danger');
      if (!orderCtx.profileImage) return popupMessage('Unesite sliku profila kupca', 'danger');
    }
  }

  return (
    <View>
      <Pressable onPress={handleToggleExpand} style={styles.headerContainer}>
        <Text style={styles.header}>Informacije o kupcu</Text>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          style={styles.iconStyle}
          size={26}
          color={Colors.white}
        />
      </Pressable>

      {isContentVisible && (
        <Animated.View style={[styles.container, { height: toggleExpandAnimation }]}>
          <MultilineInput
            value={buyerInfo}
            setValue={setBuyerInfo}
            placeholder="Unesite puno ime, adresu i broj telefona kupca"
            background={Colors.white}
            color={Colors.primaryDark}
            containerStyles={styles.input}
          />
          <Button
            textColor={Colors.primaryDark}
            backColor={Colors.secondaryLight}
            onPress={handleInputSort}
            containerStyles={styles.sortButton}
          >
            Sortiraj podatke
          </Button>
          <InputField
            labelStyles={{ backgroundColor: Colors.white }}
            label="Ime i Prezime"
            inputText={orderCtx?.buyerData?.name || ''}
            setInputText={(text: string | number | undefined) =>
              orderCtx.setBuyerData((prev) => ({ ...prev, name: text }))
            }
            containerStyles={styles.inputFieldStyle}
          />
          <InputField
            labelStyles={{ backgroundColor: Colors.white }}
            label="Adresa"
            inputText={orderCtx?.buyerData?.address || ''}
            setInputText={(text: string | number | undefined) =>
              orderCtx.setBuyerData((prev) => ({ ...prev, address: text }))
            }
            containerStyles={styles.inputFieldStyle}
          />
          <InputField
            labelStyles={{ backgroundColor: Colors.white }}
            label="Mesto"
            inputText={orderCtx?.buyerData?.place || ''}
            setInputText={(text: string | number | undefined) =>
              orderCtx.setBuyerData((prev) => ({ ...prev, place: text }))
            }
            containerStyles={styles.inputFieldStyle}
          />
          <InputField
            keyboard="number-pad"
            labelStyles={{ backgroundColor: Colors.white }}
            label="Broj telefona"
            inputText={orderCtx?.buyerData?.phone || ''}
            setInputText={(text: string | number | undefined) =>
              orderCtx.setBuyerData((prev) => ({ ...prev, phone: text }))
            }
            containerStyles={styles.inputFieldStyle}
          />
          <InputField
            keyboard="number-pad"
            labelStyles={{ backgroundColor: Colors.white }}
            label="Broj drugog telefona"
            inputText={orderCtx?.buyerData?.phone2 || ''}
            setInputText={(text: string | number | undefined) =>
              orderCtx.setBuyerData((prev) => ({ ...prev, phone2: text }))
            }
            containerStyles={styles.inputFieldStyle}
          />
          <MultilineInput
            value={orderCtx.deliveryRemark}
            setValue={orderCtx.setDeliveryRemark}
            placeholder="Napomena za kurira"
            numberOfLines={4}
            background={Colors.white}
            containerStyles={[styles.input, { marginTop: 10 }]}
          />

          <MultilineInput
            value={orderCtx.orderNotes}
            setValue={orderCtx.setOrderNotes}
            placeholder="Naša interna napomena za porudžbinu"
            numberOfLines={4}
            containerStyles={[styles.input, { marginTop: 10 }]}
            background={Colors.white}
          />
          <GalleryImagePicker
            image={orderCtx.profileImage}
            setImage={orderCtx.setProfileImage}
            placeholder="Dodaj sliku profila"
            crop={false}
            customStyles={styles.imagePicker}
            textStyles={{ color: Colors.secondaryDark }}
          />
          <Button backColor={Colors.highlight} textColor={Colors.white} onPress={handleOnNext}>
            Dalje
          </Button>
        </Animated.View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.secondaryLight,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 10,
  },
  headerContainer: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.secondaryDark,
    marginBottom: 6,
    flexDirection: 'row',
  },
  iconStyle: {
    marginLeft: 'auto',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  input: {
    borderWidth: 0.5,
    borderRadius: 4,
    borderColor: Colors.secondaryLight,
    marginBottom: 8,
    padding: 10,
    fontSize: 16,
    maxHeight: 135,
    backgroundColor: Colors.white,
  },
  sortButton: {
    marginBottom: 30,
  },
  inputFieldStyle: {
    marginVertical: 8,
    backgroundColor: Colors.white,
  },
  orderNotesInput: {
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    marginVertical: 8,
    backgroundColor: Colors.white,
  },
  deliveryRemarkInput: {
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    marginVertical: 8,
    backgroundColor: Colors.white,
  },
  imagePicker: {
    backgroundColor: Colors.white,
  },
});

export default SortUserInformationField;
