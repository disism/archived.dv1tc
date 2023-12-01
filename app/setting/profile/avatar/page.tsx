"use client"

import React, {useEffect, useState} from "react";
import {ACCOUNTS_APIs} from "@/app/nav";
import {AvatarData} from "@/app/types";
import {handleResult} from "@/app/errors";
import Image from "next/image";
import {GetPreviewLink, IPFS_GATEWAY} from "@/app/ipfs";
import {useRouter} from "next/navigation";

export default function Page() {
  const router = useRouter()
  const [token, setToken] = useState("")

  const {  AVATAR, USER } = ACCOUNTS_APIs

  const [avatars, setAvatars] = useState<AvatarData[]>()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token === null) {
      router.push("/")
      return
    }
    setToken(token)
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(AVATAR, requestOptions)
      .then(response => response.json())
      .then((result) => {
        if (result.code != undefined) {
          handleResult(result)
          return
        }
        if (result.message == "OK") {
          setAvatars(result.avatars)
        }
      })
      .catch(error => console.log('error', error));
  }, [AVATAR, router]);

  const loader = ({ src, width, quality }: { src: string, width: number, quality?: number }): string => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };
  const comb = (avatar: AvatarData) => {
    return `${GetPreviewLink(avatar?.image?.cid, avatar?.image?.name)}`
  }

  const deleteAvatar = (id: string) => {
    const result = window.confirm("Delete Avatar?");
    if (result) {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(`${AVATAR}/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.code != undefined) {
            handleResult(result)
            return
          }
          if (result.message == "DELETE_AVATAR_SUCCESSFULLY") {
            alert("Success")
            location.reload()
          }
        })
        .catch(error => console.log('error', error));
    } else {
      alert("Cancel")
    }

  }

  const usingAvatar = (id: string) => {
    const confirm = window.confirm("Use the avatar?");
    if (confirm) {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      myHeaders.append("Authorization", `Bearer ${token}`);

      const raw = JSON.stringify({
        "avatar_id": id
      });

      const requestOptions: RequestInit = {
        method: 'PATCH',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };

      fetch(`${USER}/avatar`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.code != undefined) {
            handleResult(result)
            return
          }
          if (result.message == "OK") {
            alert("Success")
            location.reload()
          }
        })
        .catch(error => console.log('error', error));

    } else {
      alert("Cancel")
    }
  }

  return (
    <main>
      <h1>AVATAR HISTORY</h1>
      {avatars && <div>
        {avatars.map((avatar, idx) => (
          <div key={idx}>
            <div>
              <Image loader={loader} src={comb(avatar)} width={120} height={120} alt="avatar"/>
            </div>
            <button onClick={() => deleteAvatar(avatar.id)}>Delete</button>
            <button onClick={() => usingAvatar(avatar.id)}>Use</button>
          </div>
        ))}
      </div>}

    </main>
  )
}
