import { ChevronRight } from "lucide-react";

const FILTER_SECTIONS = ["Filters", "Price", "Tags"];

export function CatalogFilters() {
  return (
    <div className="space-y-4">
      {FILTER_SECTIONS.map((label) => (
        <div
          key={label}
          className="flex items-center justify-between border px-4 py-3 text-sm font-medium"
        >
          <span>{label}</span>
          <ChevronRight className="text-muted-foreground size-4" />
        </div>
      ))}
    </div>
  );
}
