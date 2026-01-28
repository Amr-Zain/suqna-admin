import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "@tanstack/react-router";

interface StatsCardProps {
  title: string;
  value: string | React.ReactNode;
  change?: string;
  changeType?: "increase" | "decrease";
  icon: LucideIcon;
  className?: string;
  to?: string;
}

export function StatsCard({
  title,
  value,
  change,
  changeType = "increase",
  icon: Icon,
  className,
  to,
}: StatsCardProps) {
  const { t } = useTranslation();

  const CardWrapper = to ? Link : "div";

  return (
    <CardWrapper to={to as any} className={to ? "block outline-none" : ""}>
      <Card className={`hover:shadow-md transition-shadow ${to ? "cursor-pointer" : ""} ${className}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          {change && (
            <div className="flex items-center text-xs text-muted-foreground">
              {changeType === "increase" ? (
                <ArrowUpRight className="me-1 h-3 w-3 text-success" />
              ) : (
                <ArrowDownRight className="me-1 h-3 w-3 text-destructive" />
              )}
              <span className={changeType === "increase" ? "text-success" : "text-destructive"}>
                {change}
              </span>
              <span className="ms-1">{t("fromLastMonth")}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </CardWrapper>
  );
}