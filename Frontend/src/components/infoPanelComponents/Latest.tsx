import { useMediaQuery } from "usehooks-ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import { Card, CardHeader } from "@/components/ui/card.tsx";
import { Minus } from "lucide-react";

const Latest = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      {isMobile && (
        <Sheet>
          <SheetTrigger asChild>
            <Card role={"button"}>
              <CardHeader className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                <Minus />
                Senaste Nytt
              </CardHeader>
            </Card>
          </SheetTrigger>
          <SheetContent side={"bottom"}>
            <SheetHeader>
              <SheetTitle>Senaste Nytt</SheetTitle>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default Latest;
