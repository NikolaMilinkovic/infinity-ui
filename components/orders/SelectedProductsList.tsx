import { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useGlobalStyles } from '../../constants/globalStyles';
import { useExpandAnimationWithContentVisibility } from '../../hooks/useExpand';
import { ThemeColors, useThemeColors } from '../../store/theme-context';
import { NewOrderContextTypes } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import { popupMessage } from '../../util-components/PopupMessage';
import SelectedProduct from './SelectedProduct';

interface PropTypes {
  ordersCtx: NewOrderContextTypes;
  isExpanded: boolean;
  onNext: () => void;
  setIsExpanded: (expanded: boolean) => void;
}
function SelectedProductsDisplay({ ordersCtx, isExpanded, setIsExpanded, onNext }: PropTypes) {
  const globalStyles = useGlobalStyles();
  const colors = useThemeColors();
  const styles = getStyles(colors);

  // Expand animation that makescontent visible when expanded
  // Used to fix the padding issue when expand is collapsed
  const [isContentVisible, setIsContentVisible] = useState(true);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(isExpanded, setIsContentVisible, 10, 250);

  function handleToggleExpand() {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }

  // ON NEXT
  function handleOnNext() {
    if (ordersCtx.productReferences.length > 0) {
      onNext();
    } else {
      popupMessage('Molimo izaberite proizvod', 'danger');
    }
  }

  return (
    <View style={styles.container}>
      {/* TOGGLE BUTTON */}
      <Pressable onPress={handleToggleExpand} style={styles.headerContainer}>
        <Text style={styles.header}>Izabrani artikli ({ordersCtx.productReferences.length})</Text>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          style={styles.iconStyle}
          size={26}
          color={colors.white}
        />
      </Pressable>

      {/* MAIN */}
      {isContentVisible && (
        <View style={{ marginHorizontal: 8 }}>
          {/* LIST */}
          <Animated.FlatList
            style={[styles.listContainer, { height: toggleExpandAnimation }]}
            data={ordersCtx.productReferences}
            renderItem={({ item, index }) => <SelectedProduct item={item} orderCtx={ordersCtx} index={index} />}
            keyExtractor={(item, index) => `${index}-${item._id}`}
            contentContainerStyle={{ paddingBottom: 16 }}
            nestedScrollEnabled={true}
          />

          {/* NEXT BUTTON */}
          <Button
            textColor={colors.highlightText}
            containerStyles={{ marginBottom: 6 }}
            onPress={handleOnNext}
            backColor={colors.buttonHighlight1}
            backColor1={colors.buttonHighlight2}
          >
            Dalje
          </Button>
        </View>
      )}
    </View>
  );
}

function getStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {},
    headerContainer: {
      padding: 10,
      borderRadius: 4,
      borderWidth: 0,
      borderColor: colors.borderColor,
      backgroundColor: colors.accordionHeaderBackground,
      marginBottom: 6,
      flexDirection: 'row',
    },
    iconStyle: {
      marginLeft: 'auto',
    },
    header: {
      fontSize: 14,
      alignSelf: 'center',
      color: colors.whiteText,
      fontFamily: 'HelveticaNeue-Bold',
      textAlign: 'center',
      flex: 1,
    },
    listContainer: {
      padding: 10,
      borderWidth: 1,
      borderColor: colors.borderColor,
      backgroundColor: colors.background,
      borderRadius: 4,
      marginBottom: 6,
    },
  });
}

export default SelectedProductsDisplay;
