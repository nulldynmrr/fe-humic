import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function Pagination({ table }) {
  const totalPages = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;
  const pageButtons = [];

  const maxButtons = 5;
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageButtons.push(i);
    } else if (i === currentPage - 2 || i === currentPage + 2) {
      pageButtons.push("...");
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-4 gap-3">
      <div className="flex items-center space-x-2 text-sm">
        <Select
          value={String(pageSize)}
          onValueChange={(value) => table.setPageSize(Number(value))}
          className="border border-bg-black/20"
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10">
            {[10, 20, 30, 40, 50].map((size) => (
              <SelectItem
                key={size}
                value={String(size)}
                className="
        capitalize cursor-pointers
        text-black dark:text-white
        hover:bg-gray-100 dark:hover:bg-gray-200/20
        transition-colors
      "
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="font-medium">Rows per page</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {pageButtons.map((num, i) =>
            num === "..." ? (
              <span key={i} className="px-2 text-muted-foreground">
                ...
              </span>
            ) : (
              <Button
                key={i}
                variant={num === currentPage ? "default" : "outline"}
                size="sm"
                className={`h-8 w-8 p-0 ${
                  num === currentPage
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-transparent"
                }`}
                onClick={() => table.setPageIndex(num - 1)}
              >
                {num}
              </Button>
            )
          )}

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
