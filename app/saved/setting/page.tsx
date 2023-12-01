"use client"

import React from "react";
import {handleResult} from "@/app/errors";
import {SAVED_APIs} from "@/app/nav";
import {useRouter} from "next/navigation";

export default function Page() {
  const router = useRouter()
  const register = (activity: boolean) => {
    const {ACTIVITIES } = SAVED_APIs
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

    fetch(ACTIVITIES, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.code != undefined) {
          handleResult(result)
          return
        }
        alert("Success")
        router.push("/saved")
      })
      .catch(error => console.log('error', error));

  }

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if (event.target.value == "") {
      return
    }
    if (event.target.value == "true") {
   
      const activity = window.confirm("")
      if (activity) {
        register(true)
      }
    } else {
      const activity = window.confirm("close Saved serices?")
      if (activity) {
        register(false)
      }
    }
  }

  return (
    <main>
      <h1>Saved Setting</h1>
      <select onChange={handleSelectChange}>
        <option value="">Select an option</option>
        <option value="true">Open</option>
        <option value="false">Close</option>
      </select>
    </main>
  )
}

