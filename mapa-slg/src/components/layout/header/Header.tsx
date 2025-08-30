"use client";
import { siteConfig } from "@/app/config";
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
import { usePathname } from "next/navigation";
import React from "react";
import AddMeMapModal from "../AddMeMapModal";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

type MenuItem = {
  label: string;
  href?: string;
  modal?: React.ReactNode;
  signOut?: boolean;
  loggedIn?: boolean;
  signIn?: boolean;
  component?: React.ReactNode;
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isVisible: isHeroSectionShowed } = useHeroStore();
  const [prevDataExists, setPrevDataExists] = React.useState(false);
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const addMeModal = (
    <AddMeMapModal
      button={
        <button className="font-semibold text-black text-large cursor-pointer">
          {prevDataExists ? "Editar Mi Pin" : "Sumarme al Mapa"}
        </button>
      }
      onPreviousData={setPrevDataExists}
    />
  );

  const menuItems: MenuItem[] = [
    { label: "Inicio", href: siteConfig.pages.home },
    { label: "Mi Perfil", href: siteConfig.pages.profile, loggedIn: true },
    {
      label: "Sumarme al Mapa",
      modal: addMeModal,
      loggedIn: true,
    },
    { label: "Nuestra Historia", href: siteConfig.pages.history },
    { label: "¿Cómo Participar?", href: siteConfig.pages.help },
    { label: "Cerrar Sesión", signOut: true },
  ];

  const desktopItems: MenuItem[] = [
    {
      label: "Sumarme al Mapa",
      modal: addMeModal,
      loggedIn: true,
    },
    { label: "Nuestra Historia", href: siteConfig.pages.history },
    { label: "¿Cómo Participar?", href: siteConfig.pages.help },
    {
      label: "Mi Perfil",
      component: (
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "!w-10 !h-10 border-2 border-gray-300",
            },
          }}
        />
      ),
      loggedIn: true,
    },
    { label: "Iniciar Sesión", signIn: true },
  ];

  const isVisible = isHeroSectionShowed && pathname === siteConfig.pages.home;

  const renderMenuItem = ({
    label,
    href,
    modal,
    signOut,
    loggedIn,
    signIn,
    component,
  }: MenuItem) => {
    const baseClasses = "text-black font-semibold";

    if (component) {
      return loggedIn ? (
        isSignedIn ? (
          <SignedIn>{component}</SignedIn>
        ) : null
      ) : (
        component
      );
    }

    if (signIn && !isSignedIn) {
      return (
        <SignedOut>
          <SignInButton>
            <button className="font-semibold text-yellow cursor-pointer text-large">
              Iniciar Sesión
            </button>
          </SignInButton>
        </SignedOut>
      );
    }

    if (href) {
      return loggedIn ? (
        isSignedIn ? (
          <SignedIn>
            <Link className={baseClasses} href={href} size="lg">
              {label}
            </Link>
          </SignedIn>
        ) : null
      ) : (
        <Link className={baseClasses} href={href} size="lg">
          {label}
        </Link>
      );
    }

    if (modal) {
      return loggedIn ? (
        isSignedIn ? (
          <SignedIn>{modal}</SignedIn>
        ) : null
      ) : (
        modal
      );
    }

    if (signOut) {
      return (
        <>
          <SignedIn>
            <SignOutButton>
              <button className="font-semibold text-danger text-large cursor-pointer">
                {label}
              </button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="font-semibold text-yellow cursor-pointer text-large">
                Iniciar Sesión
              </button>
            </SignInButton>
          </SignedOut>
        </>
      );
    }

    return null;
  };

  return (
    <Navbar
      className={`transition-all duration-700 ${
        isVisible
          ? "opacity-0 -translate-y-8 pointer-events-none"
          : "opacity-100 translate-y-0"
      }`}
      classNames={{
        base: "bg-transparent p-4",
        wrapper: `bg-white shadow-md rounded-xl transition-all duration-100 ${
          isMenuOpen ? "rounded-b-none shadow-none" : ""
        } max-w-screen-xl`,
        menu: `mx-4 w-auto pt-32 shadow-lg rounded-xl`,
      }}
      isBlurred={false}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Brand */}
      <NavbarContent className="!basis-full">
        <NavbarBrand className="h-full" as={Link} href={siteConfig.pages.home}>
          <Image
            alt="Logo"
            src={"/logo.png"}
            srcSet="/logo-grande.png 2x"
            classNames={{
              wrapper: "w-full h-full py-1.5",
              img: "object-contain h-full",
            }}
          />
        </NavbarBrand>
      </NavbarContent>

      {/* Center items */}
      <NavbarContent
        className="hidden lg:flex gap-6 items-center pt-0.5"
        justify="center"
      >
        {desktopItems
          .map((item) => {
            const element = renderMenuItem(item);
            return element ? { ...item, element } : null;
          })
          .filter(Boolean) // remove nulls
          .map((item, index) => (
            <NavbarItem key={`${item!.label}-${index}`}>
              {item!.element}
            </NavbarItem>
          ))}
      </NavbarContent>

      {/* Right items */}
      <NavbarContent justify="end">
        <NavbarItem>
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            className="lg:hidden bg-black text-white h-9 w-9 rounded-full 
                       [&>span]:before:h-[1.3px] [&>span]:after:h-[1.3px] 
                       [&>span]:before:w-[17px] [&>span]:after:w-[17px]"
          />
        </NavbarItem>
      </NavbarContent>

      {/* Mobile menu */}
      <NavbarMenu
        motionProps={{
          initial: { height: "0dvh", opacity: 0, y: -20 },
          animate: {
            height: isMenuOpen ? "90dvh" : "0dvh",
            opacity: isMenuOpen ? 1 : 0,
            y: isMenuOpen ? 0 : -20,
          },
          exit: { height: "0dvh", opacity: 0, y: -20 },
          transition: {
            duration: 0.3,
            height: { duration: 0.3 },
            opacity: { duration: 0.2 },
            y: { duration: 0.3 },
          },
        }}
        className="overflow-hidden"
      >
        {menuItems
          .map((item) => {
            const element = renderMenuItem(item);
            return element ? { ...item, element } : null;
          })
          .filter(Boolean) // remove nulls
          .map((item, index) => (
            <NavbarMenuItem key={`${item!.label}-${index}`}>
              {item!.element}
            </NavbarMenuItem>
          ))}
      </NavbarMenu>
    </Navbar>
  );
};

export default Header;
