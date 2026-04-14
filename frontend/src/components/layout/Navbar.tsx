"use client";

/**
 * Navbar — Top navigation bar for SwarmFi
 *
 * Includes:
 * - SwarmFi logo + brand name
 * - Desktop navigation links
 * - WalletConnectButton (polished Phantom wallet integration)
 * - Arcium shield badge showing "Arcium Encrypted" status when connected
 * - Mobile hamburger menu with responsive layout
 */

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSolanaWallet } from "@/lib/wallet";
import WalletConnectButton from "@/components/WalletConnectButton";
import {
  Menu,
  X,
  Zap,
  LayoutDashboard,
  BarChart3,
  Landmark,
  Bot,
  Settings,
  Shield,
} from "lucide-react";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/prediction-markets", label: "Markets", icon: BarChart3 },
  { href: "/vaults", label: "Vaults", icon: Landmark },
  { href: "/agents", label: "Agents", icon: Bot },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Navbar() {
  const pathname = usePathname();
  const { isConnected } = useSolanaWallet();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card border-0 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              SwarmFi
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Wallet + Arcium Badge */}
          <div className="flex items-center gap-2">
            {/* Arcium Encrypted shield badge — shows when wallet is connected */}
            {isConnected && (
              <div
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 cursor-default"
                title="Oracle data encrypted via Arcium Confidential Computing"
              >
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs font-medium text-emerald-400">Arcium Encrypted</span>
              </div>
            )}

            {/* Wallet Connect Button */}
            <WalletConnectButton />

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden modal-overlay border-t border-border">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? "bg-cyan-500/10 text-cyan-400"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              );
            })}

            {/* Arcium badge in mobile nav */}
            {isConnected && (
              <div className="flex items-center gap-1.5 px-3 py-2">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-xs text-emerald-400">Arcium Encrypted</span>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
