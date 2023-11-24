"use client";

import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";

import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/types";
import { FormTextArea } from "@/components/form/form-textarea";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/update-card";

interface DescriptionProps {
  data: CardWithList;
}

export const Description = ({ data }: DescriptionProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const [isEditing, setIsEditing] = useState(false);

  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => textAreaRef.current?.focus());
  };

  const disableEditing = () => setIsEditing(false);

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id],
      });
      toast.success(`Card ${data.title} updated.`);
      disableEditing();
    },
    onError(error) {
      toast.error(error);
    },
  });

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    const boardId = params.boardId as string;

    execute({ id: data.id, boardId, description });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold to-neutral-700 mb-2">Description</p>
        {isEditing ? (
          <form ref={formRef} action={onSubmit} className="space-y-2">
            <FormTextArea
              id="description"
              className="w-full mt-2"
              placeholder="Add a more detailed description..."
              defaultValue={data.description || undefined}
              ref={textAreaRef}
              errors={fieldErrors}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button type="button" onClick={disableEditing} variant="ghost">
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            role="button"
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
            onClick={enableEditing}
          >
            {data.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-324 h-6 mb-2  bg-neutral-200" />
        <Skeleton className="w-full h-[78px]  bg-neutral-200" />
      </div>
    </div>
  );
};
