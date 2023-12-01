
"use client"

import React from "react";
import AlbumCreation from "@/app/streaming/music/album/components/create";
import AlbumList from "@/app/streaming/music/album/components/ls";


export default function Page() {


  return (
    <main>
      <h2>Albums</h2>
      <AlbumCreation />
      <hr/>
      <h2>My Albums</h2>
      <AlbumList />

    </main>
  )
}
