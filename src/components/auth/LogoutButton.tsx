"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import LogoutIcon from "@mui/icons-material/Logout";
import { api } from "@/src/lib/api";

type Props = {
  redirectTo?: string;
  className?: string;
};

export default function LogoutButton({
  redirectTo = "/login",
  className = "w-full flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-text hover:bg-accent-800 disabled:opacity-60 cursor-pointer",
}: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const logout = useMutation({
    mutationFn: () => api("/api/auth/logout", { method: "POST" }),
    onSettled: () => {
      queryClient.clear();
      router.push(redirectTo);
      router.refresh();
    },
  });

  return (
    <button
      type="button"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      className={className}
    >
      <LogoutIcon sx={{ fontSize: 18 }} />
      Log out
    </button>
  );
}
