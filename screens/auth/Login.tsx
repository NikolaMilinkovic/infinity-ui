import React, { useEffect, useState, useContext, useRef } from 'react'
import InputField from '../../util-components/InputField'
import { View, StyleSheet, Text, Image, Animated } from 'react-native'
import Button from '../../util-components/Button'
import { AuthContext } from '../../store/auth-context';
import LoadingOverlay from '../../components/loading/LoadingOverlay';
import { loginUser } from '../../util-methods/auth/AuthMethods';
import { Colors } from '../../constants/colors';

function Login() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const authCtx = useContext(AuthContext);
  useEffect(() => {
    if(username && password) setErrorMessage('');
  }, [username, password])

    // Fade in animation
    const fadeIn = useRef(new Animated.Value(0)).current;
    useEffect(() => {
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true
      }).start();
    }, []);

  // INTERFACES
  interface LoginResultType{
    isAuthenticated: boolean;
    message: string;
    token: string;
  }

  /**
   * Sends username & password to the server for authentication
   * Receives token from the server and calls auth-context > authenticate(token) method
   * @param {String} username 
   * @param {String} password 
   * @returns {Promise<void>}
   */
  async function loginUserHandler(username: string, password: string): Promise<void>{
    if(!username || !password) {
      setErrorMessage('Invalid input, please provide a valid username & password.');
      return;
    }
    setIsAuthenticating(true);

    try{
      const result: LoginResultType = await loginUser({username, password});

      if(result.isAuthenticated === false) failAuthHandler(result);
      if(result.token === '') failAuthHandler(result);

      authCtx.authenticate(result.token);

    } catch(err){
      setErrorMessage(`Issue logging in user: ${err}`);
      setIsAuthenticating(false);
    }
  }


  
  /**
   * Handles updating the screen upon Authentication error
   * @param {LoginResultType} result 
   * @returns {void}
   */
  function failAuthHandler(result: LoginResultType): void{
    console.log('> Auth failed')
    setErrorMessage(result.message || 'Authentication failed..');
    setIsAuthenticating(false);
    return;
  }

  if(isAuthenticating){
    return <LoadingOverlay message="Logging in.."/>
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
        <Image 
          source={require('../../assets/infinity.png')}
          style={styles.image}
        />
      <View style={styles.inputsContainer}>
        <InputField
          label='Username'
          inputText={username}
          setInputText={setUsername}
          capitalize='none'
        />
        <InputField
          label='Password'
          isSecure={true}
          inputText={password}
          setInputText={setPassword}
          capitalize='none'
        />
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
      <Button 
        onPress={() => loginUserHandler(username, password)}
        textColor={Colors.whiteText}
        backColor={Colors.primaryDark}
      >Login</Button>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 44,
  },
  inputsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 28,
  },
  errorMessage: {
    color: Colors.error,
    textAlign: 'center'
  },
  image: {
    maxHeight: 140,
    aspectRatio: 16/9,
    resizeMode: 'contain',
    marginBottom: 24
  }
})

export default Login