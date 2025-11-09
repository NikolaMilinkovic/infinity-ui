import en from '../languages/en.json';
import srb from '../languages/srb.json';
import { useUser } from '../store/user-context';

/**
 * Returns texts for provided component based on currently active language
 * @param screen Name of the component that we are fetching texts for
 * @returns Json file that contains all the texts for the provided component, returns texts in currently active language
 */
function useTextForComponent(componentName: string) {
  const { user } = useUser();
  let activeLang = user?.settings?.language;
  if (!user?.settings?.language) activeLang = 'en';

  // Languages
  if (activeLang === 'srb') return (srb.component as Record<string, any>)?.[componentName] || {};
  if (activeLang === 'en') return (en.component as Record<string, any>)?.[componentName] || {};

  // Defaul case
  return (srb.component as Record<string, any>)?.[componentName] || {};
}

export default useTextForComponent;
