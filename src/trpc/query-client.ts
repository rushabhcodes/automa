import {
    defaultShouldDehydrateQuery,
    QueryClient,
} from '@tanstack/react-query';
/**
 * Creates a QueryClient preconfigured with project defaults for queries and dehydration.
 *
 * @returns A new QueryClient where queries use a 30,000 ms stale time and dehydration includes queries that satisfy React Query's default criteria or whose state status is `'pending'`.
 */
export function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30 * 1000,
            },
            dehydrate: {
                // serializeData: superjson.serialize,
                shouldDehydrateQuery: (query) =>
                    defaultShouldDehydrateQuery(query) ||
                    query.state.status === 'pending',
            },
            hydrate: {
                // deserializeData: superjson.deserialize,
            },
        },
    });
}