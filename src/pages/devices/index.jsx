import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogDescription, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { ArrowUp, ArrowDown, Settings } from 'lucide-react';
import { fetchDevices, updateDeviceTrust } from '@/service/apiService';

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTrust, setSelectedTrust] = useState('');

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No authentication token found.');
          return;
        }
        const response = await fetchDevices(token);
        setDevices(response.devices || []);
      } catch (err) {
        console.error('Failed to fetch devices:', err);
      }
    };
    loadDevices();
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      console.log('Selected device:', selectedDevice);
    }
  }, [selectedDevice]);

  const columns = [
    {
      accessorKey: 'mac',
      header: 'MAC Address',
      cell: info => info.getValue()
    },
    {
      accessorKey: 'hostname',
      header: 'Hostname',
      cell: info => info.getValue()
    },
    {
      accessorKey: 'lastIP',
      header: 'IP Address',
      cell: info => info.getValue()
    },
    {
      accessorKey: 'trusted',
      header: 'Trust',
      cell: info => {
        const trustStatus = info.getValue();
        let color = 'default';
        let label = '';

        switch (trustStatus) {
          case 'trusted':
            color = 'success';
            label = 'Trusted';
            break;
          case 'neutral':
            color = 'warning';
            label = 'Neutral';
            break;
          case 'untrusted':
            color = 'destructive';
            label = 'Untrusted';
            break;
          default:
            color = 'secondary';
            label = 'Unknown';
        }

        return <Badge variant={color}>{label}</Badge>;
      }
    },
    {
      accessorKey: 'lastScan.type',
      header: 'Type',
      cell: info => info.row.original.lastScan?.type || '—'
    },
    {
      accessorKey: 'lastScan.active',
      header: 'Active',
      cell: info => {
        const active = info.row.original.lastScan?.active;
        return (
          <Badge variant={active ? 'success' : 'destructive'}>
            {active ? 'Active' : 'Inactive'}
          </Badge>
        );
      }
    },
    {
      accessorKey: 'lastSeen',
      header: 'Last Seen',
      cell: info => new Date(info.getValue()).toLocaleString()
    },
    {
  id: 'actions',
  header: '',
  cell: ({ row }) => {
    const device = row.original;

    return (
      <Button variant="ghost" size="icon" onClick={() => {
        setSelectedDevice(device);
        setSelectedTrust(device.trusted);
        setDialogOpen(true);
      }}>
        <Settings className="h-4 w-4" />
      </Button>
    );
  }
}];

  const table = useReactTable({
    data: devices,
    columns,
    state: {
      globalFilter
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return value?.toString().toLowerCase().includes(filterValue.toLowerCase());
    }
  });

  return (
    <div className="p-4 space-y-4">
      <Toaster />
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Network Devices</h2>
        <Input
          placeholder="Search..."
          value={globalFilter}
          onChange={e => setGlobalFilter(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="border rounded-xl shadow-sm">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id} onClick={header.column.getToggleSortingHandler()} className="cursor-pointer select-none">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {{
                      asc: <ArrowUp className="inline ml-1" />,
                      desc: <ArrowDown className="inline ml-1" />
                    }[header.column.getIsSorted()] ?? null}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map(row => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">No matching devices found.</div>
        )}
      </div>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedDevice?.hostname || 'Device'} settings</DialogTitle>
            <p className="text-sm text-muted-foreground"> Change trust level for {selectedDevice?.hostname || 'device'}</p>
          </DialogHeader>

          <Select value={selectedTrust} onValueChange={setSelectedTrust}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select trust level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trusted">Trusted</SelectItem>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="untrusted">Untrusted</SelectItem>
            </SelectContent>
          </Select>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="mt-4" disabled={!selectedDevice}>Confirm</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>Are you sure?</AlertDialogHeader>
              <AlertDialogDescription>This will change trust level of <strong>{selectedDevice?.hostname || 'device'}</strong> to <strong>{selectedTrust}</strong>.</AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={async () => {
                  try {
                    const token = localStorage.getItem('token');
                    await updateDeviceTrust(token, selectedDevice.mac, selectedTrust);
                    setDialogOpen(false);
                    const response = await fetchDevices(token);
                    setDevices(response.devices || []);
                    toast.success(`Trust level updated to "${selectedTrust}" for ${selectedDevice.hostname || 'device'}`, {
                      style: { backgroundColor: "#16a34a", color: "white" },
                    });
                  } catch (err) {
                    console.error(err);
                    toast.error('Failed to update trust level');
                  }
                }}>Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogContent>
      </Dialog>
    </div>
  );
}
