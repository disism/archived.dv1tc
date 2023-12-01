import exp from "constants";

export interface User {
  id: string;
  createTime: string;
  updateTime: string;
  username: string;
  email: string;
  name: string;
  avatar: AvatarData | null;
  bio: string;
  private: boolean;
  types: string;
}

export interface AvatarData {
  id: string;
  createTime: string;
  updateTime: string;
  image: {
    cid: string;
    name: string;
    size: string;
    width: number;
    height: number;
  };
}

export interface Device {
  id: string;
  createTime: string;
  updateTime: string;
  device: string;
  ip: string;
}

export interface DeviceResponseData {
  message: string;
  devices: Device[];
  deviceId: string;
}


export interface SavedStatus {
  status: string;
  activity: boolean;
  root: SavedRoot | null;
  dirs: DirData[] | undefined;
  files: FileData[] | undefined;
}
export interface SavedRoot {
  id: string;
  createTime: string;
  updateTime: string;
  name: string;
}

export interface DirData {
  id: string;
  createTime: string;
  updateTime: string;
  name: string;
}

export interface Subdir {
  id: string;
  createTime: string;
  updateTime: string;
  name: string;
}


export interface ParentDir {
  id: string;
  createTime: string;
  updateTime: string;
  name: string;
}

export interface SubdirResponse {
  message: string;
  dir: {
    id: string;
    createTime: string;
    updateTime: string;
    name: string;
  };
  subdirs: Subdir[];
  parents: ParentDir[];
  files: any[];
}

export interface FileData {
  id: string;
  createTime: string;
  updateTime: string;
  cid: string;
  name: string;
  size: string;
  caption: string;
}


export interface ArtistData {
  id: string;
  name: string;
}

export interface StreamingFileData {
  cid: string;
  name: string;
  size: string;
  duration: string;
}
export interface MusicData {
  id: string;
  createTime: string;
  updateTime: string;
  name: string;
  duration: number;
  description: string;
  file: StreamingFileData | undefined;
  albums: null | any[];
  artists: MusicArtistData[] | undefined;
  genres: MusicGenreData[] | undefined;
}

export  interface MusicArtistData {
  id: string;
  name: string;
}

export  interface MusicGenreData {
  id: string;
  name: string;
}

export interface CoverData {
  id: number;
  createTime: string;
  updateTime: string;
  file: FileData;
  width: number;
  height: number;
}

export interface PlaylistData {
  id: string;
  createTime: string;
  updateTime: string;
  name: string;
  description: string;
  cover:  CoverData | undefined;
  private: boolean;
}

export interface AlbumData {
  id: string;
  createTime: string;
  updateTime: string;
  title: string;
  year: number;
  description: string;
  cover: CoverData | undefined;
  artists: ArtistData[] | undefined;
}