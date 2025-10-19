import { PlusIcon, SearchIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { Input } from "./ui/input";

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
        <div className="p-6 rounded-lg shadow-sm h-full">
            <div className="mx-auto max-w-screen w-full flex flex-col">
                {header}
                <div className="flex flex-col">
                    {search}
                    {children}
                </div>
                {pagination && <div className="mt-4">{pagination}</div>}
            </div>
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
        <div className="flex items-center justify-end space-x-2">

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