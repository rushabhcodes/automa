import Link from "next/link";
import {
  AlertTriangleIcon,
  Loader2Icon,
  MoreVerticalIcon,
  PackageOpenIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { Input } from "./ui/input";

type EntityHeaderProps = {
  title: string;
  description?: string;
  newButtonLabel: string;
  disabled?: boolean;
  isCreating?: boolean;
} & (
  | { onNew: () => void; newButtonHref?: never }
  | { newButtonHref: string; onNew?: never }
  | { onNew?: never; newButtonHref?: never }
);

export const EntityHeader = ({
  title,
  description,
  newButtonLabel,
  disabled,
  isCreating,
  onNew,
  newButtonHref,
}: EntityHeaderProps) => {
  return (
    <div className="mb-4 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && (
          <p className="text-muted-foreground text-xs md:text-sm">
            {description}
          </p>
        )}
      </div>
      {onNew && !newButtonHref && (
        <Button onClick={onNew} disabled={disabled || isCreating}>
          <PlusIcon className="mr-2 h-4 w-4" />
          {newButtonLabel}
        </Button>
      )}
      {newButtonHref && !onNew && (
        <Button asChild>
          <Link href={newButtonHref} prefetch>
            <PlusIcon className="mr-2 h-4 w-4" />
            {newButtonLabel}
          </Link>
        </Button>
      )}
    </div>
  );
};

type EntityContainerProps = {
  header?: React.ReactNode;
  search?: React.ReactNode;
  pagination?: React.ReactNode;
  children: React.ReactNode;
};

export const EntityContainer = ({
  header,
  search,
  pagination,
  children,
}: EntityContainerProps) => {
  return (
    <div className="flex h-full w-full flex-col gap-4 p-6">
      {header}
      {search && <div className="flex justify-end">{search}</div>}
      <div className="flex-1 overflow-auto">{children}</div>
      {pagination && (
        <div className="border-border flex justify-end border-t pt-4">
          {pagination}
        </div>
      )}
    </div>
  );
};

interface EntitySearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}
export const EntitySearch = ({
  value,
  onChange,
  placeholder,
}: EntitySearchProps) => {
  return (
    <div className="relative ml-auto">
      <SearchIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      <Input
        className="bg-background border-border max-w-[200px] pl-8 shadow-none"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

interface EntityPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export const EntityPagination = ({
  page,
  totalPages,
  onPageChange,
  disabled,
}: EntityPaginationProps) => {
  return (
    <div className="flex w-full items-center justify-end gap-x-2">
      <Button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={disabled || page <= 1}
        variant="outline"
      >
        Previous
      </Button>
      <div className="flex items-center">
        Page {page} of {totalPages}
      </div>
      <Button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={disabled || page >= totalPages}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
};

interface StateViewProps {
  message?: string;
}

export const LoadingView = ({ message }: StateViewProps) => {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
      <Loader2Icon className="text-primary size-6 animate-spin" />
      {!!message && (
        <p className="text-muted-foreground mt-2 text-sm">{message}</p>
      )}
    </div>
  );
};

export const ErrorView = ({ message }: StateViewProps) => {
  return (
    <div className="flex h-full flex-1 flex-col items-center justify-center gap-y-4">
      <AlertTriangleIcon className="size-6" />
      {!!message && (
        <p className="text-muted-foreground mt-2 text-sm">{message}</p>
      )}
    </div>
  );
};

interface EmptyViewProps extends StateViewProps {
  onNew?: () => void;
}
export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
  return (
    <Empty className="border-border h-full w-full border-dashed bg-white p-4">
      <EmptyHeader>
        <EmptyMedia>
          <PackageOpenIcon />
        </EmptyMedia>
      </EmptyHeader>
      <EmptyTitle>No items</EmptyTitle>
      {!!message && <EmptyDescription>{message}</EmptyDescription>}
      {!!onNew && (
        <EmptyContent>
          <Button onClick={onNew} className="mt-4">
            Add Item
          </Button>
        </EmptyContent>
      )}
    </Empty>
  );
};

interface EntityListProprs<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  getKey?: (item: T, index: number) => string | number;
  emptyView?: React.ReactNode;
  className?: string;
}

export function EntityList<T>({
  items,
  renderItem,
  getKey,
  emptyView,
  className,
}: EntityListProprs<T>) {
  if (items.length === 0 && emptyView) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="mx-auto max-w-sm">{emptyView}</div>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col gap-y-4", className)}>
      {items.map((item, index) => (
        <div key={getKey ? getKey(item, index) : index}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}

interface EntityItemProprs {
  href: string;
  title: string;
  subtitle?: React.ReactNode;
  image: React.ReactNode;
  actions?: React.ReactNode;
  onRemove?: () => void | Promise<void>;
  isRemoving?: boolean;
  className?: string;
}

export const EntityItem = ({
  href,
  title,
  subtitle,
  image,
  actions,
  onRemove,
  isRemoving,
  className,
}: EntityItemProprs) => {
  const handleRemove = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isRemoving) return;
    if (onRemove) {
      await onRemove();
    }
  };

  return (
    <Link href={href} prefetch>
      <Card
        className={cn(
          "bg-card border-border cursor-pointer rounded-lg border p-4 transition-all hover:shadow-md",
          isRemoving && "cursor-not-allowed opacity-50",
          className,
        )}
      >
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-4">
              <div className="flex-shrink-0">{image}</div>
              <div className="min-w-0 flex-1">
                <CardTitle className="truncate text-base">{title}</CardTitle>
                {!!subtitle && (
                  <CardDescription className="mt-1 text-sm">
                    {subtitle}
                  </CardDescription>
                )}
              </div>
            </div>
            <div className="flex-shrink-0">
              {actions || onRemove ? (
                <div className="flex items-center space-x-2">
                  {actions}
                  {onRemove && (
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button size="icon" variant="ghost">
                          <MoreVerticalIcon className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <DropdownMenuItem onClick={handleRemove}>
                          <TrashIcon className="size-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
