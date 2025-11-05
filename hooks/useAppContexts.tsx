import { useContext } from 'react';
import { AllProductsContext } from '../store/all-products-context';
import { AppContext } from '../store/app-context';
import { CategoriesContext } from '../store/categories-context';
import { ColorsContext } from '../store/colors-context';
import { CouriersContext } from '../store/couriers-context';
import { OrderStatisticsContext } from '../store/end-of-day-statistics';
import { OrdersContext } from '../store/orders-context';
import { SuppliersContext } from '../store/suppliers-context';
import { UserContext } from '../store/user-context';

interface UseAppContextsTypes {
  app: any;
  user: any;
  orders: any;
  colors: any;
  categories: any;
  couriers: any;
  allProducts: any;
  suppliers: any;
  processedOrdersForPeriod: any;
}

export function useAppContexts(): UseAppContextsTypes {
  return {
    app: useContext(AppContext),
    user: useContext(UserContext),
    orders: useContext(OrdersContext),
    colors: useContext(ColorsContext),
    categories: useContext(CategoriesContext),
    couriers: useContext(CouriersContext),
    allProducts: useContext(AllProductsContext),
    suppliers: useContext(SuppliersContext),
    processedOrdersForPeriod: useContext(OrderStatisticsContext),
  };
}
