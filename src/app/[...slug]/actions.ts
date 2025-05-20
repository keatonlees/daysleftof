import { supabase } from "@/util/supabase";

export async function getCounterBySID(id: string) {
  try {
    const { data } = await supabase
      .from("Counters")
      .select()
      .eq("sid", id)
      .single();

    return { data: data, error: null };
  } catch (e) {
    console.error("Error fetching counters:", e);
    return { data: null, error: e };
  }
}

export async function updateCounter(id: string, dataToUpdate = {}) {
  console.log(id, dataToUpdate);
  try {
    await supabase
      .from("Counters")
      .update(dataToUpdate)
      .eq("id", id)
      .throwOnError();

    return { error: null };
  } catch (e) {
    console.error("Error updating counter:", e);
    return { error: e };
  }
}
