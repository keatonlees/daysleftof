import { supabase } from "@/util/supabase";

export async function getRecentCounters() {
  try {
    const { data } = await supabase
      .from("Counters")
      .select("*")
      .eq("is_public", true)
      .order("created_at", { ascending: false })
      .limit(12)
      .throwOnError();

    if (!data) return { data: null, error: "No data returned" };

    return { data: data, error: null };
  } catch (e) {
    console.error("Error fetching counters:", e);
    return { data: null, error: e };
  }
}
