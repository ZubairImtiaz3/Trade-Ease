import { cookies } from "next/headers";

export default async function Index() {
  const cookieStore = cookies();

  return (
    <>
      <div>Hello World</div>
    </>
  );
}
