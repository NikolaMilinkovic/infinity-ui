import Constants from 'expo-constants';
import { Alert } from 'react-native';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import { popupMessage } from '../../util-components/PopupMessage';
import { handleFetchingWithBodyData } from '../FetchMethods';
import { betterConsoleLog } from '../LogMethods';

const BACKEND_URI = process.env.EXPO_PUBLIC_BACKEND_URI;
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface LoginUserTypes {
  username: string;
  password: string;
}
interface LoginResponse {
  token?: string;
  message?: string;
}
interface AuthStatus {
  isAuthenticated: boolean;
  message: string;
  token: string;
}

/**
 * Sends a login request to the backend server and returns the authenticated status
 * @param {String} username
 * @param {String} password
 * @returns {Object}
 * {
 *    isAuthenticated: boolean
 *    message: string
 *    token: string
 * }
 */
export async function loginUser({ username, password }: LoginUserTypes): Promise<AuthStatus> {
  try {
    const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    console.log('> Fetching complete..');

    // Parsing server response
    const parsedResponse: LoginResponse = await response.json();

    // Auth Fail
    if (!response.ok) {
      const authStatus: AuthStatus = {
        isAuthenticated: response.ok,
        message: parsedResponse.message || 'Login failed. Please try again.',
        token: '',
      };
      return authStatus;

      // Auth Success
    } else {
      const authStatus: AuthStatus = {
        isAuthenticated: response.ok,
        message: parsedResponse.message || 'Login successful.',
        token: parsedResponse.token || '',
      };

      // Update expo push token in the DB if its not present
      const { expoPushToken } = usePushNotifications();
      if (parsedResponse.token && expoPushToken?.data)
        await updateUserExpoPushToken(parsedResponse.token, expoPushToken?.data);

      return authStatus;
    }
  } catch (error) {
    console.error(`[ERROR] Failed to login user: ` + error);
    Alert.alert(
      'Login Error',
      `Backend uri: ${BACKEND_URI} | An error occurred: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    Alert.alert('Login Error', `Backend uri: ${BACKEND_URI} | An error occurred: ${error}`);
    return {
      isAuthenticated: false,
      message: 'Network error. Please check your connection or try again later.',
      token: '',
    };
  }
}

/**
 * Updates the expoPushToken in the database for the decoded user
 * @param token {string}
 * @param expoPushToken {string}
 */
export async function updateUserExpoPushToken(token: string, expoPushToken: string) {
  try {
    const jsonToken = JSON.stringify(expoPushToken);
    const response = await handleFetchingWithBodyData(
      { expoPushToken: jsonToken },
      token,
      'user/update-user-push-token',
      'POST'
    );
    if (!response.ok) {
      const parsedResponse = await response.json();
      popupMessage(parsedResponse.message, 'danger');
    }
  } catch (error) {
    betterConsoleLog('> Došlo je do errora prilikom ažuriranja expo push tokena', error);
    popupMessage('Došlo je do problema prilikom ažuriranja expo push tokena', 'danger');
  }
}

// export async function verifyUser(username: string, password: string, token: string){
//   try{
//     const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/verify-user`, {
//       method: 'POST',
//       headers: {
//         'Content-Type' : 'application/json',
//       },
//       body: JSON.stringify({
//         token,
//         username,
//         password,
//       })
//     });

//     return false;
//   } catch(error){
//     console.error(`[ERROR] Failed to verify user: ` + error)
//   }
// }
