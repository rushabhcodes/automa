"use client";

import { memo } from "react";
import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { NodeProps, Position } from "@xyflow/react";
import { WorkflowNode } from "@/components/workflow-node";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";

interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: React.ReactNode;
    onSettings?: () => void;
    onDoubleClick?: () => void;
};

export const BaseTriggerNode = memo(({
    icon: Icon,
    name,
    description,
    children,
    onSettings,
    onDoubleClick,
    ...props
}: BaseTriggerNodeProps) => {
    // TODO: implement delete handler
    const handleDelete = () => { };
    return (
        <WorkflowNode name={name} description={description} onSettings={onSettings} onDelete={handleDelete}>
            {/* TODO: Wrap within NodeStatusIndicator */}
            <BaseNode onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
                <BaseNodeContent>
                    {typeof Icon === "string" ? (
                        <Image src={Icon} alt={name} width={16} height={16} />
                    ) : (
                        <Icon className="size-4 text-muted-foreground" />
                    )}
                    {children}
                    <BaseHandle id="source-1" type="source" position={Position.Right} />
                </BaseNodeContent>
            </BaseNode>
        </WorkflowNode>
    );
});

BaseTriggerNode.displayName = "BaseTriggerNode";