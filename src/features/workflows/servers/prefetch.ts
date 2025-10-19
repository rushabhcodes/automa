import { prefetch, trpc } from "@/trpc/server";
import { PAGINATION } from "@/config/constants";
import { inferInput } from "@trpc/tanstack-react-query";

type Input = inferInput<typeof trpc.workflows.getMany>;

export const prefetchWorkflows = (params?: Input) => {
    return prefetch(trpc.workflows.getMany.queryOptions(params || {
        page: PAGINATION.DEFAULT_PAGE,
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
        search: "",
    }));
};