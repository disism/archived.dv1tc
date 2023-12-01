"use client"

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {SAVED_APIs} from "@/app/nav";
import {handleResult} from "@/app/errors";
import {FileData} from "@/app/types";
import FileList from "@/app/saved/files/components/ls";


export default function Page() {
  const router = useRouter()
  const { FILES } = SAVED_APIs

  const [files, setFiles] = useState<FileData[]>()
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token === null) {
      router.push("/")
      return
    }

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${FILES}?per_page=10&page=1&sort=created&direction=desc`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.code !== undefined) {
          handleResult(result);
          return;
        }
        setFiles(result?.files)
      })
      .catch(error => console.log('error', error));
  }, [FILES, router]);


  return (
    <main>
      <h1>Saves</h1>
      <FileList dir={undefined} files={files} />
    </main>
  )
}

