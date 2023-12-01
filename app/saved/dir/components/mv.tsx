import React, {ChangeEvent, useEffect, useState} from 'react';
import {useRouter} from "next/navigation";
import {Subdir} from "@/app/types";
import {SAVED_APIs} from "@/app/nav";
import {handleResult} from "@/app/errors";
import {getDirs} from "@/app/saved/dir/components/fetch";

interface MVDirComponentProps {
  id: string | undefined;
}

const MVDir: React.FC<MVDirComponentProps> = ({ id }) => {

  const router = useRouter()

  const [subdirs, setSubdirs] = useState<Subdir[]>()

  const {DIRS} = SAVED_APIs

  const select = () => {
    const token = localStorage.getItem("token")
    if (token === null) {
      router.push("/")
      return
    }
    getDirs(token).then(result => {
      setSubdirs(result?.subdirs)
    })
  }

  const [selectedValue, setSelectedValue] = useState<string>("");

  const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const v = JSON.parse(event.target.value)
    setSelectedValue(v.id);
    const c = window.confirm(`MV TO: ${v.name} ?`)
    if (c) {
      const token = localStorage.getItem("token")
      if (token === null) {
        router.push("/")
        return
      }

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions : RequestInit = {
        method: 'PUT',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch(  `${DIRS}/${id}/mv/${v.id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result.code !== undefined) {
            handleResult(result);
            return;
          }
          router.push(`/saved/dir/${v.id}`)
        })
        .catch(error => console.log('error', error));
    } else {
      alert("Cancel")
    }
  };

  return (
    <div>
      MV TO 
      <select onFocus={select} value={selectedValue} onChange={handleSelectChange}>
        <option value="" disabled>SELECT DIR</option>
        {subdirs?.map((dir, idx) => {
          return (
            <option key={idx} value={JSON.stringify({id: dir.id, name: dir.name})}>{dir.name}</option>
          )
        })}
      </select>
    </div>
  );
};

export default MVDir;