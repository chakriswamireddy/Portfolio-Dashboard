


import React from 'react'
import HoldingsTable from '../../components/HoldingsTable'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function page() {

    const cookieStore  = await cookies()
    const userId = cookieStore.get("userId")?.value

    if (!userId) {
        redirect("/login")
    }
  return (
    <div>
        <h1 className='text-3xl font-bold'>Dashboard</h1>
        <HoldingsTable />
    </div>
  )
}

export default page