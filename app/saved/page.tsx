"use client"

import React, {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {SAVED_APIs} from "@/app/nav";
import {handleResult} from "@/app/errors";
import {SavedStatus} from "@/app/types";
import Mk from "@/app/saved/dir/components/mk";
import UploadFiles from "@/app/saved/files/components/add";
import SavedDirs from "@/app/saved/dir/components/dir";
import FileList from "@/app/saved/files/components/ls";
import {HttpClient} from "@/app/api";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

export default function Page() {

  const router = useRouter()

  const [status, setStatus] = useState<SavedStatus>()


  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token === null) {
      router.push("/")
      return
    }

    const client = new HttpClient()
    client.setHeaderToken(token)
    client.get("/_saved/v1/activities").then(res => {
      if (!res.activity) {
        const c = window.confirm("no open saved")
        if (c) {
          router.push("/saved/setting")
          return;
        } else {
          router.push("/")
          return;
        }
      } else {
        setStatus(res)
      }
    }).catch(error => console.log(error))

  }, [router]);

  return (
    <main>
      <h1>Saved</h1>
      <h2>Dir</h2>
      <div>
        <h3>Create Dir</h3>
        <Mk parentID={status?.root?.id}/>
      </div>

      <h3>Dir List</h3>
      <SavedDirs dirs={status?.dirs}/>

      <hr/>
      <h2>File</h2>
      <div>
        <h3>Upload File</h3>
        <UploadFiles />
      </div>

      <h3>File List</h3>
      <button onClick={() => router.push("/saved/files")}>my upload files</button>
      <FileList dir={undefined} files={status?.files} />
    </main>
  )
}
