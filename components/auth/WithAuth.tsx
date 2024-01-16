import { checkAuth } from "@/utils/supabase/session";

const withAuth = (WrappedComponent: any) => {
  const WithAuthComponent = async (props: any) => {
    await checkAuth();

    // Render the wrapped component if authenticated
    return <WrappedComponent {...props} />;
  };

  return WithAuthComponent;
};

export default withAuth;
