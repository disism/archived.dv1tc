  "use client"

import React, {useEffect, useState} from "react";
import {ACCOUNTS_APIs} from "@/app/nav";
import {useRouter} from "next/navigation";
import {Device, DeviceResponseData} from "@/app/types";
  import {handleResult} from "@/app/errors";

const TOKEN_KEY = "token"

export default function Page() {
  const router = useRouter()
  const [token, setToken] = useState("")

  const { DEVICES, DEVICE } = ACCOUNTS_APIs

  const [devices, setDevices] = useState<Device[]>([])
  const [deviceID, setDeviceID] = useState("")


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
    fetch(DEVICES, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result.code != undefined) {
          handleResult(result)
          return
        }
        if (result.message == "OK") {
          setDevices(result.devices)
          setDeviceID(result.deviceId)
        }
      })
      .catch(error => console.log('error', error));

  }, [DEVICES, router]);

  const deleteDeviceHandler = (id: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions: RequestInit = {
      method: 'DELETE',
      headers: myHeaders,
      redirect: 'follow'
    };

    fetch(`${DEVICE}/${id}`, requestOptions)
      .then(response => response.json())
      .then(result => {
        alert(result.message)
        location.reload()
      })
      .catch(error => console.log('error', error));
  }
  const deleteDevice = (id: string) => {
    if (id == deviceID) {
      const d = window.confirm("Remove?")
      if (d) {
        deleteDeviceHandler(id)
        localStorage.removeItem("token")
        router.push("/")
      } else {
        alert("Cancel")
      }
    } else {
      deleteDeviceHandler(id)
    }
  }
  return (
    <main>
      <h1>Devices</h1>
      <div>
        {devices && devices.map((d, i) => (
          <div key={i}>
            <h3>{d.device} </h3>
            <pre>{d.ip}</pre>
            <pre>{d.createTime}</pre>
            <button onClick={() => deleteDevice(d.id)}>{deviceID != d.id ? "Logout" : "Logout "}</button>
            <hr/>
          </div>
        ))}
      </div>
    </main>
  )
}