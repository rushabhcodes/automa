"use client";

import { memo, useState } from "react";
import { NodeProps } from "@xyflow/react";
import { MousePointerIcon } from "lucide-react";

import { BaseTriggerNode } from "../base-trigger-node";
import { ManualTriggerDialog } from "./dialog";

export const ManualTriggerNode = memo((props: NodeProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const nodeStatus = "initial";
  const handleOpenSettings = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      <BaseTriggerNode
        {...props}
        icon={MousePointerIcon}
        name="Manual Trigger"
        onDoubleClick={handleOpenSettings}
        onSettings={handleOpenSettings}
        status={nodeStatus}
      ></BaseTriggerNode>
    </>
  );
});

ManualTriggerNode.displayName = "ManualTriggerNode";
