"use client";

import * as React from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,  
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Pagination } from "@/components/ui/pagination";
import { formatWaktu } from "@/lib/time";

export function DataTable({
  columns = [],
  data = [],
  filterKey = "",
  filterOptions = [],
  onFilterSelect,
  onFilterChange,
  placeholderSearch,
  hide = false,
}) {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const isEmpty = !data || data.length === 0;

  return (
    <div className="w-full">

      <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-2">

        {filterKey && (
          <div className="w-[75%] md:w-[320px]">
            <Input
              placeholder={placeholderSearch || `Cari...`}
              value={table.getColumn(filterKey)?.getFilterValue() ?? ""}
              onChange={(event) => {
                const value = event.target.value;
                if (onFilterChange) onFilterChange(value);
                table.getColumn(filterKey)?.setFilterValue(value);
              }}
              className="border-black/10 dark:border-white/10"
            />
          </div>
        )}

        {!hide && (
          <div className="flex items-center gap-2 md:w-[25%] md:justify-end">
            {filterOptions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  asChild
                  className="bg-sidebar border border-black/10 dark:border-white/10 dark:hover:bg-sidebar/20"
                >
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10"
                >
                  {filterOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value || option.label}
                      onClick={() => onFilterSelect?.(option.value)}
                      className="capitalize cursor-pointer text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200/20 transition-colors"
                    >
                      {option.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                className="bg-sidebar border border-black/10 dark:border-white/10 dark:hover:bg-sidebar/20"
              >
                <Button variant="outline">
                  Columns <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10"
              >
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize cursor-pointer text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-200/20 transition-colors"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

      </div>

      <div className="relative w-full overflow-x-auto rounded-md border border-black/10 dark:border-white/10">
        <Table className="min-w-full text-sm">
          <TableHeader className="bg-sidebar text-white border-b border-black/10 dark:border-white/10">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const isNoOrAction =
                    header.column.id?.toLowerCase() === "no" ||
                    header.column.id?.toLowerCase() === "action";

                  return (
                    <TableHead
                      key={header.id}
                      className={`border-b border-black/10 dark:border-white/10 font-semibold whitespace-normal break-words px-6
                        ${
                          isNoOrAction || isEmpty
                            ? "w-auto text-center"
                            : "max-w-[280px]"
                        }
                      `}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-black/10 dark:border-white/5 bg-white dark:bg-neutral-950 hover:bg-muted/50"
                >
                  {row.getVisibleCells().map((cell) => {
                    const isNoOrAction =
                      cell.column.id?.toLowerCase() === "no" ||
                      cell.column.id?.toLowerCase() === "action";

                    let cellContent;

                    if (
                      cell.column.id === "start_date" ||
                      cell.column.id === "end_date"
                    ) {
                      cellContent = formatWaktu(cell.getValue(), "default");
                    } else {
                      cellContent = flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      );
                    }

                    return (
                      <TableCell
                        key={cell.id}
                        className={`border-b border-black/10 dark:border-white/5 whitespace-normal break-words
                          ${
                            isNoOrAction || isEmpty
                              ? "w-auto px-4 text-center"
                              : "max-w-[280px]"
                          }
                        `}
                      >
                        {cellContent}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  Data tidak ada yang ditemukan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <Pagination table={table} />
      </div>
    </div>
  );
}
