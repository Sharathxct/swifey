import * as React from 'react';
import { View } from 'react-native';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';

function Radio({ value, setValue }: any) {

  function onLabelPress(label: string) {
    return () => {
      setValue(label);
    };
  }
  return (
    <View className='flex flex-row  items-center '>
      <RadioGroup value={value} onValueChange={setValue} className='gap-3'>
        <RadioGroupItemWithLabel value='male' onLabelPress={onLabelPress('Default')} />
        <RadioGroupItemWithLabel value='female' onLabelPress={onLabelPress('Comfortable')} />
      </RadioGroup>
    </View>
  );
}

function RadioGroupItemWithLabel({
  value,
  onLabelPress,
}: {
  value: string;
  onLabelPress: () => void;
}) {
  return (
    <View className={'flex-row gap-2 items-center'}>
      <RadioGroupItem aria-labelledby={`label-for-${value}`} value={value} />
      <Label nativeID={`label-for-${value}`} onPress={onLabelPress}>
        {value}
      </Label>
    </View>
  );
}

export { Radio };
