"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Download } from "lucide-react";

export function SystemLogs() {
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [severity, setSeverity] = useState<string | null>(null);
  const [actionType, setActionType] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['logs', page, dateRange, severity, actionType],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '25',
      });

      if (dateRange?.from) params.set('startDate', dateRange.from.toISOString());
      if (dateRange?.to) params.set('endDate', dateRange.to.toISOString());
      if (severity) params.set('severity', severity);
      if (actionType) params.set('actionType', actionType);

      const response = await fetch(`/api/admin/logs?${params}`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      return response.json();
    },
    refetchInterval: refreshInterval,
  });

  async function handleExport(format: 'csv' | 'json') {
    try {
      const response = await fetch('/api/admin/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ format }),
      });

      if (!response.ok) throw new Error('Failed to export logs');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system-logs.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Logs exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export logs');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <DatePickerWithRange
            value={dateRange}
            onChange={setDateRange}
          />
          <Select value={severity || ''} onValueChange={setSeverity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All severities</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          <Select value={actionType || ''} onValueChange={setActionType}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All actions</SelectItem>
              <SelectItem value="user_update">User Update</SelectItem>
              <SelectItem value="bulk_update">Bulk Update</SelectItem>
              <SelectItem value="export">Export</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={refreshInterval.toString()}
            onValueChange={(value) => setRefreshInterval(parseInt(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Refresh interval" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Manual refresh</SelectItem>
              <SelectItem value="5000">5 seconds</SelectItem>
              <SelectItem value="15000">15 seconds</SelectItem>
              <SelectItem value="30000">30 seconds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => handleExport('csv')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            onClick={() => handleExport('json')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Admin</TableHead>
              <TableHead>Target</TableHead>
              <TableHead>Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.logs.map((log: any) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.created_at).toLocaleString()}
                </TableCell>
                <TableCell className="capitalize">
                  {log.action_type.replace('_', ' ')}
                </TableCell>
                <TableCell>{log.admin.email}</TableCell>
                <TableCell>
                  {log.target_type}/{log.target_id}
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {JSON.stringify(log.changes)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {data?.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
            disabled={page === data.totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}