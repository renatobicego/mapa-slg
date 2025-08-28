"use client";
import { Button as HeroUIButton, ButtonProps } from "@heroui/react";

const Button = (props: ButtonProps) => {
  return (
    <HeroUIButton
      {...props}
      className={`h-11 bg-black text-white px-5 font-(family-name:--font-montserrat) font-semibold md:text-base  ${props.className}`}
    />
  );
};

export default Button;
