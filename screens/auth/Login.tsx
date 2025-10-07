import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, View } from 'react-native';
import LoadingOverlay from '../../components/loading/LoadingOverlay';
import { Colors } from '../../constants/colors';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import { AuthContext } from '../../store/auth-context';
import Button from '../../util-components/Button';
import InputField from '../../util-components/InputField';
import { loginUser } from '../../util-methods/auth/AuthMethods';
import { betterErrorLog } from '../../util-methods/LogMethods';

function Login() {
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const { expoPushToken } = usePushNotifications();

  const authCtx = useContext(AuthContext);
  useEffect(() => {
    if (username && password) setErrorMessage('');
  }, [username, password]);

  // Fade in animation
  const fadeIn = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeIn, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  // INTERFACES
  interface LoginResultType {
    isAuthenticated: boolean;
    message: string;
    token: string;
  }

  /**
   * Sends username & password to the server for authentication
   * Receives token from the server and calls auth-context > authenticate(token) method
   * @param {String} username
   * @param {String} password
   * @param {String | null} expoPushToken
   * @returns {Promise<void>}
   */
  async function loginUserHandler(username: string, password: string, expoPushToken: string): Promise<void> {
    if (!username || !password) {
      setErrorMessage('Invalid input, please provide a valid username & password.');
      return;
    }
    setIsAuthenticating(true);

    try {
      const result: LoginResultType = await loginUser({ username, password, expoPushToken });

      if (!result.isAuthenticated || !result.token) {
        failAuthHandler(result);
        return;
      }

      try {
        authCtx.authenticate(result.token);
      } catch (ctxErr) {
        betterErrorLog('Error authenticating user:', ctxErr);
        setErrorMessage('Failed to save login session.');
      }
    } catch (err) {
      betterErrorLog('Login error:', err);
      setErrorMessage(`Issue logging in user: ${err}`);
    } finally {
      setIsAuthenticating(false);
    }
  }

  /**
   * Handles updating the screen upon Authentication error
   * @param {LoginResultType} result
   * @returns {void}
   */
  function failAuthHandler(result: LoginResultType): void {
    setErrorMessage(result.message || 'Authentication failed..');
    setIsAuthenticating(false);
    return;
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging in.." />;
  }

  return (
    <Animated.View style={[styles.container, { opacity: fadeIn }]}>
      <Image source={require('../../assets/infinity.png')} style={styles.image} />
      <View style={styles.inputsContainer}>
        <View style={styles.inputWrapper}>
          <InputField
            label="Username"
            inputText={username}
            setInputText={setUsername}
            capitalize="none"
            labelBorders={false}
          />
        </View>
        <View style={styles.inputWrapper}>
          <InputField
            label="Password"
            isSecure={true}
            inputText={password}
            setInputText={setPassword}
            capitalize="none"
            labelBorders={false}
          />
        </View>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      </View>
      <Button
        onPress={() => loginUserHandler(username, password, expoPushToken?.data || '')}
        textColor={Colors.whiteText}
        backColor={Colors.primaryDark}
      >
        Login
      </Button>
    </Animated.View>
  );
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
  inputWrapper: {
    marginTop: 16,
    width: '100%',
  },
  errorMessage: {
    color: Colors.error,
    textAlign: 'center',
  },
  image: {
    maxHeight: 140,
    aspectRatio: 16 / 9,
    resizeMode: 'contain',
    marginBottom: 24,
  },
});

export default Login;
