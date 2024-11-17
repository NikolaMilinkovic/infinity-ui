import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../../constants/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePreviewModal from '../../../util-components/ImagePreviewModal';
import useImagePreviewModal from '../../../hooks/useImagePreviewModal';

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
  const styles = getStyles(isExpanded);
  return (
    <View style={styles.container}>
      <Pressable onPress = {() => setIsExpanded(!isExpanded)} style={styles.pressable}>
        <Text style={styles.header}>Proizvodi</Text>
        <Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} style={styles.iconStyle} size={26} color={Colors.primaryDark}/>
      </Pressable>
      {data && isExpanded &&
        data.map((productData, index) => (
          <DisplayProductStatsData key={index} productData={productData} />
        ))}
    </View>
  );
}

function DisplayProductStatsData({
  productData,
}: {
  productData: PerProductStatsTypes;
}) {
  const styles = getStyles();
  const [isExpanded, setIsExpanded] = useState(false);
  const { isImageModalVisible, showImageModal, hideImageModal } = useImagePreviewModal();
  const [previewImage, setPreviewImage] = useState(productData?.productImage);
  function handleImagePreview() {
    setPreviewImage(productData?.productImage);
    showImageModal();
  }
  function handleOnDataExpand(){
    setIsExpanded(!isExpanded);
  }

  return (
    <View style={styles.dataContainer}>
      <Pressable onPress={handleOnDataExpand}>
        <>
          <View style={styles.infoGridContainer}>
            {/* IMAGE */}
            <View style={styles.imageContainer}>
              {productData.productImage && (
                <ImagePreviewModal
                  image={previewImage}
                  isVisible={isImageModalVisible}
                  onCancel={hideImageModal}
                />
              )}
              {productData && productData?.productImage && (
                <Pressable onPress={handleImagePreview}>
                  <Image source={{ uri: productData.productImage.uri }} style={styles.image}/>
                </Pressable>
              )}
            </View>
            
            {/* TEXT */}
            <View style={styles.informationsContainer}>
              <Text style={styles.productNameHeader}>{productData.productName}</Text>
            </View>
          </View>

          {isExpanded && (
            <>
              {/* BASIC INFO */}
              <View>
                <View style={styles.labeledRow}>
                  <Text style={styles.label}>Kategorija:</Text>
                  <Text style={styles.info}>{productData.productCategory}</Text>
                </View>
                <View style={styles.labeledRow}>
                  <Text style={styles.label}>Cena:</Text>
                  <Text style={styles.info}>{productData.productPrice} rsd.</Text>
                </View>
                <View style={styles.labeledRow}>
                  <Text style={styles.label}>Prodato komada:</Text>
                  <Text style={styles.info}>{productData.amountSold} kom.</Text>
                </View>
                <View style={styles.labeledRow}>
                  <Text style={styles.label}>Ukupno prodata vrednost:</Text>
                  <Text style={styles.info}>{productData.productTotalSalesValue} rsd.</Text>
                </View>
              </View>
        
              {/* PER SIZE SOLD */}
              {productData?.perSizeSold && productData?.perSizeSold?.length > 0 && (
                <View style={styles.list}>
                  <>
                    <Text style={styles.sectionTitle}>Po veličini prodato:</Text>
                    {productData?.perSizeSold?.length > 0 && productData?.perSizeSold.map((size, index) => (
                      <View key={`${index}-${size.size}`} style={styles.listItem}>
                        <Text style={styles.label}>Veličina:</Text>
                        <Text style={styles.info}>{size.size}</Text>
                        <Text>  |  </Text>
                        <Text style={styles.label}>Prodato:</Text>
                        <Text style={styles.info}>{size.amountSold} kom.</Text>
                      </View>
                    ))}
                  </>
                </View>
              )}
        
              {/* PER COLOR SOLD */}
              {productData?.perColorSold && productData?.perColorSold?.length > 0 && (
                <View style={styles.list}>
                  <>
                    <Text style={styles.sectionTitle}>Po boji prodato:</Text>
                    {productData?.perColorSold && productData?.perColorSold.map((color, index) => (
                      <View key={`${index}-${color.color}`} style={styles.listItem}>
                        <Text style={styles.label}>Boja:</Text>
                        <Text style={styles.info}>{color.color}</Text>
                        <Text>  |  </Text>
                        <Text style={styles.label}>Prodato:</Text>
                        <Text style={styles.info}>{color.amountSold} kom.</Text>
                      </View>
                    ))}
                  </>
                </View>
              )}
            </>
          )}
        </>
      </Pressable>
    </View>
  );
}

function getStyles(isExpanded?: boolean) {
  return StyleSheet.create({
    container: {
      margin: 10,
      borderWidth: 0.5,
      borderColor: Colors.primaryDark,
      borderRadius: 8,
      elevation: 2,
      backgroundColor: Colors.primaryLight,
      marginTop: 10,
      marginBottom: 0,
    },
    productNameHeader: {
      fontSize: 18,
      fontWeight: 'bold',
      color: Colors.primaryDark,
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
      marginTop: 10,
      flex: 3.5,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 10,
      flexDirection: 'column'
    },
    pressable: {
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      borderBottomColor: Colors.primaryDark,
      borderBottomWidth: isExpanded ? 0.5 : 0,
      marginHorizontal: 10,
    },
    iconStyle: {
      flex: 2,
    },
    header: {
      fontWeight: 'bold',
      fontSize: 20,
      color: Colors.primaryDark,
      textAlign: 'center',
      flex: 20,
    },
    dataContainer: {
      padding: 12,
      borderWidth: 0.5,
      borderColor: Colors.primaryDark,
      borderRadius: 8,
      backgroundColor: Colors.secondaryLight,
      margin: 10,
    },
    labeledRow: {
      flexDirection: 'row',
      marginBottom: 8,
      alignItems: 'center',
    },
    list: {
      flexDirection: 'column',
      marginTop: 12,
      padding: 10,
      borderWidth: 0.5,
      borderColor: Colors.primaryDark,
      borderRadius: 8,
      backgroundColor: Colors.primaryLight,
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 6,
      borderBottomWidth: 0.5,
      borderBottomColor: Colors.secondaryDark,
    },
    label: {
      flex: 1,
      fontWeight: '600',
      color: Colors.secondaryDark,
    },
    info: {
      flex: 1,
      textAlign: 'right',
      fontWeight: 'bold',
      color: Colors.primaryDark,
    },
    sectionTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      color: Colors.primaryDark,
      marginBottom: 8,
      textAlign: 'center',
    },
  });
}


export default PerProductStats;
