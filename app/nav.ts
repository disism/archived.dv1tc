
type NavRoute = {
    name: string;
    router: string;
};
export const Nav: NavRoute[] = [
    { name: "home", router: "/"},
    { name: "iam", router: "/iam" },
    { name: "streaming", router: "/streaming" },
    { name: "saved", router: "/saved" },
    { name: "setting", router: "/setting" },
]

const HOST: string = "http://localhost:8032"

export const ACCOUNTS_APIs: {
    VERSION: string
    AUTH: string,
    CREATE: string,
    DEVICES: string,
    DEVICE: string,
    USER: string,
    AVATAR: string
} = {
    VERSION:`${HOST}/_accounts/v1/version`,
    AUTH:`${HOST}/_accounts/v1/authentication`,
    CREATE:`${HOST}/_accounts/v1/user`,
    DEVICES: `${HOST}/_accounts/v1/devices`,
    DEVICE: `${HOST}/_accounts/v1/device`,
    USER: `${HOST}/_accounts/v1/user`,
    AVATAR: `${HOST}/_accounts/v1/avatars`
}


export const UPLOAD_APIs: {
    UPLOAD: string
} = {
    UPLOAD: `${HOST}/_upload`
}

export const SAVED_APIs: {
    ACTIVITIES: string
    DIRS: string
    FILES: string
} = {
    ACTIVITIES: `${HOST}/_saved/v1/activities`,
    DIRS: `${HOST}/_saved/v1/dirs`,
    FILES: `${HOST}/_saved/v1/files`
}

export const STREAMING_APIs: {
    STREAMING: string
    FILES: string
    MUSIC: string
} = {
    STREAMING: `${HOST}/_streaming/v1/activities`,
    FILES: `${HOST}/_streaming/v1/files`,
    MUSIC: `${HOST}/_streaming/v1/musics`
}