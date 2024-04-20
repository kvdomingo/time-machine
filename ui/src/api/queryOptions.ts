import api from "@/api/index.ts";

import { queryOptions } from "@tanstack/react-query";

export const tagCacheQueryOptions = queryOptions({
  queryFn: api.tagCache.list,
  queryKey: ["tagCache"],
});
