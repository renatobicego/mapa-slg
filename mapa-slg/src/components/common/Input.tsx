import { Input as HeroUIInput, InputProps } from "@heroui/react";

const Input = (props: InputProps) => {
  return (
    <HeroUIInput
      {...props}
      className={`w-full ${props.className}`}
      labelPlacement="outside"
      radius="lg"
      lang="es"
      isInvalid={props.errorMessage ? true : false}
    />
  );
};

export default Input;
