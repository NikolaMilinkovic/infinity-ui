import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import CategoriesManager from '../screens/CategoriesManager/CategoriesManager';
import ColorsManager from '../screens/ColorsManager/ColorsManager';
import { useThemeColors } from '../store/theme-context';
import { getTabScreenOptions } from './styles/getTabScreenOptions';

const Tab = createMaterialTopTabNavigator();

export default function ColorsCategoriesTabs() {
  const colors = useThemeColors();
  /**
   * BOJE, KATEGORIJE i DOBAVLJAČI tabovi
   */
  return (
    <Tab.Navigator screenOptions={getTabScreenOptions(colors)}>
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
