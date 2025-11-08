import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CategoriesManager from '../screens/CategoriesManager/CategoriesManager';
import ColorsManager from '../screens/ColorsManager/ColorsManager';
import { useThemeColors } from '../store/theme-context';

const Tab = createMaterialTopTabNavigator();

export default function ColorsCategoriesTabs() {
  const colors = useThemeColors();
  /**
   * BOJE, KATEGORIJE i DOBAVLJAČI tabovi
   */
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarPressColor: colors.tabsPressEffect,
        tabBarLabelStyle: {
          fontSize: 11,
          color: colors.primaryDark,
        },
        tabBarStyle: {
          backgroundColor: colors.tabsBackground,
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.highlight,
          height: 4,
        },
      }}
    >
      <Tab.Screen
        name="ColorsManager"
        component={ColorsManager}
        options={{
          title: 'Boje',
        }}
      />
      <Tab.Screen
        name="CategoriesManager"
        component={CategoriesManager}
        options={{
          title: 'Kategorije',
        }}
      />
    </Tab.Navigator>
  );
}
