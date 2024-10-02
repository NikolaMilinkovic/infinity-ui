import React, { useState } from 'react'

function AddColor() {
  const [colorData, setColorData] = useState({
    color: '',
    colorCode: '',
    sizes: [
      {size: 'XS', stock: 0},
      {size: 'S', stock: 0},
      {size: 'M', stock: 0},
      {size: 'L', stock: 0},
      {size: 'XL', stock: 0},
      {size: 'UNI', stock: 0}
    ]
  });
  return (
    
  )
}

export default AddColor