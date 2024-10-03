import { createContext, useEffect, useState, ReactNode, useContext } from "react";
import { AuthContext } from "./auth-context";
import { SocketContext } from "./socket-context";
import DressColor from "../models/DressColor";

interface Color {
  _id: string
  color: string
  colorCode: string
  sizes: { size: string; stock: number }[]
}
interface ColorsContextType{
  colors: Color[]
  setColors: (colors: Color[]) => void
  getColors: () => Color[]
}

export const DressColorsContext = createContext<ColorsContextType>({
  colors: [],
  setColors: () => {},
  getColors: () => []
});


interface ColorsContextProviderType {
  children: ReactNode
}
function DressColorsContextProvider({ children }:ColorsContextProviderType){
  const [colors, setColors] = useState<Color[]>([]);
  const authCtx = useContext(AuthContext);
  const token = authCtx.token;
  const socketCtx = useContext(SocketContext);
  const socket = socketCtx?.socket; 

  const setColorsHandler = (colors: Color[]) => {
    setColors(colors);
  };
  const getColorsHandler = () => {
    return colors;
  };
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
      const colorObjects: Color[] = [];
      data.forEach(entry => {
        const newColor = new DressColor(entry._id, entry.color, entry.colorCode, entry.sizes);
        colorObjects.push(newColor);
      });
      setColors(colorObjects);
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  }

  useEffect(() => {
    if(token) fetchColors(token);
  }, [token])

  useEffect(() => {
    colors.forEach(color => {
      console.log(color.color);
    });
  }, [colors])

  useEffect(() => {
    if(socket){
      const handleColorAdded = (newColor: Color) => {
        console.log('> Adding new color via socket: ', newColor.color);
        setColors(prevColors => [...prevColors, newColor]);
      };
      const handleColorRemoved = (colorId: string) => {
        console.log('> Removing color via socket: ', colorId);
        setColors(prevColors => prevColors.filter((color) => color._id !== colorId));
      }
  
      socket.on('colorAdded', handleColorAdded);
      socket.on('colorRemoved', handleColorRemoved);

      // Cleans up the listener on unmount
      // Without this we would get 2x the data as we are rendering multiple times
      return () => {
        socket.off('colorAdded', handleColorAdded);
        socket.off('colorRemoved', handleColorRemoved);
      };
    }
  }, [socket])

  const value = { colors, setColors: setColorsHandler, getColors: getColorsHandler };
  return <DressColorsContext.Provider value={value}>{children}</DressColorsContext.Provider>;
}

export default DressColorsContextProvider