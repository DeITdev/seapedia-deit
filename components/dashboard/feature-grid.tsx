import type { LucideIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  body: string;
  level: number;
}

export function FeatureGrid({ items }: { items: FeatureItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, title, body, level }) => (
        <Card key={title}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <span className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
                <Icon className="size-5" />
              </span>
              <Badge variant="secondary">Level {level}</Badge>
            </div>
            <CardTitle className="mt-2 text-base">{title}</CardTitle>
            <CardDescription>{body}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-xs">Coming soon</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
