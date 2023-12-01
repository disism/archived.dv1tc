"use client"

import React, {ChangeEvent, useEffect, useState} from "react";
import {SAVED_APIs} from "@/app/nav";
import {useRouter} from "next/navigation";
import {DirData, FileData, Subdir, SubdirResponse} from "@/app/types";
import RMDir from "@/app/saved/dir/components/rm";
import MKDir from "@/app/saved/dir/components/mk";
import MVDir from "@/app/saved/dir/components/mv";
import SavedDirs from "@/app/saved/dir/components/dir";
import {handleResult} from "@/app/errors";
import FileList from "@/app/saved/files/components/ls";

export default function Page({ params }: { params: { slug: string } }) {

  const router = useRouter()

  const [dir, setDir] = useState<DirData>()
  const [subdirs, setSubdirs] = useState<Subdir[]>()
  const [files, setFiles] = useState<FileData[]>()

  const {DIRS} = SAVED_APIs


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

    fetch(`${DIRS}?id=${params.slug}`, requestOptions)
      .then(response => response.json())
      .then((result: SubdirResponse) => {
        setDir(result.dir)
        setSubdirs(result?.subdirs)
        setFiles(result?.files)
      })
      .catch(error => console.log('error', error));
  }, [DIRS, params.slug, router]);


  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState<string | undefined>()

  const handleTextClick = () => {
    setText(dir?.name)
    setIsEditing(true);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleInputBlur = () => {
    setIsEditing(false);
    if (text !== dir?.name) {
      const n = window.confirm(` ${text} ?`)
      if (n) {
        const token = localStorage.getItem("token")
        if (token === null) {
          router.push("/")
          return
        }

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${token}`);

        const raw = JSON.stringify({
          "name": text
        });

        const requestOptions: RequestInit = {
          method: 'PATCH',
          headers: myHeaders,
          body: raw,
          redirect: 'follow'
        };

        fetch(`${DIRS}/${params.slug}/name`, requestOptions)
          .then(response => response.json())
          .then(result => {
            if (result.code !== undefined) {
              handleResult(result);
              return;
            }
            location.reload();
          })
          .catch(error => console.log('error', error));
      } else {
        alert("Cancel")
      }
    } else {
      alert("No change")
    }
  };
  return (
    <main>
      <h1>
        {isEditing ? (
          <input
            type="text"
            value={text}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            autoFocus
          />
        ) : (
          <span onClick={handleTextClick}>{dir?.name}</span>
        )}
      </h1>
      <MKDir parentID={dir?.id} />
      <RMDir id={dir?.id} />
      <MVDir id={dir?.id} />

      <h2>Dir List</h2>
      <div>
        <SavedDirs dirs={subdirs}/>
      </div>
      <h2>File List</h2>
      <FileList dir={dir} files={files} />
    </main>
  )
}
