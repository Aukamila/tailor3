
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar"
import { CircleUser, Home, Scissors, Users } from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="items-center justify-center p-4 group-data-[collapsible=icon]:p-2">
           <Scissors className="h-8 w-8 text-primary-foreground" />
           <span className="text-xl font-bold text-primary-foreground group-data-[collapsible=icon]:hidden">StitchLink</span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip="Customers">
                <Link href="/dashboard">
                  <Users />
                  <span>Customers</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="Shop Owner" data-ai-hint="person" />
                    <AvatarFallback>SO</AvatarFallback>
                </Avatar>
                <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                    <span className="font-semibold text-sidebar-foreground">Shop Owner</span>
                    <span className="text-xs text-sidebar-foreground/70">owner@stitch.link</span>
                </div>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}
