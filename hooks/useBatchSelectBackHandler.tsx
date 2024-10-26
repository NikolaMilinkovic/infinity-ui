import { useEffect } from 'react';
import { BackHandler } from 'react-native';


function useBatchSelectBackHandler(isBatchActive: boolean, resetBatch: () => void){
  useEffect(() => {
    console.log('> Running batch reset')
    const backAction = () => {
      if(isBatchActive) {
        resetBatch();
        return true;
      }
      return false;
    }

    const backHandler  = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [isBatchActive, resetBatch])
}

export default useBatchSelectBackHandler;