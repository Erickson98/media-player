interface LastPlayed {
  albumId: string;
  trackId: string;
  trackName: string;
  imgAlbum: ImageAlbum[];
  artistImg: string;
  trackArtists: string;
  bioArtist: string;
  artistName: string;
  albumName: string;
}
interface ImageAlbum {
  uri: string;
  height: number;
  width: number;
}
