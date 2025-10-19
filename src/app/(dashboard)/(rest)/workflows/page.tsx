import { WorkflowsContainer, WorkflowsError, WorkflowsHeader, WorkflowsList, WorkflowsLoading } from "@/features/workflows/components/workflows";
import { workflowParamsLoader } from "@/features/workflows/servers/params-loader";
import { prefetchWorkflows } from "@/features/workflows/servers/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

type Props = {
    searchParams: Promise<SearchParams>;
};
const Page = async ({ searchParams }: Props) => {
    await requireAuth();
    const params = await workflowParamsLoader(searchParams);
    prefetchWorkflows(params);
    return (
        <WorkflowsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<WorkflowsError />}>
                    <Suspense fallback={<WorkflowsLoading />}>
                        <WorkflowsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowsContainer>
    );
};

export default Page;