import { AlertTriangleIcon, Loader2Icon, MoreVerticalIcon, PackageOpenIcon, PlusIcon, SearchIcon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "./ui/empty";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

type EntityHeaderProps = {
    title: string;
    description?: string;
    newButtonLabel: string;
    disabled?: boolean;
    isCreating?: boolean;
} & (
        | { onNew: () => void; newButtonHref?: never; }
        | { newButtonHref: string; onNew?: never; }
        | { onNew?: never; newButtonHref?: never; }
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
        <div className="flex items-center justify-between mb-4">
            <div>
                <h1 className="text-2xl font-bold">{title}</h1>
                {description && (
                    <p className="text-xs md:text-sm text-muted-foreground">
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
                    <Link href={newButtonHref} prefetch >
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
        <div className="flex flex-col h-full w-full p-6 gap-4">
            {header}
            {search && <div className="flex justify-end">{search}</div>}
            <div className="flex-1 overflow-auto">
                {children}
            </div>
            {pagination && <div className="flex justify-end pt-4 border-t border-border">{pagination}</div>}
        </div>
    );
};

interface EntitySearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}
export const EntitySearch = ({ value, onChange, placeholder }: EntitySearchProps) => {
    return (
        <div className="relative ml-auto">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="max-w-[200px] bg-background shadow-none border-border pl-8"
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
        <div className="flex items-center justify-end gap-x-2 w-full">

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
        <div className="flex flex-col items-center justify-center h-full flex-1 gap-y-4">
            <Loader2Icon className="animate-spin size-6 text-primary" />
            {!!message && (
                <p className="mt-2 text-sm text-muted-foreground">
                    {message}
                </p>
            )}
        </div>
    );
}



export const ErrorView = ({ message }: StateViewProps) => {
    return (
        <div className="flex flex-col items-center justify-center h-full flex-1 gap-y-4">
            <AlertTriangleIcon className="size-6" />
            {!!message && (
                <p className="mt-2 text-sm text-muted-foreground">
                    {message}
                </p>
            )}
        </div>
    );
}

interface EmptyViewProps extends StateViewProps {
    onNew?: () => void;
}
export const EmptyView = ({ message, onNew }: EmptyViewProps) => {
    return (
        <Empty className="border-border border-dashed bg-white p-4 h-full w-full">
            <EmptyHeader>
                <EmptyMedia>
                    <PackageOpenIcon />
                </EmptyMedia>
            </EmptyHeader>
            <EmptyTitle>
                No items
            </EmptyTitle>
            {!!message && (
                <EmptyDescription>
                    {message}
                </EmptyDescription>
            )}
            {!!onNew && (
                <EmptyContent>
                    <Button onClick={onNew} className="mt-4">
                        Add Item
                    </Button>
                </EmptyContent>
            )}
        </Empty>
    );
}

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
            <div className="flex flex-1 justify-center items-center">
                <div className="max-w-sm mx-auto">{emptyView}</div>
            </div>
        )
    }
    return (
        <div className={cn("flex flex-col gap-y-4", className)}>
            {items.map((item, index) => (
                <div key={getKey ? getKey(item, index) : index}>
                    {renderItem(item, index)}
                </div>
            ))}
        </div>
    )
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
    className
}: EntityItemProprs) => {

    const handleRemove = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isRemoving) return;
        if (onRemove) {
            await onRemove();
        }
    }

    return <Link href={href} prefetch>
        <Card className={cn(
            "p-4 bg-card rounded-lg border border-border hover:shadow-md transition-all cursor-pointer",
            isRemoving && "opacity-50 cursor-not-allowed",
            className
        )}>
            <CardContent className="p-0">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0">
                            {image}
                        </div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-base truncate">{title}</CardTitle>
                            {!!subtitle && <CardDescription className="text-sm mt-1">{subtitle}</CardDescription>}
                        </div>
                    </div>
                    <div className="flex-shrink-0">
                        {actions || onRemove ? (
                            <div className="flex items-center space-x-2">
                                {actions}
                                {onRemove &&
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                            <Button size="icon" variant="ghost">
                                                <MoreVerticalIcon className="size-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenuItem onClick={handleRemove}>
                                                <TrashIcon className="size-4" />
                                                Remove
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                }
                            </div>
                        ) : null}
                    </div>
                </div>
            </CardContent>
        </Card>
    </Link>
}