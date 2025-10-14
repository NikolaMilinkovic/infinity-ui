import { useState } from 'react';
import ImagePicker from '../../util-components/ImagePicker';

interface SetAppIconPropTypes {
  appIcon: any;
  setAppIcon: any;
}

function SetAppIcon({ appIcon, setAppIcon }: SetAppIconPropTypes) {
  const [previewImage, setPreviewImage] = useState(appIcon);

  async function onTakeImageHandler(img: any) {
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
