import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

const DAY_IN_MS = 1000 * 60 * 60 * 24; // = 86400000

export const checkSubscription = async () => {
  const { orgId } = auth();

  if (!orgId) return false;

  const orgSubscription = await db.orgSubscription.findUnique({
    where: { orgId },
    select: {
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true,
      stripeSubscriptionId: true,
    },
  });

  if (!orgSubscription) return false;

  const isValid =
    orgSubscription.stripePriceId &&
    orgSubscription.stripeCurrentPeriodEnd?.getTime()! +
      DAY_IN_MS /* buffer of 1 day */ >
      Date.now();

  return !!isValid;
};
