"use client";

import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";

import { Sidebar } from "./sidebar";
import { Logo } from "@/components/logo";

export const MobileSidebar = () => {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  //   const onOpen = useMobileSidebar((state) => state.onOpen);
  //   const onClose = useMobileSidebar((state) => state.onClose);
  //   const isOpen = useMobileSidebar((state) => state.isOpen);
  const { onOpen, onClose, isOpen } = useMobileSidebar((state) => state);

  useEffect(() => {
    // Note: According to React principles, calling a setState function in an effect is an anti-pattern and should be more than avoided.
    // Updated note: THIS is not anti pattern since it is not set setting a state that the effect depends on, which would cause many rerenders

    // "Guarantee" a componenet is only rendered on the client and not during SSR because there might be state mismatch of the sidebar state on the server vs the client
    setIsMounted(true);
  }, []);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!isMounted) return null;

  return (
    <>
      <Button
        onClick={onOpen}
        className="block md:hidden mr-2"
        variant="ghost"
        size="sm"
      >
        <Menu className="h-4 w-4" />
      </Button>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent side="left" className="p-2 pt-10 ">
          <div className="w-full flex justify-center mb-3">
            <Logo responsive={false} />
          </div>

          <Sidebar storageKey="t-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  );
};
