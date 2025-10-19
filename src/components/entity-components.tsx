import { PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

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
                    <p className="text-xm md:text-sm text-muted-foreground">
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