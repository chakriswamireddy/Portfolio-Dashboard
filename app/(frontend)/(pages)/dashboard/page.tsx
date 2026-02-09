import React from "react";
import HoldingsTable from "../../components/HoldingsTable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HoldingForm from "../../components/HoldingForm";
import StoreStarter from "../../components/shared/StoreStarter";
import Profile from "../../components/shared/Profile";

async function page() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const userName = cookieStore.get("userName")?.value;

  if (!userId) {
    redirect("/login");
  }
  return (
    <div className="px-4">
      <StoreStarter />

      <div className="flex   my-4 mx-8 items-center">
        <Profile name={userName || "User"} />

        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="ml-auto">
          <HoldingForm submitLabel="Add Holding" />
        </div>
      </div>

      <HoldingsTable />
    </div>
  );
}

export default page;
