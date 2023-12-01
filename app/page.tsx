"use client"

import React, {useEffect, useState} from "react";
import {ACCOUNTS_APIs} from "@/app/nav";
import {handleResult} from "@/app/errors";
import {AvatarData, User} from "@/app/types";
import Image from 'next/image'
import {GetPreviewLink, IPFS_GATEWAY} from "@/app/ipfs";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {Oidc} from "@/app/authz/oidc";

export default function Home() {
  const [oidc, setOidc] = useState("")
  useEffect(() => {
    Oidc().then(r => {
      setOidc(r)
    })
  }, []);


  return (
    <main>
      <button>
        <Link href={oidc}>OIDC</Link>
      </button>
    </main>
  )
}

