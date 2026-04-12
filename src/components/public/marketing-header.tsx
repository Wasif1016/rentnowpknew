import Link from "next/link"
import { logoutAction } from "@/lib/actions/auth"
import { defaultPathForRole, type AppRole } from "@/lib/auth/safe-next"
import { getOptionalUser } from "@/lib/auth/session"
import { Button } from "@/components/ui/button"
import { NAV_CONFIG } from "@/config/nav-config"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/ui/logo" // Assuming there's a Logo component, or use text

function dashboardLabel(role: AppRole): string {
  switch (role) {
    case "ADMIN":
      return "Admin"
    case "VENDOR":
      return "Vendor dashboard"
    case "CUSTOMER":
      return "My account"
    default:
      return "Dashboard"
  }
}

export async function MarketingHeader() {
  const user = await getOptionalUser()

  return (
    <header className="sticky top-0 z-40 hidden w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 md:block">
      <div className="container mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div className="bg-primary flex h-9 w-9 items-center justify-center rounded-xl shadow-lg shadow-primary/20">
            <span className="text-primary-foreground text-xl font-black">R</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight">
            RentNow<span className="text-primary">Pk</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="mx-4">
          <NavigationMenuList className="gap-1">
            {NAV_CONFIG.mainNav.map((item) => (
              <NavigationMenuItem key={item.title}>
                {item.items ? (
                  <>
                    <NavigationMenuTrigger className="bg-transparent font-bold capitalize hover:text-primary focus:text-primary data-[state=open]:text-primary data-[state=open]:bg-transparent transition-colors">
                      {item.title}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      {item.isMega && item.cities ? (
                        <div className="grid w-[800px] grid-cols-4 gap-6 p-8">
                          {item.cities?.map((city) => (
                            <div key={city.name} className="flex flex-col gap-3">
                              <Link
                                href={city.href}
                                className="text-sm font-bold transition-colors hover:text-primary"
                              >
                                {city.name}
                              </Link>
                              {city.areas && (
                                <ul className="flex flex-col gap-2 border-l border-border pl-3">
                                  {city.areas.map((area) => (
                                    <li key={area.name}>
                                      <Link
                                        href={area.href}
                                        className="text-muted-foreground text-[13px] transition-colors hover:text-foreground"
                                      >
                                        {area.name}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : item.isMega && !item.cities ? (
                        <div className="grid w-[1100px] grid-cols-6 gap-6 p-8">
                          {item.items.map((category) => (
                            <Link 
                              key={category.title} 
                              href={category.href} 
                              className="group flex flex-col gap-4 p-3 rounded-2xl transition-all hover:bg-muted/30"
                            >
                              <div className="flex aspect-[16/10] w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-2 transition-all group-hover:bg-slate-800 ring-1 ring-white/10 shadow-lg">
                                <img 
                                  src={category.icon} 
                                  alt={category.title} 
                                  className="h-14 w-auto object-contain transition-all group-hover:scale-110" 
                                />
                              </div>
                              <div className="flex flex-col gap-1.5">
                                <span className="text-sm font-bold group-hover:text-primary transition-colors">
                                  {category.title}
                                </span>
                                <span className="text-[11px] leading-relaxed text-muted-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
                                  {category.description}
                                </span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.items.map((subItem) => (
                            <ListItem
                              key={subItem.title}
                              title={subItem.title}
                              href={subItem.href}
                              icon={subItem.icon}
                            >
                              {subItem.description}
                            </ListItem>
                          ))}
                        </ul>
                      )}
                    </NavigationMenuContent>
                  </>
                ) : (
                  <NavigationMenuLink asChild className={cn(navigationMenuTriggerStyle(), "bg-transparent font-bold hover:text-primary focus:text-primary data-[state=open]:text-primary transition-colors")}>
                    <Link href={item.href}>
                      {item.title}
                    </Link>
                  </NavigationMenuLink>
                )}
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">

          {user ? (
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="rounded-full px-5 font-bold hover:text-primary transition-colors" asChild>
                <Link href={defaultPathForRole(user.role as AppRole)}>
                  {dashboardLabel(user.role as AppRole)}
                </Link>
              </Button>
              <form action={logoutAction}>
                <Button type="submit" variant="ghost" size="sm" className="text-muted-foreground font-medium">
                  Sign out
                </Button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="default" className="bg-primary/10 text-primary hover:bg-primary/20 rounded-full border-none px-6 font-bold" asChild>
                <Link href="/auth/signup">Log in as Vendor</Link>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-full px-6 font-bold shadow-lg shadow-primary/20" asChild>
                <Link href="/auth/signup-customer">List Your Car</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

const ListItem = (({ className, title, children, icon: iconData, ...props }: any) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={props.href}
          className={cn(
            "group block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-muted/50 hover:text-accent-foreground focus:bg-muted focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="flex flex-col gap-1">
            <div className="text-sm font-bold leading-none transition-colors group-hover:text-primary">{title}</div>
            {children && (
              <p className="line-clamp-2 text-muted-foreground text-[13px] leading-snug font-normal group-hover:text-foreground/80">
                {children}
              </p>
            )}
          </div>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
