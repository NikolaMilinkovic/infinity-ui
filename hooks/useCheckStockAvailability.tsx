import { useEffect } from 'react';
import { DressTypes, PurseTypes } from '../types/allTsTypes';

function useCheckStockAvailability(item: DressTypes | PurseTypes, setStockStatus: (status: boolean) => void) {
  useEffect(() => {
    if (!item) return;

    let stockAvailable = false;

    // Check stock based on item type
    if (item.stockType === 'Boja-Veličina-Količina') {
      const dressItem = item as DressTypes;
      stockAvailable = dressItem.colors.some((colorObj) =>
        colorObj.sizes.some((sizeObj) => sizeObj.stock > 0)
      );
    } else if (item.stockType === 'Boja-Količina') {
      const purseItem = item as PurseTypes;
      stockAvailable = purseItem.colors.some((colorObj) => colorObj.stock > 0);
    }

    setStockStatus(stockAvailable);
  }, [item, setStockStatus]);
}

export default useCheckStockAvailability;
