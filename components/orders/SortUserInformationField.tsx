import { useContext, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useExpandAnimationWithContentVisibility } from '../../hooks/useExpand';
import { AuthContext } from '../../store/auth-context';
import { NewOrderContext } from '../../store/new-order-context';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
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
  const colors = useThemeColors();
  const styles = getStyles(colors);
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

  function insertTestData() {
    orderCtx.setBuyerData({
      name: 'Nikola Milinkovic',
      address: 'Krajiska 52',
      place: 'Zemun',
      phone: '0631202585',
      phone2: '',
      bankNumber: '',
      profileImage: {
        uri: 'https://infinity-boutique.s3.eu-central-1.amazonaws.com/clients/infinity_boutique/images/profiles/bb5c1b5434e4d05ed3e7fd9f07ef16b371d4dd9504c462175a971044240f1cb3.jpeg',
        imageName: 'bb5c1b5434e4d05ed3e7fd9f07ef16b371d4dd9504c462175a971044240f1cb3.jpeg',
      },
    });
  }

  return (
    <>
      <Pressable onPress={handleToggleExpand} style={styles.headerContainer}>
        <Text style={styles.header}>Informacije o kupcu</Text>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          style={styles.iconStyle}
          size={26}
          color={colors.whiteText}
        />
      </Pressable>

      {isContentVisible && (
        <Animated.View style={[styles.container, { height: toggleExpandAnimation }]}>
          <MultilineInput
            value={buyerInfo}
            setValue={setBuyerInfo}
            placeholder="Unesite puno ime, adresu i broj telefona kupca"
            background={colors.background}
            color={colors.defaultText}
            containerStyles={styles.input}
          />
          <Button
            textColor={colors.defaultText}
            backColor={colors.buttonNormal1}
            backColor1={colors.buttonNormal2}
            onPress={handleInputSort}
            containerStyles={styles.sortButton}
          >
            Sortiraj podatke
          </Button>
          {/* <View style={styles.testButtonContainer}>
            <Button
              textColor={colors.primaryDark}
              backColor={colors.buttonNormal1}
              backColor1={colors.buttonNormal2}
              onPress={insertTestData}
              containerStyles={styles.sortButton}
            >
              Insert Test Data
            </Button>
          </View> */}
          <InputField
            activeColor={colors.borderColor}
            labelStyles={{ backgroundColor: colors.background }}
            label="Ime i Prezime"
            inputText={orderCtx?.buyerData?.name || ''}
            setInputText={(text: string | number | undefined) =>
              orderCtx.setBuyerData((prev) => ({ ...prev, name: text }))
            }
            containerStyles={styles.inputFieldStyle}
          />
          <InputField
            activeColor={colors.borderColor}
            labelStyles={{ backgroundColor: colors.background }}
            label="Adresa"
            inputText={orderCtx?.buyerData?.address || ''}
            setInputText={(text: string | number | undefined) =>
              orderCtx.setBuyerData((prev) => ({ ...prev, address: text }))
            }
            containerStyles={styles.inputFieldStyle}
          />
          <InputField
            activeColor={colors.borderColor}
            labelStyles={{ backgroundColor: colors.background }}
            label="Mesto"
            inputText={orderCtx?.buyerData?.place || ''}
            setInputText={(text: string | number | undefined) =>
              orderCtx.setBuyerData((prev) => ({ ...prev, place: text }))
            }
            containerStyles={styles.inputFieldStyle}
          />
          <InputField
            activeColor={colors.borderColor}
            keyboard="number-pad"
            labelStyles={{ backgroundColor: colors.background }}
            label="Broj telefona"
            inputText={orderCtx?.buyerData?.phone || ''}
            setInputText={(text: string | number | undefined) =>
              orderCtx.setBuyerData((prev) => ({ ...prev, phone: text }))
            }
            containerStyles={styles.inputFieldStyle}
          />
          <InputField
            activeColor={colors.borderColor}
            keyboard="number-pad"
            labelStyles={{ backgroundColor: colors.background }}
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
            background={colors.background}
            containerStyles={[styles.input, { marginTop: 10 }]}
          />

          <MultilineInput
            value={orderCtx.orderNotes}
            setValue={orderCtx.setOrderNotes}
            placeholder="Naša interna napomena za porudžbinu"
            numberOfLines={4}
            containerStyles={[styles.input, { marginTop: 10 }]}
            background={colors.background}
          />
          <GalleryImagePicker
            image={orderCtx.profileImage}
            setImage={orderCtx.setProfileImage}
            placeholder="Dodaj sliku profila"
            crop={false}
            customStyles={styles.imagePicker}
            textStyles={{ color: colors.defaultText, fontSize: 14 }}
          />
          <Button
            textColor={colors.whiteText}
            onPress={handleOnNext}
            backColor={colors.buttonHighlight1}
            backColor1={colors.buttonHighlight2}
          >
            Dalje
          </Button>
        </Animated.View>
      )}
    </>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      borderWidth: 0,
      borderColor: colors.borderColor,
      borderRadius: 4,
      overflow: 'hidden',
      marginHorizontal: 8,
      position: 'relative',
    },
    headerContainer: {
      padding: 10,
      borderRadius: 4,
      borderWidth: 0,
      borderColor: colors.primaryDark,
      backgroundColor: colors.secondaryDark,
      marginBottom: 6,
      flexDirection: 'row',
    },
    iconStyle: {
      marginLeft: 'auto',
    },
    header: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.white,
    },
    input: {
      borderWidth: 0.5,
      borderRadius: 4,
      borderColor: colors.borderColor,
      marginBottom: 8,
      padding: 10,
      fontSize: 16,
      maxHeight: 135,
      backgroundColor: colors.background,
    },
    sortButton: {
      marginBottom: 30,
    },
    inputFieldStyle: {
      marginVertical: 8,
      backgroundColor: colors.background,
    },
    orderNotesInput: {
      justifyContent: 'flex-start',
      textAlignVertical: 'top',
      marginVertical: 8,
      backgroundColor: colors.background,
    },
    deliveryRemarkInput: {
      justifyContent: 'flex-start',
      textAlignVertical: 'top',
      marginVertical: 8,
      backgroundColor: colors.background,
    },
    imagePicker: {
      backgroundColor: colors.background,
    },

    // TEST BUTTON
    testButtonContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
  });
}

export default SortUserInformationField;
