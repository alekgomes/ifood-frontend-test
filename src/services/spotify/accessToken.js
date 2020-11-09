import axios from "axios";

const fetchSpotifyAccessToken = () => {
  const client_id = process.env.CLIENT_ID;
  const client_secret = process.env.CLIENT_SECRET;
  const hash = btoa(`${client_id}:${client_secret}`);

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  const config = {
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization: `Basic ${hash}`,
    },
    data: params,
  };

  return axios(config);
};

export default fetchSpotifyAccessToken;
