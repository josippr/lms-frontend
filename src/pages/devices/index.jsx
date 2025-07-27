import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { useReactTable, getCoreRowModel, getFilteredRowModel, getSortedRowModel, flexRender } from '@tanstack/react-table';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { fetchDevices } from '@/service/apiService';

export default function DevicesPage() {
  const [devices, setDevices] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');

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
      header: 'Trusted',
      cell: info => info.getValue()
    },
    {
      accessorKey: 'lastScan.type',
      header: 'Type',
      cell: info => info.row.original.lastScan?.type || '—'
    },
    {
      accessorKey: 'lastScan.active',
      header: 'Active',
      cell: info => (info.row.original.lastScan?.active ? 'Yes' : 'No')
    },
    {
      accessorKey: 'lastSeen',
      header: 'Last Seen',
      cell: info => new Date(info.getValue()).toLocaleString()
    }
  ];

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
    </div>
  );
}
