"use client";

import { createClient } from "@/utils/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";
import { observable } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import { Database } from "@/database.types";
import { generateId, getTodoObservable } from "./observables/todoObservable";


const supabase = createClient<Database>();

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required.",
  }),
});

const uid$ = observable<string | null>(null);

function Home() {
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      uid$.set(data.user?.id || null);
    });
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const todos$ = getTodoObservable(uid$);

  if (uid$.get() && todos$.get()) {
    return (
      <div className="flex flex-col space-y-4 w-full">
        <div>
          {todos$ &&
            Object.values(todos$.get())
              .filter((todo) => !todo.deleted)
              .map((todo) => (
                <div key={todo.id}>{todo.title}</div>
              ))}
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => {
              console.log("user_id", uid$.get());
              const id = generateId();
  
              todos$[id].assign({
                id,
                user_id: uid$.get()!,
                title: data.title
              });
  
              form.reset();
            })}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Add a todo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add Todo</Button>
          </form>
        </Form>
      </div>
    );
  } else {
    return null;
  }
}

export default observer(Home);
