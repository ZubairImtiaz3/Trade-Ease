import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

import { Search } from "@/components/dashboard/search";
import TeamSwitcher from "@/components/dashboard/team-switcher";
import { UserNav } from "@/components/dashboard/user-nav";
import { MainNav } from "@/components/dashboard/main-nav";

const Header = async () => {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase.from("profiles").select().eq("id", user?.id);
  const userprofile = data && data[0] ? data[0] : null;

  const userEmail = user?.email;
  const userName = userprofile
    ? `${userprofile.first_name} ${userprofile.last_name}`
    : null;

  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <TeamSwitcher userName={userName} />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav userName={userName} userEmail={userEmail} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
