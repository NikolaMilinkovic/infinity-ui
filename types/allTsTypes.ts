// IMAGE PICKER => TAKEN IMAGE DATA TYPES
export interface ProductImageTypes {
  assetId?: string | null;
  base64?: string | null;
  duration?: number | null;
  exif?: object | null;
  fileName?: string;
  fileSize?: number;
  height?: number;
  mimeType?: string;
  rotation?: number | null;
  type?: string;
  uri?: string;
  width?: number;
}

// CATEGORIES
export interface CategoryTypes {
  _id: string
  name: string
  stockType: string
}

// COLORS
export interface ColorTypes {
  _id: string
  name: string
  colorCode: string
}

// Search product component => Search Params object
export interface SearchParamsTypes {
  isOnStock: boolean
  isNotOnStock: boolean
  onStockAndSoldOut: boolean
  onCategorySearch: string
  onColorsSearch: string[]
  onSizeSearch: string[]
  active: boolean
  inactive: boolean
}


// DRESSES
export interface ImageTypes {
  uri: string;
  imageName: string;
}
export interface ColorSizeTypes {
  size: string;
  stock: number;
  _id: string;
}
export interface DressColorTypes {
  _id: string;
  color: string;
  colorCode: string;
  sizes: ColorSizeTypes[];
}
export interface DressTypes {
  _id: string;
  name: string;
  active: boolean;
  category: string;
  stockType: string;
  price: number;
  colors: DressColorTypes[];
  image: ImageTypes;
}

// PURSES
export interface PurseColorTypes{
  _id: string
  color: string
  colorCode: string
  stock: number 
}
export interface PurseTypes {
  _id: string;
  name: string;
  active: boolean;
  category: string;
  stockType: string;
  price: number;
  colors: PurseColorTypes[];
  image: ImageTypes;
}

// PURSE & DRESS TYPE
export type ProductTypes = DressTypes | PurseTypes;

export interface ProfileImageTypes {
  uri: string
  imageName: string
}

// NEW ORDER CONTEXT
export interface BuyerTypes {
  name: string
  address: string
  place: string
  phone: string | number
  phone2: string | number
  bankNumber?: string | number
  profileImage?: ProfileImageTypes
}
export interface OrderProductTypes {
  _id: string
  itemReference: ProductTypes | string;
  name: string;
  category: string;
  price: number;
  stockType: string;
  image: ImageTypes;
  mongoDB_type: string;
  selectedColor: string;
  selectedColorId: string;
  selectedSize?: string;
  selectedSizeId?: string;
  value: string
  weight: string
  internalRemark: string
  deliveryRemark: string
  orderNotes: string
}

export interface NewOrderContextTypes {
  productReferences: ProductTypes[];
  addProductReference: (product: ProductTypes) => void;
  removeProductReference: (index: number) => void;
  setProductReferences: (products: ProductTypes[]) => void;
  getProductReferences: () => ProductTypes[];

  productData: OrderProductTypes[];
  addProduct: (product: OrderProductTypes) => void;
  removeProduct: (index: number) => void;
  setProductsData: (products: OrderProductTypes[]) => void;
  getProductsData: () => OrderProductTypes[];
  updateProductColorByIndex: (index: number, selectedColorObj: (DressColorTypes | PurseColorTypes)) => void;
  updateProductSizeByIndex: (index: number, selectedSizeObj: ColorSizeTypes) => void;

  buyerData: BuyerTypes | null;
  setBuyerData: (info: BuyerTypes) => void;
  getBuyerData: () => BuyerTypes | null;
  resetOrderData: () => void;

  courierData: CourierTypes | null;
  getCourierData: () => void;
  setCourierData: (courierData: CourierTypes) => void;

  isReservation: boolean;
  setIsReservation: (isReservation:boolean) => void;

  profileImage: ProductImageTypes | null
  setProfileImage: (image:string | null) => void;
  createOrderHandler: () => void;

  customPrice: string | number
  setCustomPrice: (price: string | number) => void

  weight: string,
  setWeight: (weight: string) => void,
  orderValue: string,
  setOrderValue: (orderValue: string) => void,
  internalRemark: string,
  setInternalRemark: (internalRemark: string) => void,
  deliveryRemark: string,
  setDeliveryRemark: (deliveryRemark: string) => void,
  orderNotes: string,
  setOrderNotes: (note: string) => void,
  reservationDate: Date,
  setReservationDate: (date: Date) => void
}

export interface CourierTypes {
  _id: string
  name: string
  deliveryPrice: number
}
export interface CourierTypesWithNoId {
  name: string
  deliveryPrice: number
}

export interface OrderTypes {
  _id: string;
  buyer: BuyerTypes;
  courier?: CourierTypesWithNoId;
  products: ProductTypes[];
  productsPrice: number;
  totalPrice: number;
  reservation: boolean;
  packedIndicator: boolean;
  packed: boolean;
  processed: boolean;
  createdAt: string;
  updatedAt: string;
  value: string
  weight: string
  internalRemark: string
  deliveryRemark: string
  orderNotes: string
  reservationDate: Date
}

export interface ProcessedOrderStatisticsFileTypes {
  fileName: string;
  excellLink: string;
  courierName: string;
  numOfOrders: number;
  totalSalesValue: number;
  averageOrderValue: number;
  salesPerStockType: {
    stockType: string;
    amountSold: number;
    totalValue: number;
  }[];
  topSellingProducts: {
    id: string;
    name: string;
    amountSold: number;
  }[];
  leastSellingProducts: {
    id: string;
    name: string;
    amountSold: number;
  }[];
  numOfOrdersByCategory: {
    category: string;
    amountSold: number;
    totalValue: number;
  }[];
  perColorSold: {
    color: string;
    amountSold: number;
  }[];
  perProductStats: {
    productReference: string;
    productName: string;
    productCategory: string;
    productPrice: number;
    productTotalSalesValue: number;
    amountSold: number;
    productImage: {
      uri: string;
      imageName: string;
    };
    perSizeSold: {
      size: string;
      amountSold: number;
    }[];
    perColorSold: {
      color: string;
      amountSold: number;
    }[];
  }[];
  perLocationSales: {
    location: string;
    amountSold: number;
    totalValue: number;
  }[];
  createdAt: Date;
  updatedAt: Date;
}