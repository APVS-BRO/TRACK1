"use server";

import { signOut } from "@/auth";

export const logout = async (redir?: string) => {
    if (redir) {
        signOut({
            redirectTo: redir,
        }).then(() => {
            window.location.href = redir;
        })
    }
    await signOut({
        redirectTo: redir,
    });
}