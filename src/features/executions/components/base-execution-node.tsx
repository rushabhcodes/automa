"use client";

import { memo } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { NodeProps, Position } from "@xyflow/react";
import { WorkflowNode } from "@/components/workflow-node";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";

interface BaseExecutionNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: React.ReactNode;
    onSettings?: () => void;
    onDoubleClick?: () => void;
};

export const BaseExecutionNode = memo(({
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
    ...props
}: BaseExecutionNodeProps) => {
    // TODO: implement delete handler
    const handleDelete = () => { };
    return (
        <WorkflowNode name={name} description={description} onSettings={onSettings} onDelete={handleDelete}>
            {/* TODO: Wrap within NodeStatusIndicator */}
            <BaseNode onDoubleClick={onDoubleClick}>
                <BaseNodeContent>
                    {typeof Icon === "string" ? (
                        <Image src={Icon} alt={name} width={16} height={16} />
                    ) : (
                        <Icon className="size-4 text-muted-foreground" />
                    )}
                    {children}
                    <BaseHandle id="target-1" type="target" position={Position.Left} />
                    <BaseHandle id="source-1" type="source" position={Position.Right} />
                </BaseNodeContent>
            </BaseNode>
        </WorkflowNode>
    );
});

BaseExecutionNode.displayName = "BaseExecutionNode";