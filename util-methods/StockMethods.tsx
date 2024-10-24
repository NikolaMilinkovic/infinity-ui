import { DressTypes, PurseTypes } from "../types/allTsTypes";

interface DressStockData {
  dressId: string,
  colorId: string,
  sizeId: string,
  decrement: number,
}
// Function to decrease stock for a specific dress, color, and size
export const decreaseDressStock = (
  data: DressStockData,
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
                  size._id === data.sizeId && size.stock - data.decrement >= 0
                    ? { ...size, stock: size.stock - data.decrement }
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

interface PurseStockData {
  purseId: string,
  colorId: string,
  decrement: number,
}
// Function to decrease stock for a specific purse, color
export const decreasePurseStock = (
  data: PurseStockData,
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
                stock: color.stock - data.decrement >= 0 ? color.stock - data.decrement : color.stock,
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


