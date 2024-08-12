import Image from "next/image";
import Login from "./Login/page";
import Dashboard from "./Dashboard/page";
import getSliders from "@/dataFetch/getSliders";

export default async function Home() {

  const sliders = await getSliders()


  return (
    <main>
      {/* <Login /> */}
      <Dashboard sliders={sliders} />
    </main>
  );
}
