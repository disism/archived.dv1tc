import React, {ChangeEvent, useState} from 'react';
import {handleResult} from "@/app/errors";
import {SAVED_APIs} from "@/app/nav";
import {DirData, FileData, Subdir} from "@/app/types";
import {useRouter} from "next/navigation";
import {GetDownloadLink, GetPreviewLink} from "@/app/ipfs";
import {getDirs} from "@/app/saved/dir/components/fetch";
import {RMFile} from "@/app/saved/files/components/rm";
import Link from "next/link";


export function formatBytes(bytes: number): string {
  if (bytes === 0) {
    return '0 MB';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
interface FileListProps {
  dir: DirData | undefined;
  files: FileData[] | undefined;
}

const FileList: React.FC<FileListProps> = ({ dir, files }) => {
  const { DIRS } = SAVED_APIs
  const router = useRouter()

  const [subdirs, setSubdirs] = useState<Subdir[]>()


  const select = () => {
    const token = localStorage.getItem("token")
    if (token === null) {
      router.push("/")
      return
    }
    getDirs(token).then(res => {
      setSubdirs(res?.subdirs)
    })

  }

  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const v = JSON.parse(event.target.value)
    setSelectedValue(v.id);

    const c = window.confirm(`Add to: ${v.name}`)
    if (c) {
      const token = localStorage.getItem("token")
      if (token === null) {
        router.push("/")
        return
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions: RequestInit = {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(`${DIRS}/${v.did}/files/${v.fid}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.code !== undefined) {
            handleResult(result);
            location.reload()
            return;
          }
          router.push(`/saved/dir/${v.did}`)
        })
        .catch(error => console.log('error', error));

    } else {
      alert("Cancel")
    }
  };

  const rfd = (id : string) => {
    const r = window.confirm("Remove?")
    if (r) {
      const token = localStorage.getItem("token")
      if (token === null) {
        router.push("/")
        return
      }
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions: RequestInit = {
        method: 'DELETE',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(`${DIRS}/${dir?.id}/files/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.code !== undefined) {
            handleResult(result);
            return;
          }
          location.reload()
        })
        .catch(error => console.log('error', error));
    } else {
      alert("Cancel")
    }
  }

  return (
    <div>
      <ul>
      {files?.map((f, idx) => {
        return (
          <li key={idx}>
            <b>{f.name}</b><pre>{formatBytes(parseInt(f.size))}</pre>
            <Link href={GetPreviewLink(f.cid, f.name)} target={`_blank`}>
              <pre>{f.cid}</pre>
            </Link>
            <h5>{f.caption}</h5>
            <button onClick={() => RMFile(f.id)}>Delete</button>
            <Link href={GetDownloadLink(f.cid, f.name)} download>
              <button>Download</button>
            </Link>

            {dir != undefined ? <button onClick={() => rfd(f.id)}>Remove</button> : null}
            <select onFocus={select} value={selectedValue} onChange={handleSelectChange}>
              <option value="" disabled>Add to Dir</option>
              {subdirs?.map((dir, idx) => {
                return (
                  <option key={idx} value={JSON.stringify({did: dir.id, name: dir.name, fid: f.id})}>{dir.name}</option>
                )
              })}
            </select>
          </li>
        )
      })}
      </ul>
    </div>
  );
}

export default FileList;