import { Alert } from "react-native"

const BACKEND_URI = process.env.EXPO_PUBLIC_BACKEND_URI
import Constants from 'expo-constants';
const backendURI = Constants.expoConfig?.extra?.backendURI;

interface LoginUserTypes{
  username: string
  password: string
}
interface LoginResponse{
  token?: string
  message?: string
}
interface AuthStatus{
  isAuthenticated: boolean
  message: string
  token: string
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
export async function loginUser({username, password}: LoginUserTypes): Promise<AuthStatus>{
  try{
    console.log('> Fetching..')
    const response = await fetch(`${backendURI || process.env.EXPO_PUBLIC_BACKEND_URI}/login`, {
      method: 'POST',
      headers: {
        'Content-Type' : 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      })
    });

    console.log('> Fetching complete..')

    // Parsing server response
    const parsedResponse: LoginResponse = await response.json();
    
    // Auth Fail
    if(!response.ok){
      const authStatus: AuthStatus = {
        isAuthenticated: response.ok, 
        message: parsedResponse.message || "Login failed. Please try again.",
        token: ''
      }
      return authStatus;

    // Auth Success
    } else {
      const authStatus: AuthStatus = {
        isAuthenticated: response.ok, 
        message: parsedResponse.message || "Login successful.", 
        token: parsedResponse.token || ''
      }
      return authStatus
    }
  } catch (error){
    console.error(`[ERROR] Failed to login user: ` + error)
    Alert.alert(
      "Login Error",
      `Backend uri: ${BACKEND_URI} | An error occurred: ${error instanceof Error ? error.message : "Unknown error"}`
    );
    Alert.alert(
      "Login Error",
      `Backend uri: ${BACKEND_URI} | An error occurred: ${error}`
    );
    return {
      isAuthenticated: false,
      message: "Network error. Please check your connection or try again later.",
      token: "",
    };
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