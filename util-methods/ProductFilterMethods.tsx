import { betterConsoleLog } from "./LogMethods";
import { ColorSizeTypes, DressTypes, PurseTypes } from "../types/allTsTypes";
type ProductType = DressTypes | PurseTypes;
interface SearchParamsType {
  isOnStock: boolean
  isNotOnStock: boolean
  onStockAndSoldOut: boolean
  onCategorySearch: string
  onColorsSearch: string[]
  onSizeSearch: string[]
}

export function serachProducts(searchData: string, allActiveProducts: ProductType[], searchParams: SearchParamsType){
  if(allActiveProducts === undefined) return [];
  if(allActiveProducts.length === 0) return [];
  // Search items by Name
  let nameBasedSearch = allActiveProducts;
  if(searchData){
    nameBasedSearch = searchItemsByName(allActiveProducts, searchData);
  }

  // Filter by categories
  let categoriesBasedSearch = nameBasedSearch;
  if(searchParams.onCategorySearch){
    console.log(searchParams.onCategorySearch);
    categoriesBasedSearch = filterByCategories(nameBasedSearch, searchParams.onCategorySearch)
  }

  betterConsoleLog('> Category filter returns:', categoriesBasedSearch);

  // Filter by color
  let colorBasedSearch = categoriesBasedSearch;
  if(searchParams.onColorsSearch.length > 0){
    colorBasedSearch = filterByColor(categoriesBasedSearch, searchParams.onColorsSearch);
  }

  // Filter by availability [on stock & sold out]
  let stockFilteredResults = colorBasedSearch
  if(colorBasedSearch.length > 0){
    stockFilteredResults = colorBasedSearch.filter((result: ProductType) => {
      if(searchParams.onStockAndSoldOut) return true
      if(searchParams.isOnStock) return showItemsOnStock(result)
      if(searchParams.isNotOnStock) return showItemsNotOnStock(result)
  
      return true;
    });
  }

  // Filter by size available stock
  let sizeFilteredResults = stockFilteredResults
  if(stockFilteredResults.length > 0){
    sizeFilteredResults = stockFilteredResults.filter((result: ProductType) => {
      if(searchParams.onSizeSearch.length > 0){
        return searchItemsBySize(result, searchParams.onSizeSearch);
      }
      return true;
    })
  }
  
  return sizeFilteredResults;
}

// Search by inserted name compares inserted query with [Item Name, Item Colors]
export function searchItemsByName(allActiveProducts: any, searchData: string){
  const nameBasedSearch = allActiveProducts.filter((item: ProductType) =>
    item.name.toLowerCase().includes(searchData.toLowerCase())
  )
  const colorBasedSearch = allActiveProducts.filter((item: any) =>
    item.colors.some((colorObj: any) => 
      colorObj.color.toLowerCase().includes(searchData.toLowerCase())
    )
  );
  return [...new Set([...nameBasedSearch, ...colorBasedSearch])];
}

// FILTER FOR ITEMS ON STOCK
export function showItemsOnStock(result: ProductType) {

  // PURSES 
  if (result.stockType === 'Boja-Veličina-Količina') {
    return result.colors.some((colorObj: any) =>
      colorObj.sizes.some((sizeObj: ColorSizeTypes) => sizeObj.stock > 0)
    );
 
  // DRESSES
  } else if (result.stockType === 'Boja-Količina') {
    return result.colors.some((colorObj: any) => colorObj.stock > 0);

  // REST
  } else {
    return result.colors.some((colorObj: any) =>
      colorObj.sizes.some((sizeObj: ColorSizeTypes) => sizeObj.stock > 0)
    );
  }
}

// FILTER FOR ITEMS NOT ON STOCK
export function showItemsNotOnStock(result: ProductType) {

// PURSES 
if (result.stockType === 'Boja-Veličina-Količina') {
  return result.colors.every((colorObj: any) =>
    colorObj.sizes.every((sizeObj: ColorSizeTypes) => sizeObj.stock === 0)
  );

// DRESSES
} else if (result.stockType === 'Boja-Količina') {
  return result.colors.every((colorObj: any) => colorObj.stock === 0);

// REST
} else {
  return result.colors.every((colorObj: any) =>
    colorObj.sizes.every((sizeObj: ColorSizeTypes) => sizeObj.stock === 0)
  );
}
}

// FILTER FOR ITEMS ON CATEGORY
export function filterByCategories(allActiveProducts:any, category:string){
  const categoriesBasedSearch = allActiveProducts.filter((item: any) => 
    item.category === category
  )
  return categoriesBasedSearch;
}

// METHOD FOR FILTERING BY COLOR
export function filterByColor(allActiveProducts: any, searchData: string[]) {
  const colorBasedSearch = allActiveProducts.filter((item: any) =>
    item.colors.some((colorObj: any) =>
      searchData.some((searchColor) =>
        colorObj.color.toLowerCase().includes(searchColor.toLowerCase())
      )
    )
  );
  return colorBasedSearch;
}

// METHOD FOR FILTERING BY ITEMS SIZES THAT ARE ON STOCK
function searchItemsBySize(product: ProductType, searchSizes: string[]): boolean {
  if ('sizes' in product.colors[0]) {
    const matches =  product.colors.some((colorObj: any) =>
      colorObj.sizes.some((sizeObj: ColorSizeTypes) => 
        searchSizes.includes(sizeObj.size) && sizeObj.stock > 0
      )
    );
    betterConsoleLog('> Matches with UNI are', matches);
    return matches
  }
  return false;
}