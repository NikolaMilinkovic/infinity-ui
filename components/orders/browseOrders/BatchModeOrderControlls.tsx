import React, { useEffect, useState } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/colors';
import { useExpandAnimationWithContentVisibility } from '../../../hooks/useExpand';
import { useToggleFadeAnimation } from '../../../hooks/useFadeAnimation';
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

  return (
    <>
      {isContentVisible && (
        <Animated.View style={[styles.container, { height: toggleExpandAnimation, opacity: toggleFade }]}>
          {user?.permissions?.orders?.delete && (
            <IconButton
              size={22}
              color={Colors.highlight}
              onPress={onRemoveBatchPress}
              key={`key-remove-batch-button`}
              icon="delete"
              style={[styles.generalButtonStyle, styles.removeBatchItemsButton]}
              pressedStyles={styles.removeBatchItemsButtonPressed}
            />
          )}
          <IconButton
            size={22}
            color={Colors.secondaryDark}
            onPress={onExcellExportPress}
            key={`key-excell-export-batch-button`}
            icon="file-export"
            style={[styles.generalButtonStyle, styles.exportExcellButton]}
            pressedStyles={styles.removeBatchItemsButtonPressed}
            iconsLibrary="FontAwesome6"
            text="Excell"
          />
          {isAllSelected ? (
            <IconButton
              size={22}
              color={Colors.secondaryDark}
              onPress={onSelectAllOrders}
              key={`key-select-all-orders-button`}
              icon="close"
              style={[styles.generalButtonStyle, styles.highlightAll]}
              pressedStyles={styles.removeBatchItemsButtonPressed}
              iconsLibrary="MaterialIcons"
              text="Odštikliraj"
            />
          ) : (
            <IconButton
              size={22}
              color={Colors.secondaryDark}
              onPress={onSelectAllOrders}
              key={`key-select-all-orders-button`}
              icon="done-all"
              style={[styles.generalButtonStyle, styles.highlightAll]}
              pressedStyles={styles.removeBatchItemsButtonPressed}
              iconsLibrary="MaterialIcons"
              text="Oznaci sve"
            />
          )}
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    backgroundColor: Colors.primaryLight,
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
    borderWidth: 0.5,
    borderColor: Colors.secondaryLight,
    backgroundColor: Colors.white,
    borderRadius: 4,
    elevation: 2,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  removeBatchItemsButtonPressed: {
    opacity: 0.7,
    elevation: 1,
  },
});

export default BatchModeOrderControlls;
