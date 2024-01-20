import Header from "@/components/Header";
import withAuth from "@/components/auth/WithAuth";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col">
      <Header />
      {children}
    </div>
  );
}
export default withAuth(RootLayout);
