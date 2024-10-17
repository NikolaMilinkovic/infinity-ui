import React from 'react'
import ColorStockInputs from '../../../../util-components/ColorStockInputs'
import { PurseColorTypes } from '../../../../types/allTsTypes'

interface PropTypes {
  purseColors: PurseColorTypes[]
  setPurseColors: (data: any) => void
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