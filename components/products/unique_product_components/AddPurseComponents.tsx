import React from 'react'
import ColorStockInputs from '../../../util-components/ColorStockInputs'

interface PropTypes {

}
function AddPurseComponents({ 
  purseColors,
  setPurseColors
 }:PropTypes) {
  return (
    <ColorStockInputs
      colorsData={purseColors}
      setColorsData={setPurseColors}
    />
  )
}

export default AddPurseComponents