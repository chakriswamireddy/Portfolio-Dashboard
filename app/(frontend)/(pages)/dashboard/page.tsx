import React from "react";
import HoldingsTable from "../../components/HoldingsTable";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import HoldingForm from "../../components/HoldingForm";
import StoreStarter from "../../components/shared/StoreStarter";

async function page() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;

  if (!userId) {
    redirect("/login");
  }
  return (
    <div>
        <StoreStarter />
      <div className="flex justify-between my-4 mx-8 items-end" >
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <HoldingForm submitLabel="Add Holding" />
      </div>
 
      <HoldingsTable />
 
    </div>
  );
}

export default page;
