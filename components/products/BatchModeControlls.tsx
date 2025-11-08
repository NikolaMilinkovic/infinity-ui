import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useGlobalStyles } from '../../constants/globalStyles';
import { useExpandAnimationWithContentVisibility } from '../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../hooks/useFadeAnimation';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import Button from '../../util-components/Button';
import IconButton from '../../util-components/IconButton';

interface PropTypes {
  active: boolean;
  onRemoveBatchPress: () => void;
  handleSortProducts: (position: string) => void;
}
function BatchModeControlls({ active, onRemoveBatchPress, handleSortProducts }: PropTypes) {
  const colors = useThemeColors();
  const styles = getStyles(colors);
  const globalStyles = useGlobalStyles();
  useEffect(() => {
    setIsExpanded(active);
  }, [active]);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(active);
  const toggleFade = useToggleFadeAnimation(isExpanded, 100);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(isExpanded, setIsContentVisible, 0, 60, 100);

  return (
    <>
      {isContentVisible && (
        <Animated.View style={[styles.container, { height: toggleExpandAnimation, opacity: toggleFade }]}>
          {/* Product sorting buttons */}
          <View style={styles.sortProductsContainer}>
            <Button
              containerStyles={styles.button}
              onPress={() => handleSortProducts('top')}
              backColor={colors.buttonNormal1}
              backColor1={colors.buttonNormal2}
              textStyles={styles.buttonText}
            >
              Top
            </Button>
            <Button
              containerStyles={styles.button}
              onPress={() => handleSortProducts('mid')}
              backColor={colors.buttonNormal1}
              backColor1={colors.buttonNormal2}
              textStyles={styles.buttonText}
            >
              Mid
            </Button>
            <Button
              containerStyles={styles.button}
              onPress={() => handleSortProducts('bot')}
              backColor={colors.buttonNormal1}
              backColor1={colors.buttonNormal2}
              textStyles={styles.buttonText}
            >
              Bot
            </Button>
          </View>

          {/* DELETE button */}
          <IconButton
            size={22}
            color={colors.error}
            onPress={onRemoveBatchPress}
            key={`key-remove-batch-button`}
            icon="delete"
            style={[styles.removeBatchItemsButton, globalStyles.elevation_1]}
            pressedStyles={styles.removeBatchItemsButtonPressed}
            backColor={colors.buttonNormal1}
            backColor1={colors.buttonNormal2}
          />
        </Animated.View>
      )}
    </>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      backgroundColor: colors.background,
      borderBottomColor: colors.primaryDark,
      flexDirection: 'row',
      marginTop: -2,
    },
    removeBatchItemsButton: {
      margin: 10,
      borderWidth: 0,
      borderRadius: 4,
      width: 50,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: 'auto',
    },
    removeBatchItemsButtonPressed: {
      opacity: 0.7,
    },
    sortProductsContainer: {
      flexDirection: 'row',
      flex: 1,
    },
    button: {
      flex: 1,
      maxWidth: 80,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
      marginRight: 5,
      paddingVertical: 0,
      paddingHorizontal: 0,
      borderWidth: 0,
      borderTopWidth: 0,
    },
    buttonPressed: {
      opacity: 0.7,
    },
    buttonText: {
      color: colors.defaultText,
      margin: 0,
    },
  });
}

export default BatchModeControlls;
