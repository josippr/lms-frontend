import { useSelector, useDispatch } from "react-redux";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button, Image } from "@heroui/react";
import { setLanguage } from "../../../redux/actions/config";
import { useTranslation } from 'react-i18next';
import Flag from 'react-world-flags';


function LanguageSwitcher() {
  const locale = useSelector((state) => state.config.language);
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();

  const handleChange = (value) => {
    const selectedValue = Array.isArray(value) ? value[0] : value.toString();
    i18n.changeLanguage(selectedValue);
    dispatch(setLanguage(selectedValue));
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button 
          variant="light"
          isIconOnly
          radius="full"
        >
          {locale.locale === "en" ? <Image src="./images/EN-icon.png" width={25} /> : <Image src="./images/HR-icon.png" width={25} />}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" onAction={handleChange}>
        <DropdownItem key="en" value="en"><span className="flex items-center gap-2 text-lg"><Flag code="gb" width={40}/>{t('generalConfig.language.en')}</span></DropdownItem>
        <DropdownItem key="hr" value="hr"><span className="flex items-center gap-2 text-lg"><Flag code="hr" width={40}/>{t('generalConfig.language.hr')}</span></DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default LanguageSwitcher;