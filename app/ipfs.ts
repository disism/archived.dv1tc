
// export const IPFS_GATEWAY="ipfs.w3s.link"
export const IPFS_GATEWAY="http://localhost:8081"

export const GetPreviewLink = (cid: string, filename: string) => {
  return `${IPFS_GATEWAY}/ipfs/${cid}?filename=${filename}`
}
export const GetDownloadLink = (cid: string, filename: string) => {
  // return `https://${cid}.${IPFS_GATEWAY}/${f}`
  return `${IPFS_GATEWAY}/ipfs/${cid}?download=true&filename=${filename}`
}
