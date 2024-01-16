import { checkAuth } from "@/utils/supabase/session";
import { redirect } from "next/navigation";

const withAuth = (WrappedComponent: any) => {
  const WithAuthComponent = async (props: any) => {
    const session = await checkAuth();
    if (session === null) {
      redirect("/login");
    }

    // Render the wrapped component if authenticated
    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
