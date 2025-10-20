"use client";

import { useCallback } from "react";
import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { toast } from "sonner";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@/generated/prisma";
import { Separator } from "./ui/separator";

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
    icon: MousePointerIcon,
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make an HTTP request",
    icon: GlobeIcon,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function NodeSelector({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) {
  const { setNodes, getNodes, screenToFlowPosition } = useReactFlow();

  const handleNodeSelect = useCallback(
    (selection: NodeTypeOption) => {
      if (selection.type === NodeType.MANUAL_TRIGGER) {
        const nodes = getNodes();
        const hasManualTrigger = nodes.some(
          (node) => node.type === NodeType.MANUAL_TRIGGER,
        );
        if (hasManualTrigger) {
          // Optionally show a notification to the user that only one manual trigger is allowed
          toast.error("Only one Manual Trigger node is allowed per workflow.");
          return;
        }
      }

      setNodes((nodes) => {
        const hasInitialTrigger = nodes.some(
          (node) => node.type === NodeType.INITIAL,
        );
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
        };

        if (hasInitialTrigger) {
          return [newNode];
        }

        return [...nodes, newNode];
      });
      onOpenChange(false);
    },
    [setNodes, getNodes, screenToFlowPosition, onOpenChange],
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex w-full flex-col sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="text-lg font-semibold">
            Select Node Type
          </SheetTitle>
          <SheetDescription>
            Select the type of node you want to add
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 space-y-4 overflow-y-auto">
          <div>
            <h3 className="mb-2 px-2 text-sm font-medium">Triggers</h3>
            {triggerNodes.map((nodeType) => {
              const Icon = nodeType.icon;
              return (
                <div
                  key={nodeType.type}
                  className="hover:bg-accent flex cursor-pointer items-center gap-4 rounded-md p-4 transition-colors"
                  onClick={() => handleNodeSelect(nodeType)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleNodeSelect(nodeType)
                  }
                >
                  <div className="flex w-full items-center gap-6 overflow-hidden">
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        alt={nodeType.label}
                        className="size-6 flex-shrink-0"
                      />
                    ) : (
                      <Icon className="size-6 flex-shrink-0" />
                    )}
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium">
                        {nodeType.label}
                      </span>
                      <span className="text-muted-foreground overflow-hidden text-xs text-ellipsis">
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
            <h3 className="mb-2 px-2 text-sm font-medium">Actions</h3>
            {executionNodes.map((nodeType) => {
              const Icon = nodeType.icon;
              return (
                <div
                  key={nodeType.type}
                  className="hover:bg-accent flex cursor-pointer items-center gap-4 rounded-md p-4 transition-colors"
                  onClick={() => handleNodeSelect(nodeType)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleNodeSelect(nodeType)
                  }
                >
                  <div className="flex w-full items-center gap-6 overflow-hidden">
                    {typeof Icon === "string" ? (
                      <img
                        src={Icon}
                        alt={nodeType.label}
                        className="size-6 flex-shrink-0"
                      />
                    ) : (
                      <Icon className="size-6 flex-shrink-0" />
                    )}
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium">
                        {nodeType.label}
                      </span>
                      <span className="text-muted-foreground overflow-hidden text-xs text-ellipsis">
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
  );
}
