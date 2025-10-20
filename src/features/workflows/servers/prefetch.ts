import { inferInput } from "@trpc/tanstack-react-query";

import { PAGINATION } from "@/config/constants";
import { prefetch, trpc } from "@/trpc/server";

type Input = inferInput<typeof trpc.workflows.getMany>;

export const prefetchWorkflows = (params?: Input) => {
  return prefetch(
    trpc.workflows.getMany.queryOptions(
      params || {
        page: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
        search: "",
      },
    ),
  );
};

export const prefetchWorkflow = (workflowId: string) => {
  return prefetch(
    trpc.workflows.getOne.queryOptions({
      workflowId,
    }),
  );
};
