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

    // components
    buttonBackground: '#FFFFFF',
    borders: '#012340',
    navTextNormal: '#012340',
    selectedNavText: '#FFFFFF',
    selectedNavBackground: '#012340',
    deleteButton: '#FF4D5E',

    // dropdown
    dropdownSelectedBackground: '#FFE4E4',

    // nav
    tabsBackground: '#C5D5D9'
  }
  const dark = {
    // Slightly yellow white '#F8F1E5'
    // Text colors
    defaultText: '#FFFFFF', 
    whiteText: '#FFFFFF',
    
    // Dark colors
    primaryDark: '#181C14',
    secondaryDark: '#6AADCB',
    
    // Light colors
    primaryLight: '#3C3D37',
    secondaryLight: '#1E2A2D',
    highlight: '#697565',
    secondaryHighlight: '#3D2626',
    
    // Status colors
    error: '#FF4D5E',
    success: '#4CAF50',
    warning: '#FFC966',
    info: '#5B8CD9',
    
    white: '#FFFFFF',
    highlightBlue: '#8A7BFF',
    successSecondary: '#1C2E1C',

    // components
    buttonBackground: '#697565',
    borders: '#BDBDBD',
    navTextNormal: '#FFFFFF',
    selectedNavText: '#FFFFFF',
    selectedNavBackground: '#697565',
    deleteButton: '#C28E8E',

    // dropdown
    dropdownSelectedBackground: '#697565',

    // nav
    tabsBackground: '#C5D5D9'
  }

  let userCtx = {settings:{defaults:{theme: 'light'}}};
  if(UserContext){
    userCtx = useContext(UserContext);
  }
  const [styles, setStyles] = useState(light);
  useEffect(() => {
    if(userCtx?.settings?.defaults?.theme){
      switch(userCtx?.settings?.defaults?.theme){
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
    }
  }, [userCtx?.settings?.defaults?.theme]);

  return styles;
}