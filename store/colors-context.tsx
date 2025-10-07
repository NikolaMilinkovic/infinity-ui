import Constants from 'expo-constants';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import Color from '../models/Color';
import { ColorTypes } from '../types/allTsTypes';
import { sortByProperty } from '../util-methods/SortingMethods';
import { AuthContext } from './auth-context';
import { SocketContext } from './socket-context';
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface ColorsContextType {
  colors: ColorTypes[];
  setColors: (colors: ColorTypes[]) => void;
  getColors: () => ColorTypes[];
  getColorItemsForDropdownList: () => any[];
}
export const ColorsContext = createContext<ColorsContextType>({
  colors: [],
  setColors: () => {},
  getColors: () => [],
  getColorItemsForDropdownList: () => [],
});

interface ColorsContextProviderType {
  children: ReactNode;
}

/**
 * Caches all global color objects
 */
function ColorsContextProvider({ children }: ColorsContextProviderType) {
  const [colors, setColors] = useState<ColorTypes[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  const setColorsHandler = (colors: ColorTypes[]) => {
    setColors(colors);
  };
  const getColorsHandler = () => {
    return colors;
  };
  async function fetchColors(token: string) {
    try {
      const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/colors`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch colors');
      }

      const data = await response.json();
      if (data.length > 0) {
        const colorsArr = data.map((entry) => new Color(entry._id, entry.name, entry.colorCode));

        // Sort colors alphabetically by name
        const sortedColors = sortByProperty(colorsArr, 'name');

        setColors(sortedColors);
      }
      console.log('[3][colors-context] Initial fetch: true');
    } catch (error) {
      console.log('[3][colors-context] Initial fetch: false');
      console.error('Error fetching colors:', error);
    }
  }

  function getColorItemsForDropdownList() {
    const items = colors.map((item) => ({
      key: item.name,
      value: item.name,
    }));
    return items;
  }

  useEffect(() => {
    if (token) fetchColors(token);
  }, [token]);

  // SOCKETS
  useEffect(() => {
    if (socket) {
      const handleColorAdded = (newColor: Color) => {
        const newColorObj = new Color(newColor._id, newColor.name, newColor.colorCode);
        setColors((prevColors) => [...prevColors, newColorObj]);
      };
      const handleColorRemoved = (colorId: string) => {
        setColors((prevColors) => prevColors.filter((color) => color._id !== colorId));
      };
      const handleColorUpdated = (updatedColor: Color) => {
        const newColorObj = new Color(updatedColor._id, updatedColor.name, updatedColor.colorCode);
        setColors((prevColors) => prevColors.map((color) => (color._id === updatedColor._id ? newColorObj : color)));
      };

      socket.on('colorAdded', handleColorAdded);
      socket.on('colorRemoved', handleColorRemoved);
      socket.on('colorUpdated', handleColorUpdated);

      // Cleans up the listener on unmount
      // Without this we would get 2x the data as we are rendering multiple times
      return () => {
        socket.off('colorAdded', handleColorAdded);
        socket.off('colorRemoved', handleColorRemoved);
        socket.off('colorUpdated', handleColorUpdated);
      };
    }
  }, [socket]);

  const value = { colors, setColors: setColorsHandler, getColors: getColorsHandler, getColorItemsForDropdownList };
  return <ColorsContext.Provider value={value}>{children}</ColorsContext.Provider>;
}

export default ColorsContextProvider;
