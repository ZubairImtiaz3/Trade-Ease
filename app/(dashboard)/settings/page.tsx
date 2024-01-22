import { getProfile } from "@/actions/settingsSubmit";
import ProfileForm from "@/components/settings/ProfileForm";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Settings = async () => {
  const profileData = await getProfile();
  const formData =
    Array.isArray(profileData) && profileData.length > 0
      ? profileData[0]
      : null;

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
        <ProfileForm data={formData} />
      </Card>
    </div>
  );
};

export default Settings;
