
import {SAVED_APIs, STREAMING_APIs, UPLOAD_APIs} from "@/app/nav";
import {ArtistData, MusicGenreData} from "@/app/types";
import {handleResult} from "@/app/errors";
import {getAudioInfo} from "@/app/file";

interface RemoveArtistResponse {
  message: string;
}

interface AddArtistResponse {
  message: string;
}

interface CreateArtistsResponse {
  message: string;
  artists: ArtistData[];
}

interface ArtistSearchResponse {
  message: string;
  artists: {
    id: string;
    name: string;
  }[];
}

interface RemoveGenreResponse {
  message: string;
}

interface AddGenreResponse {
  message: string;
}

interface CreateGenresResponse {
  message: string;
  genres: MusicGenreData[];
}

interface GenreSearchResponse {
  message: string;
  genres: {
    id: string;
    name: string;
  }[];
}


interface CreateMusicObject {
  cid: string
  name: string
  size: string
  duration: string
}



export const removeArtistFromMusic = async (musicId: string, artistId: string): Promise<RemoveArtistResponse | undefined> => {
  const {MUSIC} = STREAMING_APIs;
  const token = localStorage.getItem("token");
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${MUSIC}/${musicId}/artists/${artistId}`, requestOptions);
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
};

export const addArtistToMusic = async (musicId: string, artistId: string): Promise<AddArtistResponse  | undefined> => {
  const {MUSIC} = STREAMING_APIs;
  const token = localStorage.getItem("token");
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${MUSIC}/${musicId}/artists/${artistId}`, requestOptions);
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

export const createArtists = async (artists: string[]): Promise<CreateArtistsResponse  | undefined> => {

  const {MUSIC} = STREAMING_APIs;

  const token = localStorage.getItem("token");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    "artists": artists
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  try {
    const response = await fetch(`${MUSIC}/artists`, requestOptions);
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

export const searchArtist = async (name: string): Promise<ArtistSearchResponse> => {
  const {MUSIC} = STREAMING_APIs;
  const token = localStorage.getItem("token")
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${token}`
  );

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `${MUSIC}/artists?name=${name}`,
      requestOptions
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const uploadFiles = async (selectedFiles: File[], token: string) => {
  const UPLOAD = UPLOAD_APIs.UPLOAD;

  const createMusicArray: CreateMusicObject[] = [];

  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    const res = await getAudioInfo(file);

    const formdata = new FormData();
    formdata.append("file", file);

    const requestOptions: RequestInit = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };

    const response = await fetch(`${UPLOAD}/music/file`, requestOptions);
    const result = await response.json();

    const combo: CreateMusicObject = {
      cid: result.cid,
      name: result.name,
      size: result.size,
      duration: res.duration.toString()
    };

    createMusicArray.push(combo);
  }

  return createMusicArray;
};

export const createMusic = async (createMusicArray: CreateMusicObject[], token: string) => {
  const MUSIC = STREAMING_APIs.MUSIC;
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    "musics": createMusicArray
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  const response = await fetch(MUSIC, requestOptions);

  return await response.json();
};


export const removeGenreFromMusic = async (musicId: string, genreId: string): Promise<RemoveGenreResponse | undefined> => {
  const {MUSIC} = STREAMING_APIs;
  const token = localStorage.getItem("token");
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: 'DELETE',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${MUSIC}/${musicId}/genres/${genreId}`, requestOptions);
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
};

export const addGenreToMusic = async (musicId: string, genreId: string): Promise<AddGenreResponse  | undefined> => {
  const {MUSIC} = STREAMING_APIs;
  const token = localStorage.getItem("token");
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };

  try {
    const response = await fetch(`${MUSIC}/${musicId}/genres/${genreId}`, requestOptions);
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

export const createGenres = async (genres: string[]): Promise<CreateGenresResponse  | undefined> => {

  const {MUSIC} = STREAMING_APIs;

  const token = localStorage.getItem("token");

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", `Bearer ${token}`);

  const raw = JSON.stringify({
    "genres": genres
  });

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  try {
    const response = await fetch(`${MUSIC}/genres`, requestOptions);
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


export const searchGenre = async (name: string): Promise<GenreSearchResponse> => {
  const {MUSIC} = STREAMING_APIs;
  const token = localStorage.getItem("token")
  const myHeaders = new Headers();
  myHeaders.append(
    "Authorization",
    `Bearer ${token}`
  );

  const requestOptions: RequestInit = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      `${MUSIC}/genres?name=${name}`,
      requestOptions
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};
