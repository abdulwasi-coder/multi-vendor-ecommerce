"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

async function getUserData() {
  const res = await api.get("/user/userProfile", {
    withCredentials: true,
  });
  console.log(res.data);
  return res.data;
}

export function useUser() {
  const query = useQuery({
    queryKey: ["user-data"],
    queryFn: () => getUserData,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return query;
}
