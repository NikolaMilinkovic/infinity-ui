import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import useBackClickHandler from '../../hooks/useBackClickHandler';

type DrawerContent = ReactNode;

interface DrawerModalContextType {
  openDrawer: (content: DrawerContent, key?: string) => void;
  closeDrawer: () => void;
  updateDrawerContent: (content: DrawerContent, key?: string) => void;
  isDrawerOpen: boolean;
}

const DrawerModalContext = createContext<DrawerModalContextType | undefined>(undefined);

export const useDrawerModal = () => {
  const context = useContext(DrawerModalContext);
  if (!context) throw new Error('useDrawerModal must be used within DrawerModalProvider');
  return context;
};

export const DrawerModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [content, setContent] = useState<DrawerContent>(null);
  const [contentKey, setContentKey] = useState<string>('');
  const slideAnim = useState(new Animated.Value(Dimensions.get('window').width))[0];
  const [drawerWidth, setDrawerWidth] = useState<string>('80%');

  const openDrawer = (component: ReactNode, key?: string, width?: string) => {
    setContent(component);
    setContentKey(key || Date.now().toString());
    setIsRendered(true);
    setDrawerWidth(width ?? '80%');
    setTimeout(() => {
      setIsVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, 10);
  };

  const updateDrawerContent = (component: ReactNode, key?: string) => {
    setContent(component);
    setContentKey(key || Date.now().toString());
  };

  const closeDrawer = () => {
    Animated.timing(slideAnim, {
      toValue: Dimensions.get('window').width,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setIsVisible(false);
      setIsRendered(false);
      setContent(null);
      setContentKey('');
    });
  };

  // Hook integration: close drawer on hardware back press
  useBackClickHandler(isRendered, closeDrawer);

  return (
    <DrawerModalContext.Provider value={{ openDrawer, closeDrawer, updateDrawerContent, isDrawerOpen: isRendered }}>
      {children}
      {isRendered && (
        <TouchableWithoutFeedback onPress={closeDrawer}>
          <View style={[styles.overlay, isVisible && styles.visible]}>
            <TouchableWithoutFeedback>
              <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }], width: '80%' as any }]}>
                <View key={contentKey}>{content}</View>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </DrawerModalContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  visible: {
    opacity: 1,
  },
  drawer: {
    height: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
    right: 0,
    top: 0,
    padding: 16,
  },
});
