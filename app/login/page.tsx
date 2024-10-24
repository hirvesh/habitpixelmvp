"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const supabase = createClient();

export default function Login() {

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  return (
    <div className="flex flex-row space-x-4">
      {JSON.stringify(user)}
      <Button
        onClick={async () => {
          setLoading(true);
          const { error } = await supabase.auth.signUp({
            email: "hirvesh.munogee@gmail.com",
            password: "Password007!",
          });

          if (error) {
            console.error(error);
          }

          setLoading(false);
        }}
      >
        Sign Up
        {loading && <Loader2 className="animate-spin" />}
      </Button>
      <Button
        onClick={async () => {
          setLoading(true);

          const { error } = await supabase.auth.signInWithPassword({
            email: "hirvesh.munogee@gmail.com",
            password: "Password007!",
          });

          if (error) {
            console.error(error);
          }

          setLoading(false);
        }}
      >
        Login
      </Button>
      <Button onClick={async () => {
        await supabase.auth.signOut();
      }}>
        Sign Out
      </Button>
    </div>
  );
}
