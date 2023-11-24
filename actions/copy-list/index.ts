"use server";

import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { createAuditLog } from "@/lib/create-autit-log";

import { InputType, ReturnType } from "./types";
import { CopyList } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;

  let list;

  try {
    const listToCopy = await db.list.findUnique({
      where: {
        id,
        boardId,
        board: {
          orgId,
        },
      },
      include: { cards: true },
    });

    if (!listToCopy) {
      return {
        error: "List not found!",
      };
    }

    const lastList = await db.list.findFirst({
      where: { boardId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const newOrder = lastList ? lastList.order + 1 : 0;

    list = await db.list.create({
      data: {
        boardId: listToCopy.boardId,
        title: `${listToCopy.title} (copy)`,
        order: newOrder,
        cards: {
          create: listToCopy.cards.map((card) => ({
            ...card,
          })),
        },
      },
      include: { cards: true },
    });

    await createAuditLog({
      entityId: list.id,
      entityTitle: list.title,
      entityType: ENTITY_TYPE.LIST,
      action: ACTION.CREATE,
    });
  } catch (err) {
    return {
      error: "Failed to copy list!" + JSON.stringify(err),
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const copyList = createSafeAction(CopyList, handler);
