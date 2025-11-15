import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AddExcel from '../screens/ExcelManager/addExcel/AddExcel';
import EditExcel from '../screens/ExcelManager/editExcel/EditExcel';
import { useThemeColors } from '../store/theme-context';
import { getTabScreenOptions } from './styles/getTabScreenOptions';

const Tab = createMaterialTopTabNavigator();

export default function ExcelManagerTabs() {
  const colors = useThemeColors();
  /**
   * PRODUCTS MANAGER Tabs
   */

  function AddExcelScreen() {
    return <AddExcel />;
  }

  function EditExcelScreen() {
    return <EditExcel />;
  }
  return (
    <Tab.Navigator screenOptions={getTabScreenOptions(colors)}>
      <Tab.Screen name="AddExcel" component={AddExcelScreen} options={{ title: 'Dodaj Excel šablon' }} />
      <Tab.Screen name="EditExcel" component={EditExcelScreen} options={{ title: 'Izmeni Excel šablon' }} />
    </Tab.Navigator>
  );
}
