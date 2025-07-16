import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { 
  ChevronRight,
  LayoutDashboard,
  CircleGauge,
  Network
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

import { useTranslation } from "react-i18next";

const iconMap = {
  LayoutDashboard,
  CircleGauge,
  Network,
};

export function NavMain() {
  const routes = useSelector((state) => state.profile.routes.mainRoutes);
  const { t } = useTranslation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {routes && routes.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link to={item.route}>
                  {Icon && <Icon className="w-5 h-5" />} 
                  <span>{t("generalConfig.routes." + item.name)}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}