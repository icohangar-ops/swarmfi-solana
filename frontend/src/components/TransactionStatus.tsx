"use client";

/**
 * TransactionStatus — Shows real-time Solana transaction progress
 *
 * States: preparing → signing → confirming → confirmed | failed
 * Includes link to Solana Explorer for verified transactions.
 */

import React, { useState, useEffect } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import {
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
  Shield,
} from "lucide-react";

export type TxState = "preparing" | "signing" | "confirming" | "confirmed" | "failed";

interface TransactionStatusProps {
  state: TxState;
  signature?: string;
  error?: string;
  cluster?: "devnet" | "mainnet-beta";
  onClose?: () => void;
}

const stateConfig: Record<TxState, { label: string; color: string; icon: React.ElementType }> = {
  preparing: { label: "Preparing transaction...", color: "text-slate-400", icon: Loader2 },
  signing: { label: "Awaiting wallet signature...", color: "text-amber-400", icon: Shield },
  confirming: { label: "Confirming on Solana...", color: "text-cyan-400", icon: Loader2 },
  confirmed: { label: "Transaction confirmed!", color: "text-green-400", icon: CheckCircle },
  failed: { label: "Transaction failed", color: "text-red-400", icon: XCircle },
};

export default function TransactionStatus({
  state,
  signature,
  error,
  cluster = "devnet",
  onClose,
}: TransactionStatusProps) {
  const config = stateConfig[state];
  const Icon = config.icon;
  const explorerUrl = signature
    ? `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`
    : null;

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className={`${config.color}`}>
          <Icon
            className={`w-5 h-5 ${
              state === "preparing" || state === "confirming" || state === "signing"
                ? "animate-spin"
                : ""
            }`}
          />
        </div>
        <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
      </div>

      {/* Signature */}
      {signature && (
        <div className="bg-slate-800/50 rounded-lg p-2.5">
          <div className="text-xs text-slate-400 mb-1">Transaction Signature</div>
          <div className="text-xs text-slate-300 font-mono break-all">{signature}</div>
        </div>
      )}

      {/* Error */}
      {error && state === "failed" && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-2.5">
          <div className="text-xs text-red-400">{error}</div>
        </div>
      )}

      {/* Explorer link */}
      {explorerUrl && state === "confirmed" && (
        <a
          href={explorerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          <ExternalLink className="w-3 h-3" />
          View on Solana Explorer
        </a>
      )}

      {/* Dismiss */}
      {(state === "confirmed" || state === "failed") && onClose && (
        <button
          onClick={onClose}
          className="text-xs text-slate-400 hover:text-white transition-colors"
        >
          Dismiss
        </button>
      )}

      {/* Progress bar for in-flight transactions */}
      {(state === "preparing" || state === "signing" || state === "confirming") && (
        <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-purple-500 animate-pulse"
            style={{ width: state === "confirming" ? "75%" : state === "signing" ? "50%" : "25%" }}
          />
        </div>
      )}
    </div>
  );
}
