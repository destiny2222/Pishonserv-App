import { TextInput, TextInputProps } from 'react-native'
import React from 'react'

type props = TextInputProps & {
  className?: string;
}

export default function TextInputField({className, style, ...props}: props) {
  
  return (
    <TextInput 
      className={className}
      style={[{ borderRadius: 8, padding: 20}, style]}
      {...props}
    />
  );
}