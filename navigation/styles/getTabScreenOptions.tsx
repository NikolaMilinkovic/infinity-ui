// tabScreenOptions.ts
import { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { ThemeColors } from '../../store/theme-context';

export interface TabScreenOptions {
  tabBarPressColor: string;
  tabBarLabelStyle: StyleProp<TextStyle>;
  tabBarStyle: StyleProp<ViewStyle>;
  tabBarIndicatorStyle: StyleProp<ViewStyle>;
  lazy: boolean;
  tabBarBounces: boolean;
  swipeEnabled: boolean;
}

export const getTabScreenOptions = (colors: ThemeColors): TabScreenOptions => ({
  tabBarPressColor: colors.tabsPressEffect,
  tabBarLabelStyle: {
    fontSize: 12,
    color: colors.tabTextColor,
    fontFamily: 'HelveticaNeue-Light',
  },
  tabBarStyle: {
    backgroundColor: colors.tabsBackground,
  },
  tabBarIndicatorStyle: {
    backgroundColor: colors.tabUnderlineColor,
    height: colors.tabUnderlineWidth,
  },
  lazy: false,
  tabBarBounces: true,
  swipeEnabled: true,
});
