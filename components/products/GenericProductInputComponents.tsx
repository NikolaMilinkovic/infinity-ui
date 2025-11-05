import { StyleSheet, View } from 'react-native';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import CustomText from '../../util-components/CustomText';
import DropdownList from '../../util-components/DropdownList';
import ImagePicker from '../../util-components/ImagePicker';
import InputField from '../../util-components/InputField';
import MultiDropdownList from '../../util-components/MultiDropdownList';

interface ColorType {
  _id: string;
  name: string;
  colorCode: string;
}
interface Category {
  _id: string;
  name: string;
}
interface PropTypes {
  productName: string;
  setProductName: string;
  price: string | number | undefined;
  setPrice: string | number | undefined;
  setProductImage: any;
  previewImage: any;
  setPreviewImage: any;
  allCategories: Category[];
  setSelectedCategory: Category;
  allColors: ColorType[];
  setSelectedColors: ColorType[];
}

function GenericProductInputComponents({
  productName,
  setProductName,
  price,
  setPrice,
  setProductImage,
  previewImage,
  setPreviewImage,
  allCategories,
  setSelectedCategory,
  allColors,
  setSelectedColors,
}: PropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  return (
    <>
      <View style={[styles.wrapper]}>
        <CustomText variant="bold" style={styles.sectionText}>
          Osnovne Informacije
        </CustomText>
        <InputField
          labelBorders={false}
          label="Naziv Proizvoda"
          isSecure={false}
          inputText={productName}
          setInputText={setProductName}
          background={colors.background}
          color={colors.defaultText}
          activeColor={colors.secondaryDark}
          containerStyles={{ marginTop: 18 }}
          selectionColor={colors.borderColor}
        />
      </View>
      <View style={styles.wrapper}>
        <InputField
          labelBorders={false}
          label="Cena"
          isSecure={false}
          inputText={price as any}
          setInputText={setPrice as any}
          background={colors.background}
          color={colors.defaultText}
          activeColor={colors.secondaryDark}
          keyboard="number-pad"
          containerStyles={{ marginTop: 18 }}
          selectionColor={colors.borderColor}
        />
      </View>
      <View style={styles.wrapper}>
        <CustomText variant="bold" style={[styles.sectionText, styles.sectionTextTopMargin]}>
          Slika Proizvoda
        </CustomText>
        <ImagePicker onTakeImage={setProductImage} previewImage={previewImage} setPreviewImage={setPreviewImage} />
      </View>
      <View style={styles.wrapper}>
        <CustomText variant="bold" style={[styles.sectionText, styles.sectionTextTopMargin]}>
          Kategorija
        </CustomText>
        <DropdownList
          data={allCategories}
          placeholder="Kategorija Proizvoda"
          onSelect={setSelectedCategory}
          defaultValue="Haljina"
          buttonContainerStyles={{ marginTop: 4 }}
        />
        {/* <DropdownList2
          data={allCategories}
          value={allCategories.find((c) => c.name === 'Haljina')?._id || null}
          placeholder="Kategorija Proizvoda"
          onChange={setSelectedCategory}
          labelField="name"
          valueField="_id"
          containerStyle={{ marginTop: 4 }}
        /> */}
      </View>
      <View style={styles.wrapper}>
        <CustomText variant="bold" style={[styles.sectionText, styles.sectionTextTopMargin]}>
          Boje, veličine i količina lagera
        </CustomText>
        <MultiDropdownList
          data={allColors}
          setSelected={setSelectedColors}
          isOpen={true}
          placeholder="Izaberi boje"
          label="Boje Proizvoda"
          containerStyles={{ marginTop: 4 }}
        />
      </View>
    </>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      display: 'flex',
      padding: 16,
    },
    wrapper: {
      marginBottom: 0,
    },
    buttonContainer: {
      marginBottom: 50,
    },
    sectionText: {
      fontSize: 18,
      color: colors.highlightText,
    },
    sectionTextTopMargin: {
      marginTop: 16,
    },
  });
}

export default GenericProductInputComponents;
