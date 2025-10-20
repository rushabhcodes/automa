"use client";

import "@xyflow/react/dist/style.css";

import { useCallback, useState } from "react";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  StepEdge,
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
} from "@xyflow/react";
import { useSetAtom } from "jotai";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { nodeComponents } from "@/config/node-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { editorAtom } from "../store/atoms";
import { AddNodeButton } from "./add-node-button";

export const EditorLoading = () => {
  return <LoadingView message="Loading Editor" />;
};

export const EditorError = () => {
  return <ErrorView message="Failed to load Editor" />;
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
  const { data: workflow } = useSuspenseWorkflow(workflowId);

  const setEditor = useSetAtom(editorAtom);

  const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
  const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      nodeTypes={nodeComponents}
      onInit={setEditor}
      snapGrid={[10, 10]}
      snapToGrid={true}
      proOptions={{
        hideAttribution: true,
      }}
      panOnScroll={true}
      panOnDrag={false}
      selectionOnDrag={true}
    >
      <Background />
      <Controls />
      <MiniMap />
      <Panel position="top-right">
        <AddNodeButton />
      </Panel>
    </ReactFlow>
  );
};
