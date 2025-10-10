import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Colors } from '../../constants/colors';
import { useExpandAnimationWithContentVisibility } from '../../hooks/useExpand';
import { NewOrderContextTypes } from '../../types/allTsTypes';
import Button from '../../util-components/Button';
import { popupMessage } from '../../util-components/PopupMessage';
import ColorSizeSelector from './ColorSizeSelector';

interface PropTypes {
  ordersCtx: NewOrderContextTypes;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  onNext: () => void;
}
function ColorSizeSelectorsList({ ordersCtx, isExpanded, setIsExpanded, onNext }: PropTypes) {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const toggleExpandAnimation = useExpandAnimationWithContentVisibility(
    isExpanded,
    setIsContentVisible,
    0,
    contentHeight,
    180
  );
  function handleToggleExpand() {
    if (isExpanded) {
      setIsExpanded(false);
    } else {
      setIsExpanded(true);
    }
  }

  function handleOnNext() {
    if (ordersCtx.productData.length === 0)
      return popupMessage('Morate izabrati proizvod kako bi nastavili dalje', 'danger');
    const missingColor = ordersCtx.productData.some((order) => order.selectedColor === '');
    if (missingColor) return popupMessage('Morate izabrati boju za svaki proizvod', 'danger');

    const productsWithSizes = ordersCtx.productData.filter((product) => product.hasOwnProperty('selectedSize'));
    const missingSize = productsWithSizes.some((order) => order.selectedSize === '');
    if (missingSize) return popupMessage('Morate uneti veličinu za svaki proizvod', 'danger');

    onNext();
  }

  return (
    <Animated.ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
      {/* TOGGLE BUTTON */}
      <Pressable onPress={handleToggleExpand} style={styles.headerContainer}>
        <Text style={styles.header}>Boje i Veličine</Text>
        <Icon
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          style={styles.iconStyle}
          size={26}
          color={Colors.white}
        />
      </Pressable>

      {/* MAIN */}
      {isContentVisible && (
        <Animated.ScrollView
          style={(styles.container, { height: toggleExpandAnimation })}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <View
            onLayout={(event) => {
              const { height } = event.nativeEvent.layout;
              if (height !== contentHeight) setContentHeight(height);
            }}
          >
            {ordersCtx.productData.map((product, index) => (
              <Animated.View key={`${index}-${product._id}`}>
                <ColorSizeSelector index={index} product={product} context={ordersCtx} />
              </Animated.View>
            ))}

            {/* ON NEXT BUTTON */}
            <Button
              backColor={Colors.highlight}
              textColor={Colors.white}
              containerStyles={{ marginBottom: 6, marginHorizontal: 0 }}
              onPress={handleOnNext}
            >
              Dalje
            </Button>
          </View>
        </Animated.ScrollView>
      )}
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: Colors.primaryDark,
    backgroundColor: Colors.secondaryDark,
    marginBottom: 6,
    flexDirection: 'row',
  },
  iconStyle: {
    marginLeft: 'auto',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.white,
  },
  container: {
    paddingHorizontal: 8,
  },
});

export default ColorSizeSelectorsList;
