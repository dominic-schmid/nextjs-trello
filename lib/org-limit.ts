import { auth } from "@clerk/nextjs";

import { db } from "@/lib/db";
import { MAX_FREE_BOARDS } from "@/constants/boards";

// TODO since this is a lib file I think it's better to pass the orgId as a param to the helper functions instead of accessing clerk hooks

export const incrementAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId },
  });

  await db.orgLimit.upsert({
    where: { orgId },
    create: { orgId, count: 1 },
    update: { count: (orgLimit?.count ?? 0) + 1 },
  });
};

export const decrementAvailableCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  // If doesn't exist treat it as has no boards -> 0
  const orgLimit = (await db.orgLimit.findUnique({
    where: { orgId },
  })) ?? { count: 0 };

  await db.orgLimit.upsert({
    where: { orgId },
    create: { orgId, count: 1 },
    update: { count: orgLimit.count > 0 ? orgLimit.count - 1 : 0 },
  });
};

/**
 * Check if the current organization has available boards
 * @returns true if the org has available boards
 */
export const hasAvailableBoardCount = async () => {
  const { orgId } = auth();

  if (!orgId) {
    throw new Error("Unauthorized");
  }

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId },
  });

  return !orgLimit || orgLimit.count < MAX_FREE_BOARDS;
};

export const getAvailableBoardCount = async () => {
  const { orgId } = auth();

  if (!orgId) return 0; // Used only for UI helpers

  const orgLimit = await db.orgLimit.findUnique({
    where: { orgId },
  });

  return orgLimit?.count ?? 0;
};
