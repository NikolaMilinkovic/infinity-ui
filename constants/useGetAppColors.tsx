import { useContext, useEffect, useState } from "react"
import { UserContext } from "../store/user-context"
import { AppColors } from "../types/allTsTypes";

export function useGetAppColors(): AppColors{
  const light = {

    // Text colors
    defaultText: '#000000',
    whiteText: '#F0F0F0',
  
    // Dark colors
    primaryDark: '#012340',
    secondaryDark: '#024059',
  
    // Light colors
    primaryLight: '#F0F0F0',
    secondaryLight: '#C5D5D9',
    highlight: '#C28E8E',
    secondaryHighlight: '#FFE4E4',
  
    // Error red
    error: '#DC143C',
    success: '#218838',
    warning: '#FFB74D',
    info: '#001F54',
  
    white: '#FFFFFF',
    highlightBlue: '#6A5ACD',
    successSecondary: '#F0FAF0',
  }
  const dark = {
    // Text colors
    defaultText: '#F0F0F0',  // Light text for dark background
    whiteText: '#F0F0F0',    // Keeping this consistent since it's already light
    
    // Dark colors (now become light in dark theme)
    primaryDark: '#A3C1D9',  // Lighter blue shade
    secondaryDark: '#6AADCB', // Mid-tone blue for contrast
    
    // Light colors (now become dark in dark theme)
    primaryLight: '#121212',  // Very dark gray for main background
    secondaryLight: '#1E2A2D', // Dark blue-gray for secondary background
    highlight: '#D9A3A3',     // Slightly lighter version of your highlight
    secondaryHighlight: '#3D2626', // Darker red tone
    
    // Status colors - slightly adjusted for dark theme visibility
    error: '#FF4D5E',         // Brighter red for visibility
    success: '#4CAF50',       // Brighter green
    warning: '#FFC966',       // Slightly brighter orange
    info: '#5B8CD9',          // Lighter blue for info
    
    white: '#121212',         // This becomes your "black" equivalent
    highlightBlue: '#8A7BFF', // Slightly brighter purple
    successSecondary: '#1C2E1C' // Dark green background
  }

  const userCtx = useContext(UserContext);
  const [styles, setStyles] = useState(light);
  useEffect(() => {
    switch(userCtx.settings.defaults.theme){
      case 'light':
        setStyles(light);
      break;
      case 'dark':
        setStyles(dark);
      break;
      default:
        setStyles(light);
      break;
    }
  }, [userCtx.settings.defaults.theme]);

  return styles;
}