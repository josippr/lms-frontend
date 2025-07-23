// components/ActiveDevicesTable.jsx
import { Badge } from "@/components/ui/badge";
import { BadgeCheckIcon } from "lucide-react";

/** @type import('@tanstack/react-table').ColumnDef[] */
export const deviceColumns = [
  {
    accessorKey: "ip",
    header: "IP Address",
  },
  {
    accessorKey: "deviceName",
    header: "Device Name",
    cell: ({ row }) => {
      const deviceName = row.getValue("deviceName");
      return <span className="font-medium">{deviceName}</span>;
    },
  },
  {
    accessorKey: "hostname",
    header: "Hostname",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "model",
    header: "Model",
  },
  {
    accessorKey: "macAddress",
    header: "MAC Address",
    cell: ({ row }) => {
      const mac = row.getValue("macAddress");
      return <span className="font-mono text-sm">{mac}</span>;
    },
  },
  {
    accessorKey: "lastSeen",
    header: "Last Seen",
    cell: ({ row }) => {
      const lastSeen = row.getValue("lastSeen");
      return <span className="text-sm text-muted-foreground">{lastSeen}</span>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: () => <Badge variant="outline" className="bg-green-500 text-white dark:bg-green-600"><BadgeCheckIcon />Active</Badge>,
  },
];
