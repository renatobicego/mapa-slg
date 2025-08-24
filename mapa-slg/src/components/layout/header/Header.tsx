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
  useUser,
} from "@clerk/nextjs";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { isVisible: isHeroSectionShowed } = useHeroStore();
  const { isSignedIn } = useUser();
  const pathname = usePathname();

  const menuItems = [
    { label: "Inicio", href: siteConfig.pages.home },
    { label: "Mi Perfil", href: siteConfig.pages.profile, loggedIn: true },
    {
      label: "Sumarme al Mapa",
      modal: (
        <AddMeMapModal
          button={
            <button className="font-semibold text-black">
              Sumarme al Mapa
            </button>
          }
        />
      ),
      loggedIn: true,
    },
    { label: "Nuestra Historia", href: siteConfig.pages.history },
    { label: "¿Cómo Participar?", href: siteConfig.pages.help },
    { label: "Cerrar Sesión", signOut: true },
  ];

  const isVisible = isHeroSectionShowed && pathname === siteConfig.pages.home;

  const renderMenuItem = ({
    label,
    href,
    modal,
    signOut,
    loggedIn,
  }: (typeof menuItems)[number]) => {
    const baseClasses = "text-black font-semibold";

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
              <button className="font-semibold text-danger">{label}</button>
            </SignOutButton>
          </SignedIn>
          <SignedOut>
            <SignInButton>
              <button className="font-semibold text-yellow">
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
        } max-w-xl`,
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
            src="/logo.png"
            classNames={{
              wrapper: "w-full h-full py-1.5",
              img: "object-contain h-full",
            }}
          />
        </NavbarBrand>
      </NavbarContent>

      {/* Center items */}
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link className="text-black font-bold" href="#">
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

      {/* Right items */}
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
