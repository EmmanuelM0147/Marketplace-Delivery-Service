"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { MessageSquare, Search, ShoppingCart, Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">Gardenia</span>
          </Link>
          
          <div className="hidden md:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
                      <li className="row-span-3">
                        <Link href="/products?category=grains" className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                          Grains & Cereals
                        </Link>
                      </li>
                      <li>
                        <Link href="/products?category=fruits" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Fruits & Vegetables
                        </Link>
                      </li>
                      <li>
                        <Link href="/products?category=livestock" className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                          Livestock & Poultry
                        </Link>
                      </li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/products" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      Products
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link href="/chat" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50">
                      AI Assistant
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-8"
            />
          </div>
          <Link href="/chat">
            <Button variant="outline" size="icon">
              <MessageSquare className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="outline" size="icon">
            <ShoppingCart className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <Link href="/auth/sign-in">
            <Button>Sign In</Button>
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-8"
              />
            </div>
            <nav className="space-y-2">
              <Link href="/products" className="block py-2">
                Products
              </Link>
              <Link href="/chat" className="block py-2">
                AI Assistant
              </Link>
              <Link href="/products?category=grains" className="block py-2">
                Grains & Cereals
              </Link>
              <Link href="/products?category=fruits" className="block py-2">
                Fruits & Vegetables
              </Link>
              <Link href="/products?category=livestock" className="block py-2">
                Livestock & Poultry
              </Link>
            </nav>
            <div className="pt-4 border-t space-y-2">
              <Link href="/auth/sign-in">
                <Button className="w-full">Sign In</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button variant="outline" className="w-full">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}