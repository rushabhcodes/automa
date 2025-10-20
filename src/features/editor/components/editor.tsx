"use client";

import '@xyflow/react/dist/style.css';
import { editorAtom } from '../store/atoms';
import { useState, useCallback } from 'react';
import { AddNodeButton } from './add-node-button';
import { useSetAtom } from 'jotai';
import { nodeComponents } from '@/config/node-components';
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, type Node, type Edge, type NodeChange, type EdgeChange, type Connection, Background, Controls, MiniMap, StepEdge, Panel } from '@xyflow/react';

export const EditorLoading = () => {
    return <LoadingView message="Loading Editor" />;
}

export const EditorError = () => {
    return <ErrorView message="Failed to load Editor" />;
}


export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);

    const setEditor = useSetAtom(editorAtom);

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        [],
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        [],
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
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
                hideAttribution: true
            }}
            panOnScroll={true}
            panOnDrag={false}
            selectionOnDrag={true}
        >
            <Background />
            <Controls />
            <MiniMap />
            <Panel position='top-right'>
                <AddNodeButton />
            </Panel>
        </ReactFlow>
    );
}