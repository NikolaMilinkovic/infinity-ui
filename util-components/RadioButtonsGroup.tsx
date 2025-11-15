import { useMemo, useState } from 'react';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';

function RadioButtonsGroup() {
  const radioButtons: RadioButtonProps[] = useMemo(
    () => [
      {
        id: '1', // acts as primary key, should be unique and non-empty string
        label: 'Option 1',
        value: 'option1',
      },
      {
        id: '2',
        label: 'Option 2',
        value: 'option2',
      },
    ],
    []
  );

  const [selectedId, setSelectedId] = useState<string | undefined>();

  return <RadioGroup radioButtons={radioButtons} onPress={setSelectedId} selectedId={selectedId} />;
}

export default RadioButtonsGroup;
