import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  icon: LucideIcon;
  title: string;
  badge: string;
  badgeClassName?: string;
  action?: ReactNode;
  children: ReactNode;
  footer: ReactNode;
}

export function ToolCard({
  icon: Icon,
  title,
  badge,
  badgeClassName,
  action,
  children,
  footer,
}: ToolCardProps) {
  return (
    <Card className="h-full rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group gap-0 ring-0 py-0">
      <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-surface-low flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            <Icon className="size-4.5" />
          </div>
          <CardTitle className="font-heading text-sm sm:text-base font-semibold text-on-surface group-hover:text-primary transition-colors duration-300">
            {title}
          </CardTitle>
        </div>
        <CardAction className="flex items-center gap-1">
          {action}
          <Badge
            className={cn(
              "rounded-full font-bold transition-all duration-300",
              badgeClassName ?? "bg-primary-fixed text-on-primary-fixed",
            )}
          >
            {badge}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6 flex-1 flex flex-col">
        {children}
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 bg-surface-low/60 p-2 rounded-xl group-hover:bg-surface-low transition-colors duration-300">
          {footer}
        </div>
      </CardContent>
    </Card>
  );
}
