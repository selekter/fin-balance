import { LucideIcon } from "lucide-react";

interface StateCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  bgicon: string;
  iconsubtitle?: string;
  subtitle: string;
  colorfooter: string;
}

export const StatCard: React.FC<StateCardProps> = ({
  title,
  amount,
  icon: Icon,
  bgicon,
  iconsubtitle,
  subtitle,
  colorfooter,
}) => {
  const defaultTextColor = amount >= 0 ? "text-slate-800" : "text-rose-500";
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div
          className={`flex h-8 w-8 items-center justify-center rounded-lg ${bgicon}`}
        >
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div
        className={`mb-1 text-2xl font-bold tracking-tight ${defaultTextColor}`}
      >
        ฿ ${amount}
      </div>
      <div className="flex items-center gap-1 text-[11px] text-slate-400">
        <Icon className={``} />
        <span>{subtitle}</span>
      </div>
      <div
        className={`absolute right-0 bottom-0 left-0 h-1 bg-linear-to-r ${colorfooter}`}
      ></div>
    </div>
  );
};
