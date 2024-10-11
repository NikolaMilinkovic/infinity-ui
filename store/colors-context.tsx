import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import Color from "../models/Color";

interface ColorType{
  _id: string
  name: string
  colorCode: string
}

interface ColorsContextType{
  colors: ColorType[]
  setColors: (colors: ColorType[]) => void
  getColors: () => ColorType[]
}
export const ColorsContext = createContext<ColorsContextType>({
  colors: [],
  setColors: () => {},
  getColors: () => []
});

interface ColorsContextProviderType {
  children: ReactNode
}
function ColorsContextProvider({ children }: ColorsContextProviderType){
  const [colors, setColors] = useState<ColorType[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket;

  const setColorsHandler = (colors: ColorType[]) => {
    setColors(colors);
  }
  const getColorsHandler = () => {
    return colors;
  }
  async function fetchColors(token:string){
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/colors`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch colors');
      }

      const data = await response.json();
      if(data.length > 0){
        const colorsArr: ColorType[] = [];
        data.forEach(entry => {
          const newColor = new Color(
            entry._id,
            entry.name,
            entry.colorCode
          )
          colorsArr.push(newColor);
        });
        setColors(colorsArr);
      }
      
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  }

  useEffect(() => {
    if(token) fetchColors(token);
  }, [token])

  // SOCKETS
  useEffect(() => {
    if(socket){
      const handleColorAdded = (newColor: Color) => {
        const newColorObj = new Color(
          newColor._id,
          newColor.name,
          newColor.colorCode
        )
        console.log('> Adding new color via socket: ', newColor.name);
        setColors(prevColors => [...prevColors, newColorObj]);
      };
      const handleColorRemoved = (colorId: string) => {
        console.log('> Removing color via socket: ', colorId);
        setColors(prevColors => prevColors.filter((color) => color._id !== colorId));
      }
      const handleColorUpdated = (updatedColor: Color) => {
        console.log('> Updating color via socket: ', updatedColor._id);
        const newColorObj = new Color(
          updatedColor._id,
          updatedColor.name,
          updatedColor.colorCode
        );
        setColors(prevColors => 
          prevColors.map(color => 
            color._id === updatedColor._id ? newColorObj : color
          )
        );
      }
  
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

  const value = { colors, setColors: setColorsHandler, getColors: getColorsHandler };
  return <ColorsContext.Provider value={value}>{children}</ColorsContext.Provider>;
}

export default ColorsContextProvider