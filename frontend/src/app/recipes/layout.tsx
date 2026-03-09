"use client";

import { RequireAuth } from "@/components/auth/RequireAuth";

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
    return <RequireAuth featureName="recipes">{children}</RequireAuth>;
}
