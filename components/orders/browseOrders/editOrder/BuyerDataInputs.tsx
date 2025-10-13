import { StyleSheet, View } from 'react-native';
import { Colors } from '../../../../constants/colors';
import ImagePicker from '../../../../util-components/ImagePicker';
import InputField from '../../../../util-components/InputField';
import MultilineInput from '../../../../util-components/MultilineInput';

function BuyerDataInputs({
  name,
  setName,
  address,
  place,
  setPlace,
  setAddress,
  phone,
  setPhone,
  phone2,
  setPhone2,
  profileImage,
  setProfileImage,
  orderNotes,
  setOrderNotes,
  deliveryNotes,
  setDeliveryNotes,
}: any) {
  return (
    <View style={styles.sectionContainer}>
      {/* Name */}
      <InputField
        labelBorders={false}
        containerStyles={styles.input}
        background={Colors.white}
        label="Ime i prezime"
        inputText={name}
        setInputText={setName}
      />
      {/* Address */}
      <InputField
        labelBorders={false}
        containerStyles={styles.input}
        background={Colors.white}
        label="Adresa"
        inputText={address}
        setInputText={setAddress}
      />
      {/* Place */}
      <InputField
        labelBorders={false}
        containerStyles={styles.input}
        background={Colors.white}
        label="Mesto"
        inputText={place}
        setInputText={setPlace}
      />
      {/* Phone */}
      <InputField
        labelBorders={false}
        containerStyles={styles.input}
        background={Colors.white}
        label="Kontakt telefon"
        inputText={phone}
        setInputText={setPhone}
        keyboard="number-pad"
      />
      {/* Phone2 */}
      <InputField
        labelBorders={false}
        containerStyles={styles.input}
        background={Colors.white}
        label="Dodatni kontakt telefon"
        inputText={phone2}
        setInputText={setPhone2}
        keyboard="number-pad"
      />
      {/* Order Notes */}
      <MultilineInput
        background={Colors.white}
        label="Napomena za porudžbinu"
        value={orderNotes}
        setValue={(text: string | number | undefined) => setOrderNotes(text as string)}
        containerStyles={[styles.orderNotesInput, styles.input]}
        numberOfLines={4}
      />
      {/* Courier Notes */}
      <MultilineInput
        background={Colors.white}
        label="Napomena za kurira"
        value={deliveryNotes}
        setValue={(text: string | number | undefined) => setDeliveryNotes(text as string)}
        containerStyles={[styles.orderNotesInput, styles.input]}
        numberOfLines={4}
      />
      {/* Profile Image */}
      <View style={styles.imagePickerContainer}>
        <ImagePicker
          onTakeImage={setProfileImage}
          previewImage={profileImage}
          setPreviewImage={setProfileImage}
          height={200}
          resizeMode="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    zIndex: 2,
    height: 60,
    backgroundColor: Colors.primaryDark,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalHeader: {
    color: Colors.white,
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
  },
  container: {
    display: 'flex',
    position: 'relative',
    backgroundColor: Colors.primaryLight,
  },
  card: {
    marginTop: 70,
    backgroundColor: Colors.white,
    padding: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.secondaryLight,
    marginBottom: 16,
    margin: 10,
  },
  sectionContainer: {
    padding: 10,
  },
  sectionLabel: {
    fontSize: 18,
  },
  input: {
    marginTop: 20,
  },
  imagePickerContainer: {
    marginTop: 10,
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 2,
    height: 50,
  },
  productListContainer: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  rowItem: {
    flex: 2,
  },
  pricesContainer: {
    backgroundColor: Colors.white,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.secondaryLight,
    margin: 10,
  },
  radioGroupContainer: {
    padding: 10,
    borderWidth: 0.5,
    borderColor: Colors.secondaryLight,
    borderRadius: 4,
    marginBottom: 8,
    paddingTop: 20,
    marginTop: 10,
    flexDirection: 'row',
    backgroundColor: Colors.white,
    justifyContent: 'space-around',
  },
  radioGroupHeader: {
    fontSize: 14,
    color: Colors.primaryDark,
    marginBottom: 8,
    position: 'absolute',
    left: 10,
    top: -12,
    backgroundColor: Colors.white,
    borderRadius: 4,
    paddingHorizontal: 4,
    borderWidth: 0,
    borderColor: Colors.secondaryLight,
  },
  checkbox: {
    flex: 2,
  },
  dateButtonsContainer: {
    flexDirection: 'column',
    gap: 10,
  },
  dateButton: {
    flex: 1,
    backgroundColor: Colors.secondaryLight,
    color: Colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDisplayContainer: {
    flexDirection: 'column',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateLabel: {},
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.highlight,
    lineHeight: 16,
    marginBottom: 8,
  },
  filtersH2absolute: {
    fontSize: 14,
    color: Colors.primaryDark,
    marginBottom: 8,
    position: 'absolute',
    left: 10,
    top: -12,
    backgroundColor: Colors.white,
    borderWidth: 0,
    paddingHorizontal: 4,
  },
  orderNotesInput: {
    justifyContent: 'flex-start',
    textAlignVertical: 'top',
    marginVertical: 8,
    backgroundColor: Colors.white,
    borderColor: Colors.secondaryLight,
  },
  inputFieldLabelStyles: {
    backgroundColor: Colors.white,
  },
  priceContainer: {
    flexDirection: 'row',
    flex: 1,
    gap: 10,
  },
  recalculatePriceBtn: {
    flex: 1,
    maxHeight: 44,
    marginTop: 'auto',
    backgroundColor: Colors.secondaryLight,
    textAlign: 'center',
    justifyContent: 'center',
    maxWidth: 150,
    marginBottom: 1,
  },
  customPriceInput: {
    marginTop: 16,
    flex: 1,
  },
});

export default BuyerDataInputs;
