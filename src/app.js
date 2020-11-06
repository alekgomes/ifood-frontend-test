import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const App = () => {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState("");
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    fetchSpotifyAccessToken().then(({ data }) =>
      setSpotifyAccessToken(data.access_token)
    );
  }, []);

  useEffect(() => {
    if (spotifyAccessToken === "") return;
    fetchFeaturedPlaylists().then(({ data }) =>
      setPlaylists(data.playlists.items)
    );
  }, [spotifyAccessToken]);

  const fetchSpotifyAccessToken = () => {
    const client_id = "1dc68d9df5d5462d86454ec32ba81774";
    const client_secret = "04fc9360ff664605857ce385a4c4dea8";
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

  const fetchFeaturedPlaylists = (uri = "featured-playlists") => {
    const domain = "https://api.spotify.com/v1/browse";

    const config = {
      method: "GET",
      url: `${domain}/${uri}`,
      headers: {
        Authorization: `Bearer ${spotifyAccessToken}`,
      },
    };

    return axios(config);
  };

  console.log(spotifyAccessToken);
  console.log(playlists);
  return (
    <main className="container">
      <section id="filter"></section>
      <section id="playlists">
        <div className="playlist">
          <img
            src="https://i.scdn.co/image/ab67706f00000003278197087524cc094f86e82b"
            alt="Playlist Cover"
            width="50"
          />
          <p>Name</p>
        </div>
      </section>
    </main>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
