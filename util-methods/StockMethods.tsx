import { useContext } from "react";
import { DressTypes, PurseTypes } from "../types/allTsTypes";
import { betterConsoleLog } from "./LogMethods";
import { DressesContext } from "../store/dresses-context";
import { PursesContext } from "../store/purses-context";

interface DressStockDataDecrease {
  dressId: string,
  colorId: string,
  sizeId: string,
  increment: number,
}
// Function to decrease stock for a specific dress, color, and size
export const decreaseDressStock = (
  data: DressStockDataDecrease,
  setActiveDresses: React.Dispatch<React.SetStateAction<DressTypes[]>>
) => {
  setActiveDresses((prevDresses) =>
    prevDresses.map((dress) => {
      if (dress._id === data.dressId) {
        return {
          ...dress,
          colors: dress.colors.map((color) => {
            if (color._id === data.colorId && color.sizes && color.sizes.length > 0) {
              return {
                ...color,
                sizes: color.sizes.map((size) =>
                  size._id === data.sizeId && size.stock - data.increment >= 0
                    ? { ...size, stock: size.stock - data.increment }
                    : size
                ),
              };
            }
            return color;
          }),
        };
      }
      return dress;
    })
  );
};

interface DressStockDataIncrease {
  dressId: string,
  colorId: string,
  sizeId: string,
  increment: number,
}

// Increase stock for a specific dress, color, and size
export const increaseDressStock = (
  data: DressStockDataIncrease,
  setActiveDresses: React.Dispatch<React.SetStateAction<DressTypes[]>>
) => {
  console.log('> Increasing active dresses by 1')
  setActiveDresses((prevDresses) =>
    prevDresses.map((dress) => {
      if (dress._id === data.dressId) {
        return {
          ...dress,
          colors: dress.colors.map((color) => {
            if (color._id === data.colorId && color.sizes) {
              return {
                ...color,
                sizes: color.sizes.map((size) =>
                  size._id === data.sizeId
                    ? { ...size, stock: size.stock + data.increment }
                    : size
                ),
              };
            }
            return color;
          }),
        };
      }
      return dress;
    })
  );
};


interface PurseStockDataDecrease {
  purseId: string,
  colorId: string,
  increment: number,
}
// Function to decrease stock for a specific purse, color
export const decreasePurseStock = (
  data: PurseStockDataDecrease,
  setActivePurses: React.Dispatch<React.SetStateAction<PurseTypes[]>>
) => {
  setActivePurses((prevPurses) =>
    prevPurses.map((purse) => {
      if (purse._id === data.purseId) {
        return {
          ...purse,
          colors: purse.colors.map((color) => {
            if (color._id === data.colorId) {
              return {
                ...color,
                stock: color.stock - data.increment >= 0 ? color.stock - data.increment : color.stock,
              };
            }
            return color;
          }),
        };
      }
      return purse;
    })
  );
};


interface PurseStockDataIncrease {
  purseId: string,
  colorId: string,
  increment: number,
}

// Function to increase stock for a specific purse, color
export const increasePurseStock = (
  data: PurseStockDataIncrease,
  setActivePurses: React.Dispatch<React.SetStateAction<PurseTypes[]>>
) => {
  console.log('> Increasing active purses by 1')
  betterConsoleLog('> Logging out data object', data);
  setActivePurses((prevPurses) =>
    prevPurses.map((purse) => {
      if (purse._id === data.purseId) {
        betterConsoleLog('> Purse found', purse);
        return {
          ...purse,
          colors: purse.colors.map((color) => {
            if (color._id === data.colorId) {
              betterConsoleLog('> Color obj found', color);
              return {
                ...color,
                stock: color.stock + data.increment,
              };
            }
            return color;
          }),
        };
      }
      return purse;
    })
  );
};


export const increaseDressBatchStock = (
  data: DressStockDataIncrease[],
  setActiveDresses: React.Dispatch<React.SetStateAction<DressTypes[]>>
) => {
  console.log('> Increasing active dresses by 1 for multiple items');

  setActiveDresses((prevDresses) => {
    // Loop over each dress ID in data array until no more IDs are left
    let remainingData = [...data];

    return prevDresses.map((dress) => {
      const itemIndex = remainingData.findIndex(d => d.dressId === dress._id);
      if (itemIndex !== -1) {
        const itemData = remainingData[itemIndex];
        // Increment stock for the matching dress
        remainingData.splice(itemIndex, 1); // Remove processed ID

        return {
          ...dress,
          colors: dress.colors.map((color) => {
            if (color._id === itemData.colorId && color.sizes) {
              return {
                ...color,
                sizes: color.sizes.map((size) =>
                  size._id === itemData.sizeId
                    ? { ...size, stock: size.stock + itemData.increment }
                    : size
                ),
              };
            }
            return color;
          }),
        };
      }

      return dress;
    });
  });
};

export const decreaseDressBatchStock = (
  data: DressStockDataIncrease[],
  setActiveDresses: React.Dispatch<React.SetStateAction<DressTypes[]>>
) => {
  console.log('> Increasing active dresses by 1 for multiple items');

  setActiveDresses((prevDresses) => {
    // Loop over each dress ID in data array until no more IDs are left
    let remainingData = [...data];

    return prevDresses.map((dress) => {
      const itemIndex = remainingData.findIndex(d => d.dressId === dress._id);
      if (itemIndex !== -1) {
        const itemData = remainingData[itemIndex];
        // Increment stock for the matching dress
        remainingData.splice(itemIndex, 1); // Remove processed ID

        return {
          ...dress,
          colors: dress.colors.map((color) => {
            if (color._id === itemData.colorId && color.sizes) {
              return {
                ...color,
                sizes: color.sizes.map((size) =>
                  size._id === itemData.sizeId
                    ? { ...size, stock: size.stock - itemData.increment }
                    : size
                ),
              };
            }
            return color;
          }),
        };
      }

      return dress;
    });
  });
};


interface PurseStockDataIncrease {
  purseId: string;
  colorId: string;
  increment: number;
}

// Function to increase stock for multiple purses
export const increasePurseBatchStock = (
  data: PurseStockDataIncrease[],
  setActivePurses: React.Dispatch<React.SetStateAction<PurseTypes[]>>
) => {
  console.log('> Increasing active purses by increments for multiple items');

  setActivePurses((prevPurses) => {
    let remainingData = [...data]; // Create a copy to keep track of unprocessed IDs

    return prevPurses.map((purse) => {
      const itemIndex = remainingData.findIndex(d => d.purseId === purse._id);

      if (itemIndex !== -1) {
        const itemData = remainingData[itemIndex];
        remainingData.splice(itemIndex, 1); // Remove processed ID from array

        return {
          ...purse,
          colors: purse.colors.map((color) => {
            if (color._id === itemData.colorId) {
              console.log('> Color object found for increment', color);
              return {
                ...color,
                stock: color.stock + itemData.increment,
              };
            }
            return color;
          }),
        };
      }

      return purse;
    });
  });
};

export const decreasePurseBatchStock = (
  data: PurseStockDataIncrease[],
  setActivePurses: React.Dispatch<React.SetStateAction<PurseTypes[]>>
) => {
  console.log('> Increasing active purses by increments for multiple items');

  setActivePurses((prevPurses) => {
    let remainingData = [...data]; // Create a copy to keep track of unprocessed IDs

    return prevPurses.map((purse) => {
      const itemIndex = remainingData.findIndex(d => d.purseId === purse._id);

      if (itemIndex !== -1) {
        const itemData = remainingData[itemIndex];
        remainingData.splice(itemIndex, 1); // Remove processed ID from array

        return {
          ...purse,
          colors: purse.colors.map((color) => {
            if (color._id === itemData.colorId) {
              console.log('> Color object found for increment', color);
              return {
                ...color,
                stock: color.stock - itemData.increment,
              };
            }
            return color;
          }),
        };
      }

      return purse;
    });
  });
};

interface PurseStockDataIncrease {
  purseId: string,
  colorId: string,
  increment: number,
}
interface DressStockDataIncrease {
  dressId: string,
  colorId: string,
  sizeId: string,
  increment: number,
}
interface DataArrPropTypes {
  dresses: DressStockDataIncrease[]
  purses: PurseStockDataIncrease[]
}
// const dressesCtx = useContext(DressesContext);
// const pursesCtx = useContext(PursesContext);
// export const batchProductStockIncrease = (
//   data : DataArrPropTypes,
//   setAllActiveProducts: React.Dispatch<React.SetStateAction<PurseTypes[]>>,
//   dressesCtx,
//   pursesCtx,
// ) => {

//   // Handle dresses
//   if(data.dresses.length > 0){
//     data.dresses.forEach(dress => {
//       increaseDressStock(dress, dressesCtx.setActiveDresses)
//     });
//     // betterConsoleLog('> Logging dresses ctx length', dressesCtx.activeDresses.length);
//     // console.log(`> increaseDressBatchStock called, looping over ${data.dresses.length} items.`)
//     // increaseDressBatchStock(data.dresses, dressesCtx.setActiveDresses);
//     // betterConsoleLog('> Logging dresses ctx length', dressesCtx.activeDresses.length);
//   }
//   if(data.purses.length > 0) {
//     console.log(`> increasePurseBatchStock called, looping over ${data.purses.length} items.`)
//     increasePurseBatchStock(data.purses, pursesCtx.setActivePurses);
//   }
//   // betterConsoleLog('> Logging data Arr',data);
//   // for(const item of dataArr){
//     // betterConsoleLog('> Logging item', item);
//   // }
// }