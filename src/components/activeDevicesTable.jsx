// components/ActiveDevicesTable.jsx
import { Badge } from "@/components/ui/badge";

/** @type import('@tanstack/react-table').ColumnDef[] */
export const deviceColumns = [
  {
    accessorKey: "ip",
    header: "IP Address",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: () => <Badge variant="default">Active</Badge>,
  },
];
