import * as React from "react"
import { GlobeLock } from "lucide-react";

export function TeamSwitcher({
  teams
}) {

  return (
    <div className="w-full">
      <div size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground w-full flex flex-row items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-primary-foreground">
        <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
          <GlobeLock className="size-4" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-medium">LMS</span>
          <span className="truncate text-xs">Lite</span>
        </div>
      </div>
    </div>
  );
}
