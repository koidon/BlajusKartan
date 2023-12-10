import { useMediaQuery } from "usehooks-ts";
import { Link, useRouter } from "@tanstack/react-router";
import { ElementRef, useRef } from "react";
import { cn } from "@/lib/utils.ts";
import Logo from "@/assets/icon.svg";
import { History, Home } from "lucide-react";

const Navigation = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const currentRoute = useRouter().state.location.pathname;
  const sidebarRef = useRef<ElementRef<"aside">>(null);

  return (
    <nav
      ref={sidebarRef}
      className={cn(
        "shrink-0 group/sidebar h-full bg-gray-50 overflow-y-auto flex w-20 shadow-xl ",
        isMobile
          ? "w-full h-20 align-middle justify-center top-0"
          : "flex-col relative z-[99999]",
      )}
    >
      {!isMobile && (
        <div className="flex- items-center border-b gap-2">
          <img src={Logo} alt="Logo" />
        </div>
      )}
      {currentRoute === "/" && (
        <>
          <div className="group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex flex-col items-center text-muted-foreground font-medium">
            <History />
            <Link
              to="/history"
              className="block py-2 px-3 text-blue-500"
              activeProps={{ className: `font-bold` }}
            >
              Historik
            </Link>
          </div>
        </>
      )}
      {currentRoute === "/history" && (
        <div className="group min-h-[27px] text-sm py-1 pr-3 w-full hover:bg-primary/5 flex flex-col items-center text-muted-foreground font-medium">
          <Home />
          <Link
            to="/"
            className="block py-2 px-3 text-blue-500"
            activeProps={{ className: `font-bold` }}
          >
            Hem
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
