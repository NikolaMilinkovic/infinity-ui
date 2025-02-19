import React, { useContext } from 'react'
import { UserContext } from '../store/user-context'
import en from '../languages/en.json';
import srb from '../languages/srb.json';

/**
 * Returns texts for provided screen based on currently active language
 * @param screen Name of the screen that we are fetching texts for
 * @returns Json file that contains all the texts for the provided screen, returns texts in currently active language
 */
function useTextForActiveLanguage(screen: string){
  const { settings } = useContext(UserContext);
  let activeLang = settings?.language;
  if(!settings?.language) activeLang = 'en';

  // Languages
  if(activeLang === 'srb') return (srb.screens as Record<string, any>)?.[screen] || {};
  if(activeLang === 'en') return (en.screens as Record<string, any>)?.[screen] || {};

  // Defaul case
  return (srb.screens as Record<string, any>)?.[screen] || {};
}

export default useTextForActiveLanguage;