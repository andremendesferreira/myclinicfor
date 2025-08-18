import { Crown, Diamond, Gem, Star } from "lucide-react";

export function VipBadge({ ranked }: { ranked: number }) {

  let className: string;

    switch (ranked) {
        case 0:
        className = "absolute top-2 right-2 bg-yellow-500/70 w-12 h-12 z-[2] rounded-full flex items-center justify-center";
        break;
        case 1:
        className = "absolute top-2 right-2 bg-green-500/70 w-12 h-12 z-[2] rounded-full flex items-center justify-center";
        break;
        case 2:
        className = "absolute top-2 right-2 bg-blue-500/70 w-12 h-12 z-[2] rounded-full flex items-center justify-center";
        break;
        case 3:
        className = "absolute top-2 right-2 bg-gray-500/70 w-12 h-12 z-[2] rounded-full flex items-center justify-center";
        break;
        default:
        className = "";
    }

  return (
    <div className={className}>
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
          default:
            return null;
        }
      })()}
    </div>
  )
}