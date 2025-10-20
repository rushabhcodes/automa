"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAtomValue } from "jotai";
import { SaveIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  useSuspenseWorkflow,
  useUpdateWorkflow,
  useUpdateWorkflowName,
} from "../workflows/hooks/use-workflows";
import { editorAtom } from "./store/atoms";

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
  const editor = useAtomValue(editorAtom);

  const saveWorkflow = useUpdateWorkflow();

  const handleSave = () => {
    if (!editor) return;

    const nodes = editor.getNodes();
    const edges = editor.getEdges();

    saveWorkflow.mutate({
      workflowId,
      nodes,
      edges,
    });
  };
  return (
    <div className="ml-auto">
      <Button size="sm" onClick={handleSave} disabled={saveWorkflow.isPending}>
        <SaveIcon className="size-4" />
        {workflowId ? "Save Changes" : "Create Workflow"}
      </Button>
    </div>
  );
};

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);
  const updateWorkflowName = useUpdateWorkflowName();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(workflow.name);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (workflow.name) {
      setName(workflow.name);
    }
  }, [workflow.name]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = async () => {
    if (name === workflow.name) {
      setIsEditing(false);
      return;
    }
    try {
      await updateWorkflowName.mutateAsync({
        workflowId,
        name,
      });
    } catch (error) {
      setName(workflow.name);
      console.error("Failed to update workflow name:", error);
    } finally {
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      inputRef.current?.blur(); // Blur to trigger onBlur instead of calling handleSave directly
    } else if (e.key === "Escape") {
      e.preventDefault();
      setName(workflow.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        disabled={updateWorkflowName.isPending}
        ref={inputRef}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className="h-7 w-auto max-w-xs min-w-[100px] px-2"
      />
    );
  }

  return (
    <BreadcrumbItem
      onClick={() => {
        setIsEditing(true);
      }}
      className="hover:text-foreground cursor-pointer transition-colors"
    >
      {workflow.name}
    </BreadcrumbItem>
  );
};

export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link prefetch href={`/workflows`}>
              Workflows
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <EditorNameInput workflowId={workflowId} />
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
  return (
    <header className="bg-background flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <div className="flex w-full flex-row items-center justify-between gap-x-4">
        <EditorBreadcrumbs workflowId={workflowId} />
        <EditorSaveButton workflowId={workflowId} />
      </div>
    </header>
  );
};
