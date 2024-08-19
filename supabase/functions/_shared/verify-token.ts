import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js";

import { corsHeaders } from "../_shared/cors.ts";

const contentTypeHeaders = {
  ...corsHeaders,
  "Content-Type": "application/json",
};

async function verifyToken(
  supabase: SupabaseClient,
  { access_token, refresh_token }: {
    access_token: string;
    refresh_token: string;
  },
) {
  const { data: { session }, error } = await supabase.auth.getSession()
}
