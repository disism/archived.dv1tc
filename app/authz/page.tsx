"use client"

import React from "react";
import {useRouter, useSearchParams} from "next/navigation";
import * as jose from "jose";

export default function AuthZ() {

  const router = useRouter()
  const search = useSearchParams()
  const code = search.get("code")
  console.log(code)

  if (code) {
    const myHeaders = new Headers();

    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
    myHeaders.append("Authorization", "Basic ZGlzaXNtX2NsaWVudDpkaXNpc21fY2xpZW50X3NlY3JldA==");

    const urlencoded = new URLSearchParams();
    urlencoded.append("code", code);
    urlencoded.append("redirect_uri", "http://localhost:3000/authz");
    urlencoded.append("grant_type", "authorization_code");
    const veri = localStorage.getItem("codeVerifier")
    if (veri !== null) {
      urlencoded.append("code_verifier", veri)
    } else {
      alert("code_verifier")
      return
    }

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    };

    fetch("http://localhost:3033/token", requestOptions)
      .then(response => response.json())
      .then(result => {
        localStorage.setItem("access_token", result.access_token)
        localStorage.setItem("id_token", result.id_token)
        console.log(result)

      })
  }

  const verifyIDToken = async (jwt: string) => {
    const JWKS = jose.createRemoteJWKSet(new URL('http://localhost:3033/jwks'))

    const options = {
      issuer: 'http://localhost:3033',
      audience: 'disism_client',
    }
    const { payload, protectedHeader } = await jose
      .jwtVerify(jwt, JWKS, options)
      .catch(async (error) => {
        throw error
      })
    console.log(protectedHeader)
    console.log(payload)
  }

  return (
    <main>
      <h1>Auth</h1>
    </main>
  )
}
