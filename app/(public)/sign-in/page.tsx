import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign in — SEAPEDIA",
};

export default function SignInPage() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col justify-center px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your SEAPEDIA account.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Suspense>
            <SignInForm />
          </Suspense>
          <p className="text-muted-foreground text-center text-sm">
            New here?{" "}
            <Link href="/sign-up" className="text-primary font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
