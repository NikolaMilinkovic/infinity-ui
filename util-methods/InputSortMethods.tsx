import { NewOrderContextTypes } from "../types/allTsTypes";
import { popupMessage } from "../util-components/PopupMessage";
import Constants from 'expo-constants';
import { betterConsoleLog } from "./LogMethods";
const backendURI = Constants.expoConfig?.extra?.backendURI;
interface BuyerDataObjectTypes {
  name: string
  address: string
  place: string
  phone: number
  phone2: number
}


export const handleBuyerDataInputSort = async(authToken:string, buyerInfo:string, orderCtx: NewOrderContextTypes) => {
  if(buyerInfo.trim() === ''){
    popupMessage('Morate uneti podatke o kupcu','danger')
    return;
  }
  try {
    const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/orders/parse`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderData: buyerInfo })
    })

    // Handle errors
    if (!response.ok) {
      const parsedResponse = await response.json();
      popupMessage(parsedResponse.message, 'danger');
      return false;
    }
    const parsedResponse = await response.json();
    orderCtx.setBuyerData({
      name: parsedResponse.data.name || '',
      address: parsedResponse.data.address || '',
      place: parsedResponse.data.place || '',
      phone: parsedResponse.data.phone || '',
      phone2: parsedResponse.data.phone2 || '',
    });
    orderCtx.setDeliveryRemark(parsedResponse.data.orderNotes || '');
    popupMessage(parsedResponse.message, 'success');
    return true;

  } catch(error) {
    console.error(error);
    popupMessage('Došlo je do problema prilikom sortiranja podataka', 'danger');
    throw new Error('Došlo je do problema prilikom sortiranja podataka');
  }
}