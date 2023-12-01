
"use client"

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {handleResult} from "@/app/errors";
import {STREAMING_APIs} from "@/app/nav";
import {HttpClient} from "@/app/api";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export default function Page() {

  const router = useRouter()
  const { STREAMING } = STREAMING_APIs

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token === null) {
      router.push("/")
      return
    }

    const client = new HttpClient()
    client.setHeaderToken(token)
    client.get("/_streaming/v1/activities").then(res => {
      if (!res.activity) {
        const c = window.confirm("open streaming?")
        if (c) {
          router.push("/streaming/setting")
          return;
        } else {
          router.push("/")
          return;
        }
      }
    }).catch(error => console.log(error))
  }, [STREAMING, router]);


  return (
    <main>
      <h1>Streaming</h1>

      <button onClick={() => router.push("/streaming/music")}>Music</button>

    </main>
  )
}
