"use client";

import { createId } from '@paralleldrive/cuid2';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { NodeType } from '@/generated/prisma';
import { GlobeIcon, MousePointerIcon } from 'lucide-react';
import { Separator } from './ui/separator';
import { useReactFlow } from '@xyflow/react';
import { useCallback } from 'react';
import { toast } from 'sonner';

export type NodeTypeOption = {
    type: NodeType;
    label: string;
    description: string;
    icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Manual Trigger",
        description: "Start workflow manually",
        icon: MousePointerIcon
    }

];

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description: "Make an HTTP request",
        icon: GlobeIcon
    }
];

interface NodeSelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    children: React.ReactNode;
}

export function NodeSelector({
    open,
    onOpenChange,
    children
}: NodeSelectorProps) {
    
    const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

    const handleNodeSelect = useCallback((selection: NodeTypeOption) => {
        if (selection.type === NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes();
            const hasManualTrigger = nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
            if (hasManualTrigger) {
                // Optionally show a notification to the user that only one manual trigger is allowed
                toast.error("Only one Manual Trigger node is allowed per workflow.");
                return;
            }
        }

        setNodes((nodes) => {
            const hasInitialTrigger = nodes.some((node) => node.type === NodeType.INITIAL);
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // Calculate offset to avoid placing nodes at the exact center
            const offsetX = (Math.random() - 0.5) * 300; // Random offset between -150 and 150
            const offsetY = (Math.random() - 0.5) * 300; // Random offset between -150 and 150

            const position = screenToFlowPosition({
                x: centerX + offsetX,
                y: centerY + offsetY,
            });

            const newNode = {
                id: createId(),
                data: {},
                position,
                type: selection.type,
            }

            if (hasInitialTrigger) {
                return [newNode]
            }

            return [...nodes, newNode];
        });
        onOpenChange(false);
    }, [setNodes, getNodes, screenToFlowPosition, onOpenChange]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange} >
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent className="w-full sm:w-[400px] flex flex-col">
                <SheetHeader>
                    <SheetTitle className="text-lg font-semibold">Select Node Type</SheetTitle>
                    <SheetDescription>Select the type of node you want to add</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto space-y-4">
                    <div>
                        <h3 className="text-sm font-medium mb-2 px-2">Triggers</h3>
                        {triggerNodes.map((nodeType) => {
                            const Icon = nodeType.icon;
                            return (
                                <div key={nodeType.type} className="flex items-center p-4 gap-4 hover:bg-accent rounded-md cursor-pointer transition-colors" onClick={() => handleNodeSelect(nodeType)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleNodeSelect(nodeType)}>
                                    <div className='flex items-center gap-6 w-full overflow-hidden'>
                                        {typeof Icon === 'string' ? (
                                            <img src={Icon} alt={nodeType.label} className="size-6 flex-shrink-0" />
                                        ) : (
                                            <Icon className="size-6 flex-shrink-0" />
                                        )}
                                        <div className='flex flex-col items-start text-left'>
                                            <span className='font-medium text-sm'>
                                                {nodeType.label}
                                            </span>
                                            <span className='text-xs text-muted-foreground overflow-hidden text-ellipsis'>
                                                {nodeType.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <Separator />
                    <div>
                        <h3 className="text-sm font-medium mb-2 px-2">Actions</h3>
                        {executionNodes.map((nodeType) => {
                            const Icon = nodeType.icon;
                            return (
                                <div key={nodeType.type} className="flex items-center p-4 gap-4 hover:bg-accent rounded-md cursor-pointer transition-colors" onClick={() => handleNodeSelect(nodeType)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && handleNodeSelect(nodeType)}>
                                    <div className='flex items-center gap-6 w-full overflow-hidden'>
                                        {typeof Icon === 'string' ? (
                                            <img src={Icon} alt={nodeType.label} className="size-6 flex-shrink-0" />
                                        ) : (
                                            <Icon className="size-6 flex-shrink-0" />
                                        )}
                                        <div className='flex flex-col items-start text-left'>
                                            <span className='font-medium text-sm'>
                                                {nodeType.label}
                                            </span>
                                            <span className='text-xs text-muted-foreground overflow-hidden text-ellipsis'>
                                                {nodeType.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}