"use client"

import './globals.css'
import React from "react";
import {Nav} from "@/app/nav";
import {router} from "next/client";


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {


  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <nav className="p-10">
              <div>
                <button onClick={() => router.back()}>Back</button>
                <ul>
                  {Nav && Nav.map((i, idx) => {
                    return (
                      <li key={idx}>
                        <a href={i.router}>{i.name}</a>
                      </li>
                    )
                  })}
                </ul>
              </div>

        </nav>
        <main className="px-10">{children}</main>
      </body>
    </html>
  )
}
