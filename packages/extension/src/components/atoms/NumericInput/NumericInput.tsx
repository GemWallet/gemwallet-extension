import { ChangeEvent, FC, useCallback, useState } from 'react';

import { TextField, TextFieldProps } from '@mui/material';

export interface NumericInputProps extends Omit<TextFieldProps, 'value'> {}

export const NumericInput: FC<NumericInputProps> = (props) => {
  const [value, setValue] = useState<string>('');

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^[0-9]{1,}[.]{0,1}[0-9]{0,}$/; // only int and float numbers
      if (e.target.value === '' || regex.test(e.target.value)) {
        setValue(e.target.value);
      }
      props.onChange?.(e);
    },
    [props]
  );

  return <TextField value={value} {...props} onChange={handleChange} />;
};
