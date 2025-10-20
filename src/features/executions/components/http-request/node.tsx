"use client";

import { memo, useState } from "react";
import { Node, NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import z from "zod";

import { BaseExecutionNode } from "../base-execution-node";
import { formSchema, HttpRequestDialog } from "./dialog";

type HttpRequestNodeData = {
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  body?: string;
  [key: string]: unknown;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setNodes } = useReactFlow();

  const nodeStatus = "initial";

  const nodeData = props.data;
  const description = nodeData?.endpoint
    ? `${nodeData.method || "GET"}: ${nodeData.endpoint}`
    : "Not Configured";

  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    setNodes((nodes) =>
      nodes.map((node) => {
        if (node.id === props.id) {
          return {
            ...node,
            data: {
              ...node.data,
              endpoint: values.endpoint,
              method: values.method,
              body: values.body,
            },
          };
        }
        return node;
      }),
    );
  };

  return (
    <>
      <HttpRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
        defaultEndpoint={nodeData.endpoint}
        defaultMethod={nodeData.method}
        defaultBody={nodeData.body}
      />
      <BaseExecutionNode
        {...props}
        icon={GlobeIcon}
        name="HTTP Request"
        status={nodeStatus}
        description={description}
        onDoubleClick={handleOpenSettings}
        onSettings={handleOpenSettings}
      ></BaseExecutionNode>
    </>
  );
});

HttpRequestNode.displayName = "HttpRequestNode";
