import { PurseColorTypes } from '../../../../types/allTsTypes';
import ColorStockInputs from '../../../../util-components/ColorStockInputs';

interface PropTypes {
  purseColors: PurseColorTypes[];
  setPurseColors: (data: any) => void;
}

function AddPurseComponents({ purseColors, setPurseColors }: PropTypes) {
  return <ColorStockInputs colorsData={purseColors} setColorsData={setPurseColors} />;
}

export default AddPurseComponents;
