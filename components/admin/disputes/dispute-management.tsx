"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Download, MoreHorizontal } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function DisputeManagement() {
  const router = useRouter();
  const [selectedDisputes, setSelectedDisputes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function handleBulkAction(action: string) {
    if (!selectedDisputes.length) {
      toast.error("Please select disputes to process");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/disputes/bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          disputeIds: selectedDisputes,
          action,
          updates: {
            status: action === 'resolve' ? 'resolved' : 'rejected',
            resolved_at: action === 'resolve' ? new Date().toISOString() : null,
          },
        }),
      });

      if (!response.ok) throw new Error("Failed to process bulk action");

      toast.success(`Successfully processed ${selectedDisputes.length} disputes`);
      setSelectedDisputes([]);
      router.refresh();
    } catch (error) {
      console.error("Bulk action error:", error);
      toast.error("Failed to process bulk action");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleExport(format: 'csv' | 'json') {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/admin/disputes/export?format=${format}`,
        { method: "GET" }
      );

      if (!response.ok) throw new Error("Failed to export data");

      // Trigger download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `disputes-export.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success("Export completed successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('resolve')}
            disabled={!selectedDisputes.length || isLoading}
          >
            Resolve Selected
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleBulkAction('reject')}
            disabled={!selectedDisputes.length || isLoading}
          >
            Reject Selected
          </Button>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleExport('csv')}>
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('json')}>
              Export as JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedDisputes.length > 0}
                  onCheckedChange={(checked) => {
                    // TODO: Implement select all
                  }}
                />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* TODO: Add dispute rows */}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}