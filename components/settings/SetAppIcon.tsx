import React, { useState } from 'react';
import ImagePicker from '../../util-components/ImagePicker';
import { betterConsoleLog } from '../../util-methods/LogMethods';

interface SetAppIconPropTypes {
  appIcon: any;
  setAppIcon: any;
}

function SetAppIcon({ appIcon, setAppIcon }: SetAppIconPropTypes) {
  const [previewImage, setPreviewImage] = useState(appIcon);

  async function onTakeImageHandler(img: any) {
    betterConsoleLog('img is:', img);
    setAppIcon(img);
  }

  return (
    <ImagePicker
      previewImage={previewImage}
      setPreviewImage={setPreviewImage}
      onTakeImage={(img) => onTakeImageHandler(img)}
      showCamera={false}
    />
  );
}

export default SetAppIcon;
