import {STREAMING_APIs} from "@/app/nav";
import {handleResult} from "@/app/errors";
import {PlaylistData} from "@/app/types";

interface GetPlaylistDataResponse {
  message: string;
  playlists: PlaylistData[]
}

export const getPlaylists = async (): Promise<GetPlaylistDataResponse | undefined> =>{
  const {MUSIC} = STREAMING_APIs;
  const token = localStorage.getItem("token");

  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${MUSIC}/playlists`, requestOptions);
    const result = await response.json();
    if (result.code != undefined) {
      handleResult(result)
      return
    }
    return result;
  } catch (error) {
    console.log('error', error);
    throw error;
  }

}
