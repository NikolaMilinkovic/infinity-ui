import { useEffect, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { useExpandAnimationWithContentVisibility } from '../../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../../hooks/useFadeAnimation';
import { ThemeColors, useThemeColors } from '../../../store/theme-context';
import { useUser } from '../../../store/user-context';
import IconButton from '../../../util-components/IconButton';

interface PropTypes {
  active: boolean;
  onRemoveBatchPress: () => void;
  onExcellExportPress: () => void;
  onSelectAllOrders: () => void;
  isAllSelected: boolean;
}
function BatchModeOrderControlls({
  active,
  onRemoveBatchPress,
  onExcellExportPress,
  onSelectAllOrders,
  isAllSelected,
}: PropTypes) {
  useEffect(() => {
    setIsExpanded(active);
  }, [active]);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const toggleFade = useToggleFadeAnimation(isExpanded, 100);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(isExpanded, setIsContentVisible, 0, 60, 100);
  const user = useUser();
  const colors = useThemeColors();
  const styles = getStyles(colors);

  return (
    <View style={{ backgroundColor: colors.containerBackground }}>
      {isContentVisible && (
        <Animated.View style={[styles.container, { height: toggleExpandAnimation, opacity: toggleFade }]}>
          {user?.permissions?.orders?.delete && (
            <IconButton
              direction="row"
              size={22}
              color={colors.error}
              onPress={onRemoveBatchPress}
              key={`key-remove-batch-button`}
              icon="delete"
              style={[styles.generalButtonStyle, styles.removeBatchItemsButton]}
              pressedStyles={styles.removeBatchItemsButtonPressed}
              backColor={'transparent'}
              backColor1={'transparent'}
            />
          )}
          <IconButton
            direction="row"
            size={22}
            color={colors.defaultText}
            onPress={onExcellExportPress}
            key={`key-excell-export-batch-button`}
            icon="file-export"
            style={[styles.generalButtonStyle, styles.exportExcellButton]}
            pressedStyles={styles.removeBatchItemsButtonPressed}
            iconsLibrary="FontAwesome6"
            text="Excell"
            backColor={'transparent'}
            backColor1={'transparent'}
          />
          {isAllSelected ? (
            <IconButton
              direction="row"
              size={22}
              color={colors.defaultText}
              onPress={onSelectAllOrders}
              key={`key-select-all-orders-button`}
              icon="close"
              style={[styles.generalButtonStyle, styles.highlightAll]}
              pressedStyles={styles.removeBatchItemsButtonPressed}
              iconsLibrary="MaterialIcons"
              text="Odštikliraj"
              backColor={'transparent'}
              backColor1={'transparent'}
            />
          ) : (
            <IconButton
              direction="row"
              size={22}
              color={colors.defaultText}
              onPress={onSelectAllOrders}
              key={`key-select-all-orders-button`}
              icon="done-all"
              style={[styles.generalButtonStyle, styles.highlightAll]}
              pressedStyles={styles.removeBatchItemsButtonPressed}
              iconsLibrary="MaterialIcons"
              text="Oznaci sve"
              backColor={'transparent'}
              backColor1={'transparent'}
            />
          )}
        </Animated.View>
      )}
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 8,
      backgroundColor: colors.containerBackground,
      flexDirection: 'row-reverse',
    },
    removeBatchItemsButton: {
      width: 50,
    },
    exportExcellButton: {
      gap: 10,
      width: 100,
    },
    highlightAll: {
      width: 120,
      gap: 10,
    },
    generalButtonStyle: {
      marginVertical: 10,
      marginHorizontal: 5,
      backgroundColor: colors.background,
      height: 40,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      borderRadius: 4,
    },
    removeBatchItemsButtonPressed: {
      opacity: 0.7,
      elevation: 1,
    },
  });
}
export default BatchModeOrderControlls;
