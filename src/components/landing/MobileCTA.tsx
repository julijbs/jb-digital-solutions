import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const MobileCTA = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/90 p-3 backdrop-blur-xl md:hidden">
      <Button variant="hero" className="w-full gap-2">
        Começar agora <ArrowRight size={16} />
      </Button>
    </div>
  );
};
