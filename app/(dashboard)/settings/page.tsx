import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import ProfileForm from "@/components/settings/ProfileForm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Settings = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.from("profiles").select().eq("id", user?.id);

  const profileData = data && data[0] ? data[0] : null;

  return (
    <div className="pt-6 p-8">
      <h2 className="text-3xl font-bold tracking-tight">Profile</h2>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Company's Information</CardTitle>
          <CardDescription>
            Update and save your company profile for accurate information across
            the board.
          </CardDescription>
        </CardHeader>
        <ProfileForm data={profileData} />
      </Card>
    </div>
  );
};

export default Settings;
