import { createContext, useState, ReactNode, useMemo, useEffect } from "react";
import { betterConsoleLog } from "../util-methods/LogMethods";
import { NewOrderContextTypes, BuyerTypes, ProductTypes, OrderProductTypes, CourierTypes, ProductImageTypes, DressColorTypes, PurseColorTypes, ColorSizeTypes } from "../types/allTsTypes";
import { popupMessage } from "../util-components/PopupMessage";
import { getMimeType } from "../util-methods/ImageMethods";
interface ContextChildrenTypes {
  children: ReactNode;
}

export const NewOrderContext = createContext<NewOrderContextTypes>({
  productReferences: [],
  addProductReference: () => {},
  removeProductReference: () => {},
  setProductReferences: () => {},
  getProductReferences: () => [],
  updateProductColorByIndex: () => [],
  updateProductSizeByIndex: () => [],

  productData: [],
  addProduct: () => {},
  removeProduct: () => {},
  setProductsData: () => {},
  getProductsData: () => [],

  buyerData: null,
  setBuyerData: () => {},
  getBuyerData: () => null,
  resetOrderData: () => null,

  courierData: null,
  setCourierData: () => {},
  getCourierData: () => null,

  isReservation: false,
  setIsReservation: () => {},

  profileImage: null,
  setProfileImage: () => {},

  createOrderHandler: () => {},

  customPrice: '',
  setCustomPrice: () => {},

  weight: '0.5',
  setWeight: () => {},
  orderValue: '',
  setOrderValue: () => {},
  internalRemark: '',
  setInternalRemark: () => {},
  deliveryRemark: '',
  setDeliveryRemark: () => {},
  orderNote: '',
  setOrderNote: () => {},
})

function NewOrderContextProvider({ children }: ContextChildrenTypes){
  const [productReferences, setProductReferences] = useState<ProductTypes[]>([]);
  const [buyerData, setBuyerData] = useState<BuyerTypes | null>(null);
  const [productData, setProductData] = useState<OrderProductTypes[]>([]);
  const [courierData, setCourierData] = useState<CourierTypes | null>(null);
  const [isReservation, setIsReservation] = useState(false);
  const [profileImage, setProfileImage] = useState<ProductImageTypes | null>(null);
  const [customPrice, setCustomPrice] = useState<string | number>('');
  const [orderValue, setOrderValue] = useState('');
  const [weight, setWeight] = useState('0.5');
  const [internalRemark, setInternalRemark] = useState('');
  const [deliveryRemark, setDeliveryRemark] = useState('');
  const [orderNote, setOrderNote] = useState('');



  // Check to see if all products have selectedColor & selectedSize where applicable
  function validateProductData(){
    const isValid = productData.every(product => {
      // product.itemReference = product.itemReference._id;
      const hasSelectedColor = product.selectedColor !== undefined && product.selectedColor !== "";
      const hasSelectedSize = product.selectedSize !== undefined ? product.selectedSize !== "" : true; // Consider true if selectedSize is missing
    
      return hasSelectedColor && hasSelectedSize;
    });
    return isValid;
  }

  // Validates all inputs | Creates a new form, prepares all data and returns the form
  // Used for sending the data back to server
  function createOrderHandler(){
    // Validate all data
    if(productData.length === 0) return popupMessage('Nedostaju podaci o proizvodima', 'danger');
    if(!buyerData) return popupMessage('Nedostaju podaci o kupcu', 'danger');
    if(!courierData) return popupMessage('Nedostaju podaci o kuriru', 'danger');
    if(!profileImage) return popupMessage('Nedostaje slika kupčevog profila', 'danger');
    if(!validateProductData()) return popupMessage('Svi proizvodi moraju imati selektovane boje i veličine', 'danger');


    // Reshape data
    const price = calculatePriceHandler();
    if (!price) return popupMessage('Nije moguće izračunati cenu', 'danger');

    const courier = {
      name: courierData.name,
      deliveryPrice: courierData.deliveryPrice
    }

    // Create form data
    const order = new FormData();
    order.append('buyerData', JSON.stringify(buyerData));
    order.append('productData', JSON.stringify(productData));
    if (price.productsPrice !== undefined) order.append('productsPrice', price.productsPrice.toString());
    if (price.totalPrice !== undefined) order.append('totalPrice', price.totalPrice.toString());
    order.append('reservation', isReservation.toString());
    order.append('packedIndicator', 'false');
    order.append('packed', 'false');
    order.append('processed', 'false');
    order.append('value', orderValue);
    order.append('weight', weight);
    order.append('internalRemark', internalRemark);
    order.append('deliveryRemark', deliveryRemark);
    order.append('courier', JSON.stringify(courier));
    order.append('orderNote', orderNote);
    betterConsoleLog('> Logging profile image', profileImage);
    order.append('profileImage', {
      uri: profileImage.uri,
      type: getMimeType(profileImage.mimeType, profileImage?.uri || ''),
      name: profileImage.fileName,
    } as any);

    // const orderData = {
    //   buyerData: buyerData,
    //   productData: productData,
    //   productsPrice: price.productsPrice.toString(),
    //   totalPrice: price.totalPrice.toString(),
    //   reservation: isReservation.toString(),
    //   packed: 'false',
    //   processed: 'false',
    //   courier: courier,
    //   uri: profileImage.uri,
    //   type: getMimeType(profileImage.mimeType, profileImage.uri),
    //   name: profileImage.fileName,
    // }


    return order;
  }

  function calculatePriceHandler(){
    if(productData.length > 0 && courierData?.deliveryPrice){
      const productsPrice = productData.map((item) => item.itemReference.price)
      .reduce((accumulator, currentValue) => accumulator + currentValue, 0);
  
      const deliveryPrice = courierData.deliveryPrice;
  
      let totalPrice;
      if(customPrice){
        totalPrice = customPrice
      } else {
        totalPrice = productsPrice + deliveryPrice;
      }

      return {
        productsPrice: productsPrice,
        deliveryPrice: deliveryPrice,
        totalPrice: totalPrice,
      }
    }
  }

  // useEffect(() => {
  //   betterConsoleLog('> Courier data,',courierData);
  // },[courierData])
  // useEffect(() => {
  //   betterConsoleLog('> Logging product references: ', productReferences.length);
  // }, [productReferences])
  // useEffect(() => {
  //   betterConsoleLog('> Loggin buyer data: ', buyerData);
  // }, [buyerData])
  // useEffect(() => {
  //   betterConsoleLog('> Loggin product data: ', productData);
  // }, [productData])
  // useEffect(() => {
  //   console.log('> Is Reservation:', isReservation);
  // }, [isReservation])
  // useEffect(() => {
  //   console.log('> Profile image is:', profileImage);
  // }, [profileImage])

  // PRODUCT REFERENCE => References of selected items
  const setProductReferencesHandler = (productsArr: ProductTypes[]) => {
    setProductReferences(productsArr);
  }
  const addProductReferenceHandler = (product: ProductTypes) => {
    setProductReferences((prev) => [...prev, product]);
  }
  const removeProductReferenceByIndexHandler = (index: number) => {
    setProductReferences((prev) => prev.filter((_, i) => i !== index));
  };
  const getProductReferencesDataHandler = () => {
    return productReferences;
  }

  // PRODUCTS
  const setProductsDataHandler = (productsArr: OrderProductTypes[]) => {
    setProductData(productsArr);
  }
  const addProductHandler = (product: OrderProductTypes) => {
    setProductData((prev) => [...prev, product]);
  }
  const removeProductByIndexHandler = (index: number) => {
    setProductData((prev) => prev.filter((_, i) => i !== index));
  };
  const getProductsDataHandler = () => {
    return productData;
  }
  const updateProductColorByIndexHandler = (index: number, selectedColorObj: (DressColorTypes | PurseColorTypes)) => {
    setProductData((prev) => {
      const updatedProducts = [...prev]; // Clone the array
      if (updatedProducts[index]) {
        updatedProducts[index] = {
          ...updatedProducts[index],  // Keep other product fields
          selectedColor: selectedColorObj.color,
          selectedColorId: selectedColorObj._id,
        };
      }
      return updatedProducts;
    });
  };
  const updateProductSizeByIndexHandler = (index: number, selectedSizeObj: ColorSizeTypes) => {
    setProductData((prev) => {
      const updatedProducts = [...prev]; // Clone the array
      if (updatedProducts[index]) {
        updatedProducts[index] = {
          ...updatedProducts[index],  // Keep other product fields
          selectedSize: selectedSizeObj.size,
          selectedSizeId: selectedSizeObj._id,
        };
      }
      return updatedProducts;
    });
  };

  // BUYER
  const setBuyerDataHandler = (data:BuyerTypes) => {
    setBuyerData(data);
  }
  const getBuyerDataHandler = () => {
    return buyerData;
  }

  const resetOrderDataHandler = () => {
    setProductReferences([]);
    setProductData([]);
    setBuyerData({
      name: '',
      address: '',
      place: '',
      phone: '',
      phone2: '',
      bankNumber: '',
      profileImage: {
        uri: '',
        imageName: '',
      }
    });
    setIsReservation(false);
    setProfileImage(null);
    setDeliveryRemark('');
  }

  // COURIER
  function setCourierDataHandler(courierData:CourierTypes){
    setCourierData(courierData)
  }
  function getCourierDataHandler(){
    return courierData;
  }

  const value = useMemo(() => ({
    productReferences,
    setProductReferences: setProductReferencesHandler,
    addProductReference: addProductReferenceHandler,
    removeProductReference: removeProductReferenceByIndexHandler,
    getProductReferences: getProductReferencesDataHandler,
    
    productData,
    addProduct: addProductHandler,
    removeProduct: removeProductByIndexHandler,
    setProductsData: setProductsDataHandler,
    getProductsData: getProductsDataHandler,
    updateProductColorByIndex: updateProductColorByIndexHandler,
    updateProductSizeByIndex: updateProductSizeByIndexHandler,

    buyerData,
    setBuyerData: setBuyerDataHandler,
    getBuyerData: getBuyerDataHandler,

    courierData,
    setCourierData: setCourierDataHandler,
    getCourierData: getCourierDataHandler,

    isReservation,
    setIsReservation: setIsReservation,

    profileImage,
    setProfileImage: setProfileImage,
    
    resetOrderData: resetOrderDataHandler,
    createOrderHandler: createOrderHandler,

    customPrice,
    setCustomPrice: setCustomPrice,

    weight,
    setWeight: setWeight,
    orderValue,
    setOrderValue: setOrderValue,
    internalRemark,
    setInternalRemark: setInternalRemark,
    deliveryRemark,
    setDeliveryRemark: setDeliveryRemark,
    orderNote,
    setOrderNote: setOrderNote,
  }), [productData, buyerData, productReferences, courierData, isReservation, profileImage, customPrice, weight, orderValue, internalRemark, deliveryRemark, orderNote]);

  return <NewOrderContext.Provider value={value}>{ children }</NewOrderContext.Provider>
}

export default NewOrderContextProvider;