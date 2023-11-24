import { auth, currentUser } from "@clerk/nextjs";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

import { db } from "@/lib//db";

interface Props {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
}

export const createAuditLog = async (props: Props) => {
  const { orgId } = auth();
  const user = await currentUser();

  if (!user || !orgId) {
    throw new Error("User not found!");
  }

  const { action, entityId, entityTitle, entityType } = props;

  await db.auditLog.create({
    data: {
      action,
      entityId,
      entityTitle,
      entityType,
      orgId,
      userId: user.id,
      userImage: user?.imageUrl,
      userName: user?.firstName + " " + user?.lastName,
    },
  });
  try {
  } catch (error) {
    console.error("[AUDIT_LOG_ERROR]", error);
  }
};
