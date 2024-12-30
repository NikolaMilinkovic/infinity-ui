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
  setActiveDresses((prevDresses) => {
    const updatedDresses = prevDresses.map((dress) => {
        if (dress._id.toString() === data.dressId.toString()) {
            return {
                ...dress,
                colors: dress.colors.map((color) => {
                    if (color._id.toString() === data.colorId.toString()) {
                        return {
                            ...color,
                            sizes: color.sizes.map((size) => {
                                if (size._id.toString() === data.sizeId.toString()) {
                                    return { ...size, stock: size.stock - 1 };
                                }
                                return size;
                            }),
                        };
                    }
                    return color;
                }),
            };
        }
        return dress;
    });
    return updatedDresses;
  });
};
// Function to decrease stock for a specific dress, color, and size
// export const decreaseDressStock = (
//   data: DressStockDataDecrease,
//   setActiveDresses: React.Dispatch<React.SetStateAction<DressTypes[]>>
// ) => {
// setActiveDresses((prevDresses) => {
//   console.log('> Updating dresses with data:', data);
//   return prevDresses.map((dress) => {
//     if (dress._id.toString() === data.dressId.toString()) {
//       console.log('> Found matching dress:', dress);
//       return {
//         ...dress,
//         colors: dress.colors.map((color) => {
//           if (color._id.toString() === data.colorId.toString()) {
//             console.log('> Found matching color:', color);
//             return {
//               ...color,
//               sizes: color.sizes.map((size) => {
//                 if (size._id.toString() === data.sizeId.toString()) {
//                   console.log('> Found matching size:', size);
//                   if (size.stock - data.increment >= 0) {
//                     console.log('> Decreasing stock for size:', size);
//                     return { ...size, stock: size.stock - 1};
//                   }
//                 }
//                 return size;
//               }),
//             };
//           }
//           return color;
//         }),
//       };
//     }
//     return dress;
//   });
// });
// }

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
  setActiveDresses((prevDresses) => {
    const updatedDresses = prevDresses.map((dress) => {
        if (dress._id.toString() === data.dressId.toString()) {
            return {
                ...dress,
                colors: dress.colors.map((color) => {
                    if (color._id.toString() === data.colorId.toString()) {
                        return {
                            ...color,
                            sizes: color.sizes.map((size) => {
                                if (size._id.toString() === data.sizeId.toString()) {
                                    return { ...size, stock: size.stock + 1 };
                                }
                                return size;
                            }),
                        };
                    }
                    return color;
                }),
            };
        }
        return dress;
    });
    return updatedDresses;
  });
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
  betterConsoleLog('> decreasePurseStock method has received following data', data);
  setActivePurses((prevPurses) =>
    prevPurses.map((purse) => {
      if (purse._id.toString() === data.purseId.toString()) {
        return {
          ...purse,
          colors: purse.colors.map((color) => {
            if (color._id.toString() === data.colorId.toString()) {
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
      if (purse._id.toString() === data.purseId.toString()) {
        betterConsoleLog('> Purse found', purse);
        return {
          ...purse,
          colors: purse.colors.map((color) => {
            if (color._id.toString() === data.colorId.toString()) {
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
      const itemIndex = remainingData.findIndex(d => d.dressId.toString() === dress._id.toString());
      if (itemIndex !== -1) {
        const itemData = remainingData[itemIndex];
        // Increment stock for the matching dress
        remainingData.splice(itemIndex, 1); // Remove processed ID

        return {
          ...dress,
          colors: dress.colors.map((color) => {
            if (color._id.toString() === itemData.colorId.toString() && color.sizes) {
              return {
                ...color,
                sizes: color.sizes.map((size) =>
                  size._id.toString() === itemData.sizeId.toString()
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
      const itemIndex = remainingData.findIndex(d => d.dressId.toString() === dress._id.toString());
      if (itemIndex !== -1) {
        const itemData = remainingData[itemIndex];
        // Increment stock for the matching dress
        remainingData.splice(itemIndex, 1); // Remove processed ID

        return {
          ...dress,
          colors: dress.colors.map((color) => {
            if (color._id.toString() === itemData.colorId.toString() && color.sizes) {
              return {
                ...color,
                sizes: color.sizes.map((size) =>
                  size._id.toString() === itemData.sizeId.toString()
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
      const itemIndex = remainingData.findIndex(d => d.purseId.toString() === purse._id.toString());

      if (itemIndex !== -1) {
        const itemData = remainingData[itemIndex];
        remainingData.splice(itemIndex, 1); // Remove processed ID from array

        return {
          ...purse,
          colors: purse.colors.map((color) => {
            if (color._id.toString() === itemData.colorId.toString()) {
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
      const itemIndex = remainingData.findIndex(d => d.purseId.toString() === purse._id.toString());

      if (itemIndex !== -1) {
        const itemData = remainingData[itemIndex];
        remainingData.splice(itemIndex, 1); // Remove processed ID from array

        return {
          ...purse,
          colors: purse.colors.map((color) => {
            if (color._id.toString() === itemData.colorId.toString()) {
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