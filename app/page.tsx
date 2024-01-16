import AuthButton from "@/components/auth/AuthButton";
import withAuth from "@/components/auth/WithAuth";

function Index() {
  return (
    <>
      <AuthButton />
    </>
  );
}

export default withAuth(Index);
