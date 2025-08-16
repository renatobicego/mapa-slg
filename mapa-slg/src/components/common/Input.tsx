import { Input as HeroUIInput, InputProps } from "@heroui/react";

interface CustomInputProps extends InputProps {
  showGrouped?: true;
  position?: "top" | "bottom" | "center" | "left" | "right";
}

const Input = (props: CustomInputProps) => {
  const getRadiusByPosition = (position: string) => {
    switch (position) {
      case "top":
        return "rounded-b-none";
      case "bottom":
        return "rounded-t-none";
      case "center":
        return "rounded-none";
      case "left":
        return "rounded-r-none";
      case "right":
        return "rounded-l-none";
    }
  };
  const borderRadus = props.showGrouped
    ? getRadiusByPosition(props.position || "center")
    : "";
  return (
    <HeroUIInput
      {...props}
      className={`w-full ${props.className}`}
      classNames={{
        inputWrapper: [
          "shadow-sm",
          "bg-default-200/50",
          "dark:bg-default/60",
          "backdrop-blur-xl",
          "backdrop-saturate-200",
          "hover:bg-default-200/70",
          "dark:hover:bg-default/70",
          "group-data-[focus=true]:bg-default-200/50",
          "dark:group-data-[focus=true]:bg-default/60",
          "cursor-text!",
          borderRadus,
        ],
        innerWrapper: "bg-transparent",

        input: [
          "bg-transparent",
          "text-black/90 dark:text-white/90",
          "placeholder:text-default-700/50 dark:placeholder:text-white/60",
        ],
      }}
      labelPlacement="outside"
      radius="lg"
      lang="es"
      isInvalid={props.errorMessage ? true : false}
    />
  );
};

export default Input;
