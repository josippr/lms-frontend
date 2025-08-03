import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import UserCircle from "../../assets/icons/iconsCircle";
import SearchIcon from "../../assets/icons/search";
import GlobeIcon from "../../assets/icons/globe";
import SunIcon from "../../assets/icons/sun";
import MoonIcon from "../../assets/icons/moon";

import { setTheme, setLanguage } from "../../redux/actions/config";

function Header() {
  const theme = useSelector((state) => state.config.theme);
  const locale = useSelector((state) => state.config.language);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const handleThemeChange = () => {
    const currentTheme = typeof theme === "string" ? theme : "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    dispatch(setLanguage(language));

  };

  return (
    <header className="bg-transparent w-full h-12 flex items-center justify-end gap-4 absolute top-0 right-0 border-1 border-background">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <span variant="outline" size="icon" aria-label="Change language">
            <GlobeIcon className="text-zinc-300" />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
              {t("generalConfig.language.en")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleLanguageChange("hr")}>
              {t("generalConfig.language.hr")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>

      <Button size="icon" variant="outline" onClick={handleThemeChange}>
        {theme === "light" ? (
          <SunIcon className="text-zinc-300" />
        ) : (
          <MoonIcon className="text-zinc-300" />
        )}
      </Button>
    </header>
  );
}

export default Header;