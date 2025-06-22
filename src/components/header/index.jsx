import React from "react"
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@heroui/react";

import UserCircle from "../../assets/icons/iconsCircle";
import SearchIcon from "../../assets/icons/search";
import GlobeIcon from "../../assets/icons/globe";
import SunIcon from "../../assets/icons/sun";
import MoonIcon from "../../assets/icons/moon";

import { setTheme } from "../../redux/actions/config";

import LanguageSwitcher from "./languageSwitch";

function Header() {

  const theme = useSelector((state) => state.config.theme);
  const dispatch = useDispatch();

  const handleThemeChange = () => {
    const currentTheme = typeof theme === "string" ? theme : "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
  }


  return (
    <header className="bg-transparent w-min h-16 flex items-center justify-end gap-4 absolute top-0 right-0">
      <Button isIconOnly aria-label="Like" variant="bordered">
        <SearchIcon className="text-zinc-300" />
      </Button>
      <Button isIconOnly aria-label="Like" variant="bordered">
        {/* <GlobeIcon className="text-zinc-300" /> */}
        <LanguageSwitcher />
      </Button>
      <Button isIconOnly aria-label="Like" variant="bordered">
        <UserCircle className="text-zinc-300" />
      </Button>
      <Button isIconOnly aria-label="Toggle theme" variant="bordered" onClick={handleThemeChange}>
        {theme === "light" ? (
          <SunIcon className="text-zinc-300" />
        ) : (
          <MoonIcon className="text-zinc-300" />
        )}
      </Button>
    </header>
  )};

export default Header;