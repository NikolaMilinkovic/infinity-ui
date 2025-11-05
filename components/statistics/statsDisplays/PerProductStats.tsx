import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalStyles } from '../../../constants/globalStyles';
import useImagePreviewModal from '../../../hooks/useImagePreviewModal';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import CustomText from '../../../util-components/CustomText';
import ImagePreviewModal from '../../../util-components/ImagePreviewModal';
import { formatPrice } from '../../../util-methods/formatPrice';
import AccordionWithPassableHeader from '../../accordion/AccordionWithPassableHeader';

interface ProductImageTypes {
  uri: string;
  imageName: string;
}
interface PerSizeSoldTypes {
  size: string;
  amountSold: number;
}
interface PerColorSoldTypes {
  color: string;
  amountSold: number;
}
interface PerProductStatsTypes {
  productReference: string;
  productName: string;
  productCategory: string;
  productPrice: number;
  productTotalSalesValue: number;
  amountSold: number;
  productImage: ProductImageTypes;
  perSizeSold?: PerSizeSoldTypes[];
  perColorSold?: PerColorSoldTypes[];
}
interface PerProductStatsPropTypes {
  data: PerProductStatsTypes[];
}

function PerProductStats({ data }: PerProductStatsPropTypes) {
  const [isExpanded, setIsExpanded] = useState(false);
  const colors = useThemeColors();
  const styles = getStyles(colors, isExpanded);
  const globalStyles = useGlobalStyles();
  return (
    // IZBACITI ACCORDION
    // NAMESTITI CONFITIONAL RENDERING
    <View>
      <Pressable onPress={() => setIsExpanded(!isExpanded)} style={[styles.headerContainer, globalStyles.border]}>
        <CustomText variant="bold" style={[styles.header]}>
          Proizvodi
        </CustomText>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={26}
          color={colors.defaultText}
          style={styles.icon}
        />
      </Pressable>
      {data &&
        isExpanded &&
        data.map((productData, index) => <DisplayProductStatsData key={index} productData={productData} />)}
    </View>
  );
}

function DisplayProductStatsData({ productData }: { productData: PerProductStatsTypes }) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const [isExpanded, setIsExpanded] = useState(false);
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const [previewImage, setPreviewImage] = useState(productData?.productImage);
  function handleImagePreview() {
    setPreviewImage(productData?.productImage);
    showImageModal();
  }
  function handleOnDataExpand() {
    setIsExpanded(!isExpanded);
  }

  return (
    <AccordionWithPassableHeader
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      containerStyle={styles.dataContainer}
      header={
        <Pressable onPress={handleOnDataExpand}>
          <View style={styles.infoGridContainer}>
            <View style={styles.imageContainer}>
              {productData.productImage && (
                <ImagePreviewModal image={previewImage} isVisible={isImageModalVisible} onCancel={hideImageModal} />
              )}
              {productData?.productImage && (
                <Pressable onPress={handleImagePreview}>
                  <Image source={{ uri: productData.productImage.uri }} style={styles.image} />
                </Pressable>
              )}
            </View>
            <View style={styles.informationsContainer}>
              <CustomText variant="bold" style={styles.productNameHeader}>
                {productData.productName}
              </CustomText>
            </View>
          </View>
        </Pressable>
      }
    >
      <View style={{ padding: 10 }}>
        {/* BASIC INFO */}
        <View style={{ marginTop: 10 }}>
          <View style={styles.labeledRow}>
            <CustomText style={styles.label}>Kategorija:</CustomText>
            <CustomText style={styles.info}>{productData.productCategory}</CustomText>
          </View>
          <View style={styles.labeledRow}>
            <CustomText style={styles.label}>Cena:</CustomText>
            <CustomText style={styles.info}>{formatPrice(productData.productPrice)} rsd.</CustomText>
          </View>
          <View style={styles.labeledRow}>
            <CustomText style={styles.label}>Prodato komada:</CustomText>
            <CustomText style={styles.info}>{productData.amountSold} kom.</CustomText>
          </View>
          <View style={styles.labeledRow}>
            <CustomText style={styles.label}>Ukupno prodata vrednost:</CustomText>
            <CustomText style={styles.info}>{formatPrice(productData.productTotalSalesValue)} rsd.</CustomText>
          </View>
        </View>

        {/* PER SIZE SOLD */}
        {productData?.perSizeSold && productData?.perSizeSold?.length > 0 && (
          <View style={[styles.list]}>
            <>
              <CustomText variant="bold" style={styles.sectionTitle}>
                Po veličini prodato:
              </CustomText>
              {productData?.perSizeSold?.length > 0 &&
                productData?.perSizeSold.map((size, index) => (
                  <View key={`${index}-${size.size}`} style={styles.listItem}>
                    <CustomText style={styles.label}>Veličina:</CustomText>
                    <CustomText style={styles.info}>{size.size}</CustomText>
                    <CustomText> | </CustomText>
                    <CustomText style={styles.label}>Prodato:</CustomText>
                    <CustomText style={styles.info}>{size.amountSold} kom.</CustomText>
                  </View>
                ))}
            </>
          </View>
        )}

        {/* PER COLOR SOLD */}
        {productData?.perColorSold && productData?.perColorSold?.length > 0 && (
          <View style={[styles.list]}>
            <>
              <CustomText variant="bold" style={styles.sectionTitle}>
                Po boji prodato:
              </CustomText>
              {productData?.perColorSold &&
                productData?.perColorSold.map((color, index) => (
                  <View key={`${index}-${color.color}`} style={styles.listItem}>
                    <CustomText style={styles.label}>Boja:</CustomText>
                    <CustomText style={styles.info}>{color.color}</CustomText>
                    <CustomText> | </CustomText>
                    <CustomText style={styles.label}>Prodato:</CustomText>
                    <CustomText style={styles.info}>{color.amountSold} kom.</CustomText>
                  </View>
                ))}
            </>
          </View>
        )}
      </View>
    </AccordionWithPassableHeader>
  );
}

function getStyles(colors: ThemeColors, isExpanded?: boolean) {
  return StyleSheet.create({
    container: {
      backgroundColor: colors.white,
      borderRadius: 6,
      paddingHorizontal: 10,
    },
    headerContainer: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      borderBottomColor: colors.borderColor,
      borderBottomWidth: 0.5,
      paddingHorizontal: 26,
      backgroundColor: colors.buttonNormal1,
    },
    icon: {
      flex: 0,
    },
    productNameHeader: {
      fontSize: 16,
      color: colors.defaultText,
    },
    infoGridContainer: {
      flexDirection: 'row',
      gap: 10,
    },
    imageContainer: {
      flex: 2,
    },
    image: {
      height: 120,
      width: '100%',
      borderRadius: 4,
      overflow: 'hidden',
    },
    informationsContainer: {
      flex: 3.5,
      display: 'flex',
      justifyContent: 'center',
      flexDirection: 'column',
    },
    pressable: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      borderBottomColor: colors.borderColor,
      borderBottomWidth: isExpanded ? 0.5 : 0,
      marginHorizontal: 10,
    },
    iconStyle: {
      flex: 2,
    },
    header: {
      fontSize: 20,
      color: colors.defaultText,
      textAlign: 'center',
      flex: 20,
    },
    dataContainer: {
      padding: 12,
      backgroundColor: colors.buttonNormal1,
      margin: 10,
    },
    labeledRow: {
      flexDirection: 'row',
      marginBottom: 4,
      alignItems: 'center',
    },
    list: {
      flexDirection: 'column',
      marginTop: 12,
      padding: 10,
      backgroundColor: colors.buttonNormal1,
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 4,
      borderBottomWidth: 0.5,
      borderBottomColor: colors.borderColor,
    },
    label: {
      flex: 1,
      fontWeight: '600',
      color: colors.defaultText,
    },
    info: {
      flex: 1,
      textAlign: 'right',
      fontWeight: 'bold',
      color: colors.defaultText,
    },
    sectionTitle: {
      fontSize: 16,
      color: colors.defaultText,
      marginBottom: 8,
      textAlign: 'center',
    },
  });
}

export default PerProductStats;
