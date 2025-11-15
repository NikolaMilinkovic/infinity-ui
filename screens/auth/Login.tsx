import { useContext, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeIn } from 'react-native-reanimated';
import LoadingOverlay from '../../components/loading/LoadingOverlay';
import { usePushNotifications } from '../../hooks/usePushNotifications';
import { AuthContext } from '../../store/auth-context';
import { ThemeColors, useTheme, useThemeColors } from '../../store/theme-context';
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
  const colors = useThemeColors();
  const themeContext = useTheme();
  const styles = getStyles(colors);

  const authCtx = useContext(AuthContext);
  useEffect(() => {
    if (username && password) setErrorMessage('');
  }, [username, password]);

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

  // const AnimatedKeyboardAwareScrollView = Animated.createAnimatedComponent(KeyboardAwareScrollView);

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <Animated.View
        entering={FadeIn.duration(600).withInitialValues({ backgroundColor: colors.background2 })}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.contentWrapper}>
          {' '}
          {/* Add wrapper */}
          <KeyboardAwareScrollView
            bottomOffset={70}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            scrollEnabled={false}
          >
            {themeContext.theme === 'light' && (
              <Image source={require('../../assets/infinity.png')} style={styles.image} />
            )}
            {themeContext.theme === 'dark' && (
              <Image source={require('../../assets/infinity-white.png')} style={styles.image} />
            )}

            <View style={styles.inputsContainer}>
              <View style={styles.inputWrapper}>
                <InputField
                  label="Username"
                  inputText={username}
                  setInputText={setUsername}
                  capitalize="none"
                  labelBorders={false}
                  color={colors.defaultText}
                  activeColor={colors.defaultText}
                  background={colors.blackWhite}
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
                  color={colors.defaultText}
                  activeColor={colors.defaultText}
                  background={colors.blackWhite}
                />
              </View>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            </View>
            <Button
              onPress={() => loginUserHandler(username, password, expoPushToken?.data || '')}
              textColor={colors.whiteText}
              backColor={colors.buttonHighlight1}
              backColor1={colors.buttonHighlight2}
            >
              Login
            </Button>
          </KeyboardAwareScrollView>
        </View>
      </Animated.View>
    </View>
  );
}
function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.blackWhite,
      alignItems: 'center',
      justifyContent: 'center',
      maxHeight: '100%',
    },
    contentWrapper: {
      maxHeight: '100%',
      width: '70%',
      flex: 1,
    },
    scrollContent: {
      maxHeight: '100%',
      flexGrow: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputsContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      marginBottom: 12,
    },
    inputWrapper: {
      marginTop: 16,
      width: '100%',
    },
    errorMessage: {
      color: colors.error,
      textAlign: 'center',
    },
    image: {
      maxHeight: 140,
      aspectRatio: 16 / 9,
      resizeMode: 'contain',
      marginBottom: 24,
    },
  });
}

export default Login;
