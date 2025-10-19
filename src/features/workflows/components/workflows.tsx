'use client';

import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export const WorkflowsList = () => {
    const { data: workflows } = useSuspenseWorkflows();

    return (
        <div className=" flex flex-col gap-4 justify-center items-center">
            {workflows?.items?.map((workflow) => (
                <div key={workflow.id}>{workflow.name}</div>
            ))}
        </div>
    );
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

