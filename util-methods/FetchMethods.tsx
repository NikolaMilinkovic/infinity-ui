import Constants from 'expo-constants';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { popupMessage } from '../util-components/PopupMessage';
import { betterErrorLog } from './LogMethods';
const backendURI = Constants.expoConfig?.extra?.backendURI;

let authContextInstance: any;

export function initializeAuthContext(authCtx: any) {
  authContextInstance = authCtx;
}
export function handleUnauthorized() {
  if (!authContextInstance) {
    throw new Error('Auth context not initialized');
  }
  authContextInstance.logout();
}

/**
 * @param token - Authentication token
 * @param api - API Address
 * @returns - Response data or false if !response.ok
 */
export async function fetchData(token: string | null, api: string, method: string = 'GET') {
  try {
    if (token === null) return popupMessage('Auth token nedostaje kako bi se izvršio fetch.', 'danger');

    const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/${api}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) return handleUnauthorized();
      const parsedResponse = await response.json();
      popupMessage(parsedResponse?.message, 'danger');
      return false;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('There was an error while fetching data: ', error);
    popupMessage('Error while fetching data', 'danger');
    return false;
  }
}

// Handles sending the POST request to add a new product | Generic method
async function handleAddingProductFetch(
  formData: any,
  authToken: string,
  productName: string,
  uri: string
): Promise<boolean> {
  try {
    const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/products/${uri}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      if (response.status === 401) {
        handleUnauthorized();
        return false;
      }
      const parsedResponse = await response.json();
      popupMessage(parsedResponse.message, 'danger');
      return false;
    }

    popupMessage(`Proizvod pod imenom ${productName} je uspešno dodat.`, 'success');
    if (response.status === 200) return true;
    return false;
  } catch (error) {
    console.error('Fetch error:', error);
    betterErrorLog('Error adding new product', error);
    popupMessage(`Network error: ${error.message}`, 'danger');
    return false;
  }
}

// Handles adding new dress | Sends required data to handleAddingProductFetch
export async function addDress(dressData: any, authToken: string): Promise<boolean> {
  // Create new form to send data
  const formData = new FormData();
  formData.append('name', dressData.productName);
  formData.append('category', dressData.selectedCategory.name);
  formData.append('stockType', dressData.stockType);
  formData.append('price', dressData.price);
  formData.append('colors', JSON.stringify(dressData.itemColors));
  formData.append('description', dressData.description);
  formData.append('supplier', dressData.supplier);

  // Attach image
  if (dressData.productImage) {
    formData.append('image', {
      uri: dressData.productImage.uri,
      type: dressData.productImage.mimeType || 'image/jpeg',
      name: dressData.productImage.fileName || 'product_image.jpg',
    });
  }

  const result = await handleAddingProductFetch(formData, authToken, dressData.productName, 'dress');
  return result;
}

// Handles adding new dress | Sends required data to handleAddingProductFetch
export async function addPurse(purseData: any, authToken: string): Promise<boolean> {
  // Create new form to send data
  const formData = new FormData();
  formData.append('name', purseData.productName);
  formData.append('category', purseData.selectedCategory.name);
  formData.append('stockType', purseData.stockType);
  formData.append('price', purseData.price);
  formData.append('colors', JSON.stringify(purseData.itemColors));
  formData.append('description', purseData.description);
  formData.append('supplier', purseData.supplier);

  // Attach image
  if (purseData.productImage) {
    formData.append('image', {
      uri: purseData.productImage.uri,
      type: purseData.productImage.mimeType || 'image/jpeg',
      name: purseData.productImage.fileName || 'product_image.jpg',
    });
  }
  const result = await handleAddingProductFetch(formData, authToken, purseData.productName, 'purse');
  return result;
}

// NEW ORDER ADD METHOD
export async function addNewOrder(formData: any, authToken: string, uri: string) {
  try {
    const response = await handleFetchingWithFormData(formData, authToken, uri, 'POST');

    if (!response) {
      popupMessage('Došlo je do problema prilikom dodavanja porudžbine', 'danger');
      return false;
    }
    return response;
  } catch (error) {
    popupMessage('Došlo je do problema prilikom dodavanja porudžbine', 'danger');
    console.error('Network error details:', {
      message: error.message,
      stack: error.stack,
      details: error.toString(),
    });
    throw error;
  }
}

// GENERIC FETCHING METHOD WITH FORM DATA
export async function handleFetchingWithFormData(formData: any, authToken: string, uri: string, method: string) {
  try {
    const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/${uri}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: 'application/json',
        'content-type': 'multipart/form-data',
      },
      body: formData,
    });

    return response;
  } catch (error) {
    console.error('Network error details:', {
      message: error.message,
      stack: error.stack,
      details: error.toString(),
    });
    throw error;
  }
}
// 'Content-Type': 'multipart/form-data'

// GENERIC FETCHING METHOD WITH FORM DATA
export async function handleFetchingWithBodyData(
  data: any,
  authToken: string,
  uri: string,
  method: string
): Promise<any> {
  try {
    const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/${uri}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) return handleUnauthorized();
    return response;
  } catch (error) {
    betterErrorLog('Error adding new order', error);
    return popupMessage('Došlo je do problema prilikom izvršavanja zahteva', 'danger');
  }
}

// CATEGORIES FETCH
export async function fetchCategories(token: string | null) {
  try {
    const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/categories`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      if (response.status === 401) return handleUnauthorized();
      throw new Error('Failed to fetch categories');
    }

    const data = await response.json();
    if (data.length > 0) {
      return data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

export async function fetchWithBodyData(token: string | null, api: string, data: any, method = 'POST') {
  try {
    const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/${api}`, {
      method: method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.status === 401) return handleUnauthorized();
    return response;
  } catch (error) {
    console.error('Error fetching with body data:', error);
  }
}

export async function downloadAndShareFileViaLink(name: string, link: string) {
  try {
    const fileName = name || 'default.xlsx';
    const targetPath = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.downloadAsync(link, targetPath);

    // Open share dialog
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(targetPath);
    } else {
      console.log('Sharing not supported on this platform.');
    }
  } catch (error) {
    console.error('Error sharing file:', error);
  }
}

/**
 * Creates the File and opens sharing on mobile device
 * @param name String representation of file name
 * @param fileData Base64 encoded file data
 */
export async function downloadAndShareFile(name: string, fileData: string) {
  try {
    const fileName = name || 'default.xlsx';
    const targetPath = `${FileSystem.documentDirectory}${fileName}`;

    // Write the Base64 data as a file
    await FileSystem.writeAsStringAsync(targetPath, fileData, { encoding: FileSystem.EncodingType.Base64 });

    // Open the share dialog
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(targetPath);
    } else {
      console.log('Sharing not supported on this platform.');
    }
  } catch (error) {
    console.error('Error sharing file:', error);
  }
}
