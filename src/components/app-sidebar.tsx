"use client";

import { CreditCardIcon, FolderOpenIcon, KeyIcon, LogOutIcon, StarIcon, TerminalIcon } from "lucide-react";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-sunscription";

const menuItems = [
    {
        title: "Main",
        items: [
            {
                title: "Workflows",
                icon: FolderOpenIcon,
                url: "/workflows",
            },
            {
                title: "Credentials",
                icon: KeyIcon,
                url: "/credentials",
            },
            {
                title: "Executions",
                icon: TerminalIcon,
                url: "/executions",
            },
        ],
    }
]

export const AppSidebar = () => {

    const router = useRouter();
    const pathname = usePathname();
    const { hasActiveSubscription, isLoading } = useHasActiveSubscription();

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Automa" isActive={false} asChild>
                        <Link href="/" prefetch>
                            <Image
                                src="/logos/logo.svg"
                                alt="Automa Logo"
                                width={30}
                                height={30}
                                className="mr-2"
                            />
                            <span className="font-semibold text-sm">Automa</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <SidebarContent>
                {menuItems.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem
                                        key={item.title}
                                    >
                                        <SidebarMenuButton tooltip={item.title} isActive={item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)} asChild>
                                            <Link href={item.url} prefetch>
                                                <item.icon className="mr-2 h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>
            <SidebarFooter>
                {!isLoading && !hasActiveSubscription && (
                    <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Upgrade to Pro" isActive={false} onClick={
                            () => authClient.checkout(
                                { slug: "Automa-Pro" }
                            )
                        }>

                            <StarIcon className="mr-2 h-4 w-4" />
                            <span>Upgrade to Pro</span>

                        </SidebarMenuButton>
                    </SidebarMenuItem>
                )}
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Billing Portal" isActive={false} onClick={
                        () => authClient.customer.portal()
                    }>
                        <CreditCardIcon className="mr-2 h-4 w-4" />
                        <span>Billing Portal</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Sign Out" isActive={false} onClick={() => authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                router.push("/login");
                            }
                        }

                    })}>
                        <LogOutIcon className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarFooter>
        </Sidebar>
    );
}