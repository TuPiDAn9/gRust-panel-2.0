import { getServerSession } from 'next-auth';
import { authOptions } from "@/auth";
import { redirect } from "next/navigation";
import { StatsChart } from "@/components/charts/stats-chart-bars";
import { BestDaysCard } from "@/components/charts/best-days";
import { Summary } from "@/components/summary";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Panel",
};

export default async function Home() {
  const session = await getServerSession(authOptions());
  
  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        <main className="container mx-auto py-4 max-w-7xl">
          <div className="space-y-4 md:space-y-6 px-4">
            <div className="flex flex-col xl:flex-row gap-4 md:gap-6">
              <div className="flex-1 min-w-0">
                <StatsChart />
              </div>
              <div className="w-full xl:w-96 xl:flex-shrink-0">
                <BestDaysCard />
              </div>
            </div>
            <Summary />
          </div>
        </main>
      </div>
    </>
  );
}
