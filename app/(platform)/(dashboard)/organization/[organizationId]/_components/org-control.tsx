"use client";

import { useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";

/**
 * Is used to set the active organization in the organization list programmatically, depending on the org id in the url.
 */
export const OrgControl = () => {
  const params = useParams();
  const { setActive } = useOrganizationList();

  useEffect(() => {
    if (!setActive) return;

    setActive({
      organization: params.organizationId as string,
    });
  }, [setActive, params.organizationId]);
  return null;
};
