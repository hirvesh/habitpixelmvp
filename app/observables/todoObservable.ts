import { ObservablePersistLocalStorage } from "@legendapp/state/persist-plugins/local-storage";
import { configureSyncedSupabase, syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { observable, ObservablePrimitive } from "@legendapp/state";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/database.types";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient<Database>();

export const generateId = () => uuidv4();

configureSyncedSupabase({
  generateId,
});

export const getTodoObservable = (uid$: ObservablePrimitive<string | null>) => {
  const todos$ = observable(
    syncedSupabase({
      supabase,
      collection: "todos",
      // Optional:
      // Select only id and text fields
      select: (from) =>
        from.select("id, user_id, title, created_at, updated_at, deleted"),
      // Filter by the current user
      filter: (select) => select.eq("user_id", uid$.get()!),
      // Don't allow delete
      actions: ["read", "create", "update"],
      // Realtime filter by user_id
      realtime: { filter: `user_id=eq.${uid$.get()}` },
      // Persist data and pending changes locally
      persist: {
        name: "todos",
        plugin: ObservablePersistLocalStorage,
        retrySync: true,      
      },
      debounceSet: 500,
      retry: {
        backoff: "exponential",
        infinite: true,
      },
      // Sync only diffs
      changesSince: "last-sync",
      fieldCreatedAt: "created_at",
      fieldUpdatedAt: "updated_at",
      fieldDeleted: "deleted",
      waitFor: uid$,
    })
  );

  return todos$;
};
