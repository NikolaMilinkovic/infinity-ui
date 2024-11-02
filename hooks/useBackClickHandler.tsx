import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * This method runs only if clickPreventer is true
 * If clickPreventer is true > Prevents next back click and runs
 * onPreventHandler > method that runs when click is prevented
 */
function useBackClickHandler(clickPreventer: boolean, onPreventHandler: () => void){
  useEffect(() => {
    const backAction = () => {
      if(clickPreventer) {
        onPreventHandler();
        return true;
      }
      return false;
    }

    const backHandler  = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [clickPreventer, onPreventHandler])
}

export default useBackClickHandler;