"use client";

import { MoreHorizontal, XIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { deleteBoard } from "@/actions/delete-board";

interface BoardOptionProps {
  id: string;
}

export const BoardOptions = ({ id }: BoardOptionProps) => {
  const { execute, isLoading } = useAction(deleteBoard, {
    onError(error) {
      toast.error(error);
    },
  });

  const onDelete = () => {
    execute({ id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board actions
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          onClick={onDelete}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          disabled={isLoading}
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
};
