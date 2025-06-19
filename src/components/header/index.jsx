import React from "react"
import { useSelector, useDispatch } from "react-redux";

import { Button } from "@heroui/react";

import UserCircle from "../../assets/icons/iconsCircle";
import SearchIcon from "../../assets/icons/search";
import GlobeIcon from "../../assets/icons/globe";

function Header() {

  return (
    <header className="bg-transparent w-min h-16 flex items-center justify-end gap-4 absolute top-0 right-0">
      <Button isIconOnly aria-label="Like" variant="bordered">
        <SearchIcon className="text-zinc-300" />
      </Button>
      <Button isIconOnly aria-label="Like" variant="bordered">
        <GlobeIcon className="text-zinc-300" />
      </Button>
      <Button isIconOnly aria-label="Like" variant="bordered">
        <UserCircle className="text-zinc-300" />
      </Button>
    </header>
)};

export default Header;