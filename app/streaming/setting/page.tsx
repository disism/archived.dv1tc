"use client"

import React from "react";
import {handleResult} from "@/app/errors";
import {STREAMING_APIs} from "@/app/nav";
import {useRouter} from "next/navigation";

export default function Page() {
  const router = useRouter()
  const register = (activity: boolean) => {

    const {STREAMING } = STREAMING_APIs
    const token = localStorage.getItem("token")

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${token}`);

    const raw = JSON.stringify({
      "activity": activity
    });

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(STREAMING, requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        if (result.code != undefined) {
          handleResult(result)
          return
        }
        alert("Success")
        router.push("/streaming")
      })
      .catch(error => console.log('error', error));

  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value == "") {
      return
    }
    if (event.target.value == "true") {
      const activity = window.confirm("open streaming?")
      if (activity) {
        register(true)
      }
    } else {
      const activity = window.confirm("close streaming?")
      if (activity) {
        register(false)
      }
    }
  }

  return (
    <main>
      <h1>Streaming Setting</h1>
      <select onChange={handleSelectChange}>
        <option value="">open or close</option>
        <option value="true">open</option>
        <option value="false">close</option>
      </select>
    </main>
  )
}

