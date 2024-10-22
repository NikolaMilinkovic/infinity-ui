import { popupMessage } from "../util-components/PopupMessage";
interface BuyerDataObjectTypes {
  name: string
  address: string
  phone: number
}


export const handleBuyerDataInputSort = async(authToken:string, buyerInfo:string, setBuyerDataObject:(data:BuyerDataObjectTypes) => void) => {
  if(buyerInfo.trim() === ''){
    popupMessage('Morate uneti podatke o kupcu','danger')
    return;
  }
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/orders/parse`, {
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
    setBuyerDataObject({
      name: parsedResponse.data.name,
      address: parsedResponse.data.address,
      phone: parsedResponse.data.phone,
    });
    popupMessage(parsedResponse.message, 'success')
    return true;

  } catch(error) {
    console.error(error);
    popupMessage('Došlo je do problema prilikom sortiranja podataka', 'danger');
    throw new Error('Došlo je do problema prilikom sortiranja podataka');
  }
}