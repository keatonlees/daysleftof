import { supabase } from "@/util/supabase";

export async function getCountersByUID(uid: string) {
  try {
    const { data } = await supabase
      .from("Counters")
      .select("*")
      .eq("user_id", uid)
      .order("modified_at", { ascending: false })
      .throwOnError();

    if (!data) return { data: null, error: "No data returned" };

    return { data: data, error: null };
  } catch (e) {
    console.error("Error fetching counters:", e);
    return { data: null, error: e };
  }
}

export async function addNewCounter(uid: string) {
  try {
    const uidSlice = uid.slice(0, 3); // first 3 chars
    const dateSlice = Date.now().toString().slice(-6); // last 6 chars
    const sid = uidSlice + dateSlice;

    const { data } = await supabase
      .from("Counters")
      .insert({
        sid: sid,
        user_id: uid,
        title: "New Counter",
        description: "This is a new counter",
        end_date: new Date(),
      })
      .select()
      .single()
      .throwOnError();

    return { data: data, error: null };
  } catch (e) {
    console.error("Error fetching counters:", e);
    return { data: null, error: e };
  }
}

export async function deleteCounter(id: string) {
  try {
    const { data } = await supabase
      .from("Counters")
      .delete()
      .eq("id", id)
      .throwOnError();

    return { data: data, error: null };
  } catch (e) {
    console.log("Error deleting counter: ", e);
    return { data: null, error: e };
  }
}
