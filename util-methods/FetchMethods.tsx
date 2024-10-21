import { popupMessage } from "../util-components/PopupMessage";
import { betterConsoleLog, betterErrorLog } from "./LogMethods";

export async function fetchData(token:string, api:string) {
  try{
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/${api}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if(!response.ok){
      const parsedResponse = await response.json();
      popupMessage(parsedResponse?.message, 'danger');
      return false;
    }

    const data = await response.json();
    return data;
  } catch(error){
    console.error('There was an error while fetching data: ', error);
    popupMessage('Error while fetching data', 'danger');
  }
}

// Handles sending the POST request to add a new product | Generic method
async function handleAddingProductFetch(formData:any, authToken:string, productName:string, uri: string):Promise<boolean>{
  try{
    const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URI}/products/${uri}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    })

    if(!response.ok) {
      const parsedResponse = await response.json();
      popupMessage(parsedResponse.message, 'danger');
      return false;
    }

    popupMessage(`Proizvod pod imenom ${productName} je uspešno dodat.`, 'success');
    if(response.status === 200) return true
    return false

  } catch (error) {
    console.error('Fetch error:', error);
    betterErrorLog('Error adding new product', error);
    popupMessage(`Network error: ${error.message}`, 'danger');
    return false;
  }
}

// Handles adding new dress | Sends required data to handleAddingProductFetch
export async function addDress(dressData:any, authToken:string):Promise<boolean>{
  // Create new form to send data
  const formData = new FormData();
  formData.append('name', dressData.productName);
  formData.append('category', dressData.selectedCategory.name);
  formData.append('stockType', dressData.stockType);
  formData.append('price', dressData.price);
  formData.append('colors', JSON.stringify(dressData.itemColors));

  // Attach image
  if (dressData.productImage) {
    formData.append('image', {
      uri: dressData.productImage.uri,
      type: dressData.productImage.mimexType || 'image/jpeg',
      name: dressData.productImage.fileName || 'product_image.jpg',
    });
  }

  const result = await handleAddingProductFetch(formData, authToken, dressData.productName, 'dress');
  return result;
}

// Handles adding new dress | Sends required data to handleAddingProductFetch
export async function addPurse(purseData:any, authToken:string):Promise<boolean>{
  // Create new form to send data
  const formData = new FormData();
  formData.append('name', purseData.productName);
  formData.append('category', purseData.selectedCategory.name);
  formData.append('stockType', purseData.stockType);
  formData.append('price', purseData.price);
  formData.append('colors', JSON.stringify(purseData.itemColors));

  // Attach image
  if (purseData.productImage) {
    formData.append('image', {
      uri: purseData.productImage.uri,
      type: purseData.productImage.mimexType || 'image/jpeg',
      name: purseData.productImage.fileName || 'product_image.jpg',
    });
  }
  const result = await handleAddingProductFetch(formData, authToken, purseData.productName, 'purse');
  return result;
}