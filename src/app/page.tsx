'use client';

import { Button } from "@/components/ui/button";

import { useTRPC } from "@/trpc/client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function Home() {

  const trpc = useTRPC();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      toast.success("Workflow creation queued");
    }
  }));

  const testAi = useMutation(trpc.testAi.mutationOptions());

  return (
    <div>
      <h1>Workflows</h1>
      <ul>
        {data?.map((workflow) => (
          <li key={workflow.id}>{workflow.name}</li>
        ))}
      </ul>
      <Button
        onClick={() => {
          create.mutate();
        }}
        disabled={create.isPending}
      >
        Create Workflow
      </Button>

      <div style={{ marginTop: 20 }}>
        <h2>Test AI</h2>
        <Button
          onClick={() => {
            testAi.mutate();
          }}
          disabled={testAi.isPending}
        >
          Generate Poem
        </Button>
        {testAi.data && (
          <p style={{ marginTop: 10 }}>{testAi.data}</p>
        )}
      </div>
    </div>
  );
}