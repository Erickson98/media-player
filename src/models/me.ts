interface ExternalUrls {
  spotify: string;
}

interface SpotifyArtist {
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  type: "artist";
  uri: string;
}

interface SpotifyTrack {
  artists: SpotifyArtist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  name: string;
  preview_url: string | null;
  track_number: number;
  type: "track";
  uri: string;
  is_local: boolean;
}

interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

interface SpotifyCopyright {
  text: string;
  type: string;
}

interface SpotifyTracks {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyTrack[];
}

interface SpotifyExternalIds {
  upc: string;
}

interface SpotifyAlbum {
  album_type: string;
  total_tracks: number;
  external_urls: ExternalUrls;
  href: string;
  id: string;
  images: SpotifyImage[];
  name: string;
  release_date: string;
  release_date_precision: string;
  type: string;
  uri: string;
  artists: SpotifyArtist[];
  tracks: SpotifyTracks;
  copyrights: SpotifyCopyright[];
  external_ids: SpotifyExternalIds;
  genres: string[];
  label: string;
  popularity: number;
}

interface SpotifySavedAlbumItem {
  added_at: string;
  album: SpotifyAlbum;
}

export interface SpotifySavedAlbumsResponse {
  href: string;
  items: SpotifySavedAlbumItem[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
}
