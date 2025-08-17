import { BanknoteX, Crown, Diamond, Gem, Star } from "lucide-react";

export function VipBadge({ ranked }: { ranked: number }) {

  return (
    <div className="absolute top-2 right-2 bg-yellow-500/70 w-12 h-12 z-[2] rounded-full flex items-center justify-center">
      {(() => {
        switch (ranked) {
          case 0:
            return <Star className="text-white" />;
          case 1:
            return <Crown className="text-white" />;
          case 2:
            return <Gem className="text-white" />;
          case 3:
            return <Diamond className="text-white" />;
          case 4:
            return <BanknoteX className="text-white" />;
          default:
            return null;
        }
      })()}
    </div>
  )
}