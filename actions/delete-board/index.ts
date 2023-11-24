"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { createSafeAction } from "@/lib/create-safe-action";
import { decrementAvailableCount } from "@/lib/org-limit";
import { createAuditLog } from "@/lib/create-autit-log";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { DeleteBoard } from "./schema";
import { checkSubscription } from "@/lib/subscription";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const isPro = await checkSubscription();

  const { id } = data;

  try {
    const board = await db.board.delete({
      where: {
        id,
        orgId,
      },
    });

    if (!isPro) await decrementAvailableCount();

    await createAuditLog({
      entityId: board.id,
      entityTitle: board.title,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE,
    });
  } catch (err) {
    return {
      error: "Failed to delete!",
    };
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
