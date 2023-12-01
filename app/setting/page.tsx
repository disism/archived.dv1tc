"use client"

import React from "react";
import {useRouter} from "next/navigation";
import {ACCOUNTS_APIs} from "@/app/nav";
import {handleResult} from "@/app/errors";

export default function Setting() {
  const router = useRouter()
  const { USER } = ACCOUNTS_APIs
  const deleteAccount = () => {
    const password = prompt("Delete Account")
    if (password == "") {
      alert("input password!")
      return
    }
    if (password == null) {
      alert("Cancel")
      return
    }

    const token = localStorage.getItem("token")

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    const raw = JSON.stringify({
      "password": password
    });
    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch(USER, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.code != undefined) {
          handleResult(result)
          return
        }
        if (result.message == "OK") {
          alert("Delete Account")
          localStorage.removeItem("token")
          location.reload()
        }
      })
      .catch(error => console.log('error', error));

  }

  return (
    <main>
      <h1>SETTING</h1>
      <h2>Edit Account</h2>
      <button onClick={() => router.push("/setting/profile")}>Edit Account</button>
      <h2>Devices</h2>
      <button onClick={() => router.push("/setting/device")}>Devices</button>
      <h2>Delete Account</h2>
      <button onClick={() => deleteAccount()}>Delete</button>
      <h2>Saved</h2>
      <button onClick={() => router.push("/saved/setting")}>Services</button>
      <h2>Streaming</h2>
      <button onClick={() => router.push("/streaming/setting")}>Services</button>
    </main>
  )
}
