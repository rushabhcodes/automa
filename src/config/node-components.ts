import { InitialNode } from "@/components/inital-node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { ManualTriggerNode } from "@/features/trigger/components/manual-trigger/node";
import { NodeType } from "@/generated/prisma";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
   [NodeType.INITIAL]: InitialNode,
   [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
   [NodeType.HTTP_REQUEST]: HttpRequestNode,
} as const satisfies NodeTypes;