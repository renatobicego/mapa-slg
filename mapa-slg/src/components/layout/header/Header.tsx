"use client";
import { useHeroStore } from "@/stores/useHeroStore";
import {
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
} from "@heroui/react";
import React from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isVisible } = useHeroStore();

  const menuItems = [
    "Inicio",
    "Mi Perfil",
    "Sumarme al Mapa",
    "Nuestra Historia",
    "¿Cómo Participar?",
    "Cerrar Sesión",
  ];

  return (
    <Navbar
      className={`
        transition-all duration-700
        ${
          isVisible
            ? "opacity-0 -translate-y-8 pointer-events-none"
            : "opacity-100 translate-y-0"
        }
      `}
      classNames={{
        base: "bg-transparent p-4",
        wrapper: `bg-white shadow-md rounded-xl transition-all duration-100  ${
          isMenuOpen ? "rounded-b-none shadow-none delay-100" : "delay-300"
        } max-w-xl`,
        menu: `mx-4 w-auto pt-32 shadow-lg rounded-xl `,
      }}
      isBlurred={false}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="!basis-full">
        <NavbarBrand className="h-full">
          <Image
            alt="Logo"
            src="/logo.png"
            classNames={{
              wrapper: "w-full h-full py-1.5",
              img: "object-contain h-full",
            }}
          />
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link color="foreground" href="#">
            Features
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current="page" href="#">
            Customers
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="#">
            Integrations
          </Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex">
          <Link href="#">Login</Link>
        </NavbarItem>
        <NavbarItem>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="sm:hidden bg-black text-white h-9 w-9 rounded-full 
                       [&>span]:before:h-[1.3px] [&>span]:after:h-[1.3px] 
                       [&>span]:before:w-[17px] [&>span]:after:w-[17px]"
          />
        </NavbarItem>
      </NavbarContent>

      <NavbarMenu
        motionProps={{
          initial: { height: "0dvh", y: -40 },
          animate: {
            height: isMenuOpen ? "90dvh" : "0dvh",
            y: isMenuOpen ? 0 : -40,
          },
          exit: { height: "0dvh", y: -60 },
          transition: {
            duration: 0.5,
            height: { duration: 0.3 },
            y: { duration: 0.5 },
          },
        }}
        className="overflow-hidden"
      >
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
