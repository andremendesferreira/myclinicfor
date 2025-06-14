import { SidebarDashboard } from "./_components/sidebar";
export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}){
  return (
    <>
    <div className="flex">
      <SidebarDashboard >
        {children}
      </SidebarDashboard>
    </div>
    </>
  );
}