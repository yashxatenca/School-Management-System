"use client";

import { useIsFetching, useIsMutating } from "@tanstack/react-query";
import FullScreenLoader from "./FullScreenLoader";

export default function GlobalLoader() {
  const fetching = useIsFetching();
  const mutating = useIsMutating();

  if (fetching > 0 || mutating > 0) {
    return <FullScreenLoader />;
  }

  return null;
}
