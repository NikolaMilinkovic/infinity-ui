import { useContext } from "react"
import { ColorsContext } from "../store/colors-context"
import { CategoriesContext } from "../store/categories-context"
import { CouriersContext } from "../store/couriers-context"
import { DressesContext } from "../store/dresses-context"
import { AllProductsContext } from "../store/all-products-context"
import { SuppliersContext } from "../store/suppliers-context"
import { OrderStatisticsContext } from "../store/end-of-day-statistics"
import { OrdersContext } from "../store/orders-context"

interface UseAppContextsTypes {
  orders: any
  colors: any
  categories: any
  couriers: any
  dresses: any
  allProducts: any
  suppliers: any
  processedOrdersForPeriod: any
}

export function useAppContexts(): UseAppContextsTypes{
  
  return {
    orders: useContext(OrdersContext),
    colors: useContext(ColorsContext),
    categories: useContext(CategoriesContext),
    couriers: useContext(CouriersContext),
    dresses: useContext(DressesContext),
    allProducts: useContext(AllProductsContext),
    suppliers: useContext(SuppliersContext),
    processedOrdersForPeriod: useContext(OrderStatisticsContext)
  }
}