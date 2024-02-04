"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

interface FormData {
  company_name: string;
  company_address: string;
  company_phone: number;
}

interface UpdateDashboardFilterPreferenceData {
  id: string;
  dashboard_filter_preference: string;
}

const cookieStore = cookies();
const supabase = createClient(cookieStore);

export const getProfile = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.from("profiles").select().eq("id", user?.id);
  return data;
};

const settingsSubmit = async ({ formData }: { formData: FormData }) => {
  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check if user is submitting the profile for the first time
  const data = await getProfile();

  if (data?.length === 0) {
    // Upsert data if no existing profile is found
    const { data, error: upsertError } = await supabase
      .from("profiles")
      .upsert([
        {
          id: user?.id,
          ...formData,
        },
      ])
      .select();

    revalidatePath("/settings");

    return upsertError;
  } else {
    // Update existing data
    const { data, error: updateError } = await supabase
      .from("profiles")
      .update({
        ...formData,
      })
      .eq("id", user?.id)
      .select();

    revalidatePath("/settings");

    return updateError;
  }
};

export const updateDashboardFilterPreference = async ({
  updateData,
}: {
  updateData: UpdateDashboardFilterPreferenceData;
}) => {
  // Get authenticated user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user);

  // Update dashboard_filter_preference
  const { data, error } = await supabase
    .from("profiles")
    .update({
      dashboard_filter_preference: updateData.dashboard_filter_preference,
    })
    .eq("id", user?.id)
    .select();

     revalidatePath("/");

  return error;
};

export default settingsSubmit;
