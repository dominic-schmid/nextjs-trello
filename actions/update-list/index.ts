"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { createSafeAction } from "@/lib/create-safe-action";
import { createAuditLog } from "@/lib/create-autit-log";
import { db } from "@/lib/db";

import { InputType, ReturnType } from "./types";
import { UpdateList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId, title } = data;

  if (!title) {
    return {
      error: "Title cannot be empty!",
    };
  }

  let list;

  try {
    list = await db.list.update({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      data: {
        title,
      },
    });

    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.UPDATE,
    });
  } catch (err) {
    return {
      error: "Failed to update!",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const updateList = createSafeAction(UpdateList, handler);
