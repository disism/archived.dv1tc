import type { Metadata } from 'next'
import React from "react";

export const metadata: Metadata = {
  title: 'Saved',
  description: 'about disism pre-v0.0.1',
}


export default function Layout({children,}: {
  children: React.ReactNode
}) {
  return <section>{children}</section>
}