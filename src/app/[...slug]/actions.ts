import { supabase } from "@/util/supabase";

export async function getCounterBySID(id: string) {
  try {
    const { data } = await supabase
      .from("Counters")
      .select()
      .eq("sid", id)
      .single()
      .throwOnError();

    return { data: data, error: null };
  } catch (e) {
    console.error("Error fetching counters:", e);
    return { data: null, error: e };
  }
}

export async function updateCounter(id: string, dataToUpdate = {}) {
  try {
    await supabase
      .from("Counters")
      .update(dataToUpdate)
      .eq("sid", id)
      .throwOnError();

    return { error: null };
  } catch (e) {
    console.error("Error updating counter:", e);
    return { error: e };
  }
}
