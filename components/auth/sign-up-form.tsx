"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";
import {
  NON_ADMIN_ROLES,
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
  type NonAdminRole,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

export function SignUpForm() {
  const router = useRouter();
  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", email: "", password: "", roles: ["BUYER"] },
  });

  async function onSubmit(values: RegisterInput) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      toast.error(data?.error ?? "Could not create account.");
      return;
    }

    toast.success("Account created!");
    router.push(data.data.needsRoleSelection ? "/select-role" : "/dashboard");
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input autoComplete="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roles"
          render={({ field }) => {
            const selected = field.value ?? [];
            const toggle = (role: NonAdminRole) => {
              field.onChange(
                selected.includes(role)
                  ? selected.filter((r) => r !== role)
                  : [...selected, role],
              );
            };
            return (
              <FormItem>
                <FormLabel>Roles</FormLabel>
                <FormDescription>
                  Pick one or more. You can switch the active role anytime.
                </FormDescription>
                <div className="grid gap-2 sm:grid-cols-3">
                  {NON_ADMIN_ROLES.map((role) => {
                    const active = selected.includes(role);
                    return (
                      <button
                        type="button"
                        key={role}
                        onClick={() => toggle(role)}
                        aria-pressed={active}
                        className={cn(
                          "flex flex-col gap-1 rounded-lg border p-3 text-left transition-colors",
                          active
                            ? "border-primary bg-primary/5"
                            : "hover:bg-accent",
                        )}
                      >
                        <span className="flex items-center justify-between text-sm font-medium">
                          {ROLE_LABELS[role]}
                          {active && <Check className="text-primary size-4" />}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {ROLE_DESCRIPTIONS[role]}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Creating account…" : "Create account"}
        </Button>
      </form>
    </Form>
  );
}
