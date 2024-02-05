import { checkAuth, checkOnBoard } from "@/utils/supabase/session";
import { redirect } from "next/navigation";

const withAuth = (WrappedComponent: any) => {
  const WithAuthComponent = async (props: any) => {
    const session = await checkAuth();
    const onBoardStatus = await checkOnBoard();

    if (session === null) {
      redirect("/login");
    }

    if (onBoardStatus === true) {
      redirect("/onboarding");
    }

    // Render the wrapped component if authenticated
    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
