"use client"

import React, {useEffect} from "react";
import * as jose from "jose";


export default function Page() {

  useEffect(() => {
    const myHeaders = new Headers();
    const accessToken = localStorage.getItem("access_token")
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch("http://localhost:3033/me", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
      })
      .catch(error => console.log('error', error));
  }, []);

  const auth = async () => {
    const JWKS = jose.createRemoteJWKSet(new URL('http://localhost:3033/jwks'))
    const jwt = localStorage.getItem("id_token")
    if (jwt === null) {
      alert("No JWT")
      return
    }

    const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
      issuer: 'http://localhost:3033',
      audience: 'disism_client',
    })
    console.log(payload)
    console.log(payload.sub)
    console.log(protectedHeader)
  }

  return (
    <main>
      <h1>IAM</h1>
      <button onClick={() => auth()}>Auth</button>
    </main>
  )
}
