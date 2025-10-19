'use client';

import { formatDistanceToNow } from "date-fns";
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination, EntitySearch, ErrorView, LoadingView } from "@/components/entity-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import type { Workflow as PrismaWorkflow } from "@/generated/prisma";
import { WorkflowIcon } from "lucide-react";

export const WorkflowsList = () => {
    const { data: workflows } = useSuspenseWorkflows();

    return <EntityList
        items={workflows.items}
        getKey={(w) => w.id}
        renderItem={(workflow) => <WorkflowItem workflow={workflow} />}
        emptyView={<WorkflowsEmpty />}
    />
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal } = useUpgradeModal();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (error) => {
                handleError(error);
            }
        });
    };
    return (
        <>
            {modal}
            <EntityHeader
                title="Workflows"
                description="Create and manage your workflows"
                newButtonLabel="Create Workflow"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
                onNew={handleCreate}
            />
        </>
    )
};

export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams,
    });
    return <EntitySearch value={searchValue} onChange={onSearchChange} placeholder="Search workflows..." />;
}

export const WorkflowsPagination = () => {
    const [params, setParams] = useWorkflowsParams();
    const workflows = useSuspenseWorkflows();

    return <EntityPagination
        page={params.page}
        totalPages={workflows?.data.pagination.totalPages}
        disabled={workflows?.isLoading}
        onPageChange={(page) => setParams({ ...params, page })}
    />;
}

export const WorkflowsContainer = ({ children }: { children: React.ReactNode }) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    );
}


export const WorkflowsLoading = () => {
    return <LoadingView message="Loading Workflows..." />;
}

export const WorkflowsError = () => {
    return <ErrorView message="Error loading Workflows." />;
}

export const WorkflowsEmpty = () => {
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();
    const { handleError, modal } = useUpgradeModal();

    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`);
            },
            onError: (error) => {
                handleError(error);
            }
        });
    }

    return <>
        {modal}
        <EmptyView message="No workflows found. Get started by creating your first workflow" onNew={handleCreate} />
    </>
}

export const WorkflowItem = ({ workflow }: { workflow: PrismaWorkflow }) => {
    const removeWorkflow = useRemoveWorkflow();

    const handleRemove = () => {
        removeWorkflow.mutate({ workflowId: workflow.id });
    }
    return (
        <EntityItem
            title={workflow.name}
            href={`/workflows/${workflow.id}`}
            subtitle={<>
                Updated {formatDistanceToNow(workflow.updatedAt, { addSuffix: true })}{" "}
                &bull; Created {" "}
                {formatDistanceToNow(workflow.createdAt, { addSuffix: true })}
            </>}
            image={<div className="size-8 flex items-center justify-center"
            ><WorkflowIcon className="size-5" /> </div>}
            onRemove={handleRemove}
            isRemoving={removeWorkflow.isPending}
        />
    );
}