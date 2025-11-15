import { MaterialIcons } from '@expo/vector-icons';
import { Platform, Pressable, StyleSheet, Switch, TextInput, View } from 'react-native';
import { useDrawerModal } from '../../../store/modals/drawer-modal-contex';
import { BoutiqueTypes, useBoutiques } from '../../../store/superAdmin/boutiques-context';
import { ThemeColors } from '../../../store/theme-context';
import Button from '../../../util-components/Button';
import CustomText from '../../../util-components/CustomText';

interface EditBoutiqueItemPropTypes {
  boutique: BoutiqueTypes;
  colors: ThemeColors;
}

function EditBoutiqueItem({ boutique, colors }: EditBoutiqueItemPropTypes) {
  const { setEditedBoutique } = useBoutiques();
  const styles = getItemStyles(colors);
  const { openDrawer } = useDrawerModal();

  const handleOpenDrawer = () => {
    setEditedBoutique(boutique);
    openDrawer(<EditBoutiqueItemControls colors={colors} />, boutique._id);
  };

  return (
    <Pressable style={styles.boutiqueItem} onPress={handleOpenDrawer}>
      <View style={styles.left}>
        <CustomText variant="bold" style={styles.boutiqueName}>
          {boutique.boutiqueName}
        </CustomText>
        <CustomText style={styles.boutiqueId}>{boutique._id}</CustomText>
      </View>
      <CustomText
        variant="bold"
        style={[styles.activity, { color: boutique.isActive ? colors.success : colors.error }]}
      >
        {boutique.isActive ? 'Active' : 'Inactive'}
      </CustomText>
    </Pressable>
  );
}

function getItemStyles(colors: ThemeColors) {
  return StyleSheet.create({
    boutiqueItem: {
      padding: 16,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
      marginBottom: 4,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: 4,
      shadowColor: colors.primaryDark,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 1,
    },
    left: {
      flexDirection: 'column',
      flex: 1,
    },
    boutiqueName: {
      fontSize: 16,
      color: colors.defaultText,
      fontWeight: '500',
    },
    boutiqueId: {
      fontSize: 12,
      color: colors.secondaryText,
      marginTop: 2,
    },
    activity: {
      fontSize: 14,
      fontWeight: '600',
      textAlign: 'right',
    },
  });
}

export default EditBoutiqueItem;

interface EditBoutiqueItemControlsPropTypes {
  colors: ThemeColors;
}

function EditBoutiqueItemControls({ colors }: EditBoutiqueItemControlsPropTypes) {
  const { editedBoutique, setEditedBoutique } = useBoutiques();
  const styles = getControlsStyles(colors);

  if (!editedBoutique) return null;

  async function updateBoutiqueHandler() {
    // handle update logic
  }

  function goToBoutiqueHandler() {
    // navigate to boutique or open boutique view
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholderTextColor={colors.grayText}
        cursorColor={colors.highlight}
        placeholder="Ime butika"
        value={editedBoutique.boutiqueName}
        onChangeText={(text) => setEditedBoutique((prev) => ({ ...prev, boutiqueName: text }))}
        selectionColor={colors.highlight}
      />

      <View style={styles.row}>
        <CustomText style={styles.label}>Aktivan klijent?</CustomText>
        <Switch
          value={editedBoutique.isActive}
          onValueChange={() => setEditedBoutique((prev) => ({ ...prev, isActive: !prev?.isActive }))}
          trackColor={{ false: colors.grayText, true: colors.highlight }}
          thumbColor={colors.thumbColor}
          style={styles.switch}
        />
      </View>

      <View style={styles.buttons}>
        <Button
          onPress={goToBoutiqueHandler}
          textColor={colors.defaultText}
          backColor={colors.buttonNormal1}
          backColor1={colors.buttonNormal2}
          containerStyles={styles.buttonStyle}
        >
          Take this ID
        </Button>
        <Button
          onPress={updateBoutiqueHandler}
          textColor={colors.whiteText}
          backColor={colors.buttonHighlight1}
          backColor1={colors.buttonHighlight2}
          containerStyles={styles.buttonStyle}
        >
          <MaterialIcons name="check" size={26} color={colors.whiteText} />
        </Button>
      </View>
    </View>
  );
}

function getControlsStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      marginTop: '20%',
      flexDirection: 'column',
      minHeight: '80%',
    },
    input: {
      borderBottomColor: colors.borderColor,
      borderBottomWidth: 1,
      marginBottom: 16,
      fontSize: 16,
      paddingVertical: 10,
      color: colors.defaultText,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    label: {
      fontSize: 14,
      color: colors.secondaryText,
      flex: 2,
    },
    switch: {
      marginLeft: 'auto',
      transform: Platform.select({
        ios: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
        android: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
      }),
    },
    buttons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 10,
      marginTop: 'auto',
    },
    buttonStyle: {
      flex: 1,
      maxHeight: 40,
    },
  });
}
