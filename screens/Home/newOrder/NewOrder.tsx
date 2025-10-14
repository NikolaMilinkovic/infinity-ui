import { useContext, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import SafeView from '../../../components/layout/SafeView';
import ColorSizeSelectorsList from '../../../components/orders/ColorSizeSelectorsList';
import CourierSelector from '../../../components/orders/CourierSelector';
import NewOrderPreview, { NewOrderPreviewRef } from '../../../components/orders/NewOrderPreview';
import SelectedProductsDisplay from '../../../components/orders/SelectedProductsList';
import SortUserInformationField from '../../../components/orders/SortUserInformationField';
import { Colors } from '../../../constants/colors';
import { AuthContext } from '../../../store/auth-context';
import { useConfirmationModal } from '../../../store/modals/confirmation-modal-context';
import { NewOrderContext } from '../../../store/new-order-context';
import { OrdersContext } from '../../../store/orders-context';
import { useUser } from '../../../store/user-context';
import Button from '../../../util-components/Button';
import KeyboardAvoidingWrapper from '../../../util-components/KeyboardAvoidingWrapper';
import { popupMessage } from '../../../util-components/PopupMessage';
import { addNewOrder } from '../../../util-methods/FetchMethods';
import { betterConsoleLog } from '../../../util-methods/LogMethods';

function NewOrder() {
  // Fade in animation
  const newOrderCtx = useContext(NewOrderContext);
  const orderCtx = useContext(OrdersContext);
  const authCtx = useContext(AuthContext);
  const user = useUser();
  const token = authCtx.token;
  const orderPreviewRef = useRef<NewOrderPreviewRef>(null);
  const { showConfirmation } = useConfirmationModal();
  const [, forceUpdate] = useState(0);
  const courierSelectorRef = useRef<any>(null);
  const resetCourierToDefault = () => {
    courierSelectorRef.current?.resetDropdown();
  };

  // ARTICLE LIST
  const [isArticleListOpen, setIsArticleListOpen] = useState(true);
  function handleArticleListOk() {
    setIsArticleListOpen(false);
    setIsBuyerInfoOpen(false);
    setIsOrderPreviewOpen(false);
    setIsCourierPreviewOpen(false);

    setTimeout(() => {
      setIsColorSizeSelectorsOpen(true);
    }, 360);
  }

  // COLOR SIZES SELECTORS
  const [isColorSizeSelectorsOpen, setIsColorSizeSelectorsOpen] = useState(false);
  function handleColorSizeSelectorsOk() {
    setIsArticleListOpen(false);
    setIsCourierPreviewOpen(false);
    setIsColorSizeSelectorsOpen(false);
    setIsOrderPreviewOpen(false);

    setTimeout(() => {
      setIsBuyerInfoOpen(true);
    }, 360);
  }

  // BUYER INFORMATION
  const [isBuyerInfoOpen, setIsBuyerInfoOpen] = useState(false);
  const [buyerInfo, setBuyerInfo] = useState('');

  function handleBuyerInfoOk() {
    setIsArticleListOpen(false);
    setIsBuyerInfoOpen(false);
    setIsOrderPreviewOpen(false);
    setIsColorSizeSelectorsOpen(false);

    setTimeout(() => {
      setIsCourierPreviewOpen(true);
    }, 360);
  }

  // COURIER SELECTOR
  const [isCourierPreviewOpen, setIsCourierPreviewOpen] = useState(false);
  function handleCourierSelectorOk() {
    setIsArticleListOpen(false);
    setIsBuyerInfoOpen(false);
    setIsColorSizeSelectorsOpen(false);
    setIsOrderPreviewOpen(false);
    setIsCourierPreviewOpen(false);

    setTimeout(() => {
      setIsOrderPreviewOpen(true);
    }, 360);
  }

  // ORDER PREVIEW SECTION
  const [isOrderPreviewOpen, setIsOrderPreviewOpen] = useState(false);

  // Reset order entries
  function handleResetOrderData() {
    setIsArticleListOpen(true);
    setIsBuyerInfoOpen(false);
    setIsColorSizeSelectorsOpen(false);
    setIsCourierPreviewOpen(false);
    setIsOrderPreviewOpen(false);

    // Issue, ne rerender se na default value
    // Takodje mozemo opet da set default value kurira kada resetujemo sve
    // Ali to i dalje nece rerender dropdown da prikazuje value Bex
    resetCourierToDefault();

    // BUYER INFORMATION SECTION
    setBuyerInfo('');
    // ORDER PREVIEW SECTION
    newOrderCtx.setCustomPrice('');
    newOrderCtx.resetOrderData();
    orderPreviewRef.current?.handleRecalculatePrice();
    forceUpdate((prev) => prev + 1);
  }

  const [isAddingOrder, setIsAddingOrder] = useState(false);

  function checkBuyerSimilarities() {
    const newBuyer = newOrderCtx.buyerData;
    const unprocessedOrders = orderCtx.unprocessedOrders;

    let overallMatches = {
      name: false,
      address: false,
      phone: false,
    };

    for (const order of unprocessedOrders) {
      const matches = {
        name: newBuyer?.name === order.buyer.name,
        address: newBuyer?.address === order.buyer.address,
        phone: newBuyer?.phone === order.buyer.phone,
      };

      // Update overall matches
      overallMatches = {
        name: overallMatches.name || matches.name,
        address: overallMatches.address || matches.address,
        phone: overallMatches.phone || matches.phone,
      };

      // Stop immediately if name + address + phone all match
      if (matches.name && matches.address && matches.phone) {
        return { sameBuyer: true, matches };
      }
    }

    // After checking all orders
    const sameBuyer = overallMatches.name || overallMatches.address || overallMatches.phone;
    return { sameBuyer, matches: overallMatches };
  }

  async function submitOrder(order: any, token: string) {
    if (!user && !user?.permissions?.orders?.create)
      return popupMessage('Nemate dozvolu za dodavanje nove porudžbine', 'danger');
    console.log('AddNewOrder is being called');
    const response = await addNewOrder(order, token, 'orders');
    setIsAddingOrder(false);
    if (response) {
      handleResetOrderData();
      popupMessage('Porudžbina uspešno dodata', 'success');
    } else {
      popupMessage('Došlo je do problema prilikom slanja nove porudžbine', 'danger');
    }
  }

  async function handleSubmitOrder() {
    if (isAddingOrder) return popupMessage('Dodavanje porudzbine u toku, sačekajte.', 'info');
    try {
      // get order form with all the data from new-order-context
      const order = newOrderCtx.createOrderHandler();

      betterConsoleLog('> New order is', order);
      // return;

      if (!order) return;
      if (order === undefined) return;
      if (order === null) return;

      // Send the data via fetch
      if (!token) return popupMessage('Autentifikacioni token ne postoji!', 'danger');
      setIsAddingOrder(true);

      const buyerConflict = checkBuyerSimilarities();

      if (buyerConflict.sameBuyer) {
        showConfirmation(
          async () => {
            await submitOrder(order, token);
          },
          `Prethodna porudžbina ima iste podatke: ${buyerConflict.matches.name ? 'Ime kupca,' : ''} ${
            buyerConflict.matches.address ? 'Adresa,' : ''
          } ${buyerConflict.matches.phone ? 'Broj telefona,' : ''}\n\nDa li sigurno želite da dodate ovu porudžbinu?`,
          () => {
            setIsBuyerInfoOpen(true);
            setIsArticleListOpen(false);
            setIsColorSizeSelectorsOpen(false);
            setIsCourierPreviewOpen(false);
            setIsOrderPreviewOpen(false);
          }
        );
        return;
      }

      await submitOrder(order, token);
    } catch (error) {
      console.error(error);
      setIsAddingOrder(false);
      popupMessage('Došlo je do problema prilikom slanja nove porudžbine', 'danger');
    } finally {
      setIsAddingOrder(false);
    }
  }

  return (
    <SafeView>
      <KeyboardAvoidingWrapper>
        <Animated.ScrollView
          style={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        >
          <SelectedProductsDisplay
            setIsExpanded={setIsArticleListOpen}
            isExpanded={isArticleListOpen}
            onNext={handleArticleListOk}
            ordersCtx={newOrderCtx}
          />
          <ColorSizeSelectorsList
            ordersCtx={newOrderCtx}
            isExpanded={isColorSizeSelectorsOpen}
            setIsExpanded={setIsColorSizeSelectorsOpen}
            onNext={handleColorSizeSelectorsOk}
          />
          <SortUserInformationField
            setIsExpanded={setIsBuyerInfoOpen}
            isExpanded={isBuyerInfoOpen}
            onNext={handleBuyerInfoOk}
            buyerInfo={buyerInfo}
            setBuyerInfo={setBuyerInfo}
          />
          <CourierSelector
            isExpanded={isCourierPreviewOpen}
            setIsExpanded={setIsCourierPreviewOpen}
            onNext={handleCourierSelectorOk}
            ref={courierSelectorRef}
          />
          <NewOrderPreview
            isExpanded={isOrderPreviewOpen}
            setIsExpanded={setIsOrderPreviewOpen}
            setCustomPrice={newOrderCtx.setCustomPrice}
            ref={orderPreviewRef}
          />
          <View style={styles.buttonsContainer}>
            <Button
              backColor={Colors.error}
              textColor={Colors.white}
              containerStyles={[styles.button, { marginBottom: 6 }]}
              onPress={handleResetOrderData}
            >
              Odustani i resetuj
            </Button>
            <Button
              backColor={Colors.secondaryDark}
              textColor={Colors.white}
              containerStyles={[styles.button, { marginBottom: 6 }]}
              onPress={handleSubmitOrder}
            >
              Dodaj porudžbinu
            </Button>
          </View>
        </Animated.ScrollView>
      </KeyboardAvoidingWrapper>
    </SafeView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 0,
  },
  scrollViewContainer: {
    padding: 16,
  },
  buttonsContainer: {
    marginTop: 'auto',
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    gap: 10,
    marginBottom: 24,
  },
  button: {
    flex: 2,
  },
});

export default NewOrder;
