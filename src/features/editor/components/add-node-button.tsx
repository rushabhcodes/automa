"use client";

import { memo, useState } from "react";
import { PlusIcon } from "lucide-react";

import { NodeSelector } from "@/components/node-selector";
import { Button } from "@/components/ui/button";

export const AddNodeButton = memo(() => {
  const [selectorOpen, setSelectorOpen] = useState(false);
  return (
    <NodeSelector open={selectorOpen} onOpenChange={setSelectorOpen}>
      <Button size="icon" variant="outline" className="bg-background">
        <PlusIcon className="size-4" />
      </Button>
    </NodeSelector>
  );
});

AddNodeButton.displayName = "AddNodeButton";
