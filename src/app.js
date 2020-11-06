import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import fetchSpotifyAccessToken from "./services/spotify/accessToken";
import fetchApiFilters from "./services/ifood/apiFilters";

import "./style.css";

const App = () => {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [filters, setFilters] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredByName, setFilteredByName] = useState([]);

  useEffect(() => {
    fetchApiFilters().then(({ data }) => setFilters(data.filters));
  }, []);

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

  useEffect(() => {
    setFilteredByName(
      playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, playlists]);

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

  const displayPlaylists = () =>
    filteredByName.map(playlist => {
      const { url } = playlist.images[0];
      const { name, id } = playlist;

      return (
        <div className="playlist" key={id}>
          <img
            src={url}
            width="50"
            alt="Playlist Cover"
            className="playlist__cover"
          />
          <p className="playlist__name">{name}</p>
        </div>
      );
    });

  return (
    <main>
      <section id="filters">
        <div>
          <input
            type="text"
            name="name"
            id="name"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="search by name..."
          />
        </div>
      </section>
      <section id="playlists">
        {playlists.length > 0 ? displayPlaylists() : "Fetching playlists"}
      </section>
    </main>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
