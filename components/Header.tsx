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

  return (
    <>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <TeamSwitcher user={user} />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <UserNav user={user} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
