import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import moment from "moment";
import fetchSpotifyAccessToken from "./services/spotify/accessToken";
import fetchApiFilters from "./services/ifood/apiFilters";

import "./style.css";

const App = () => {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [filteredByName, setFilteredByName] = useState([]);
  const [uri, setUri] = useState("featured-playlists");
  const [queryParams, setQueryParams] = useState({
    locale: "en_AU",
    country: "BR",
    timestamp: "2014-10-23T02:00:00.000Z",
    limit: 20,
    offset: 0,
  });

  useEffect(() => {
    fetchApiFilters().then(({ data }) =>
      setFilters(
        data.filters.reduce((init, curr) => {
          const { id, name, ...rest } = curr;
          init[curr.id] = curr;
          return init;
        }, {})
      )
    );
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
  }, [spotifyAccessToken, queryParams]);

  useEffect(() => {
    setFilteredByName(
      playlists.filter(playlist =>
        playlist.name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, playlists]);

  const fetchFeaturedPlaylists = () => {
    const domain = "https://api.spotify.com/v1/browse";

    const config = {
      method: "GET",
      url: `${domain}/${concatParam()}`,
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

  const concatParam = () => {
    const { locale, country, timestamp, limit, offset } = queryParams;
    const newUri = `${uri}?locale=${locale}&country=${country}&timestamp=${timestamp}&limit=${limit}&offset=${offset}`;
    return newUri;
  };

  const filterTimestamp = filterObj => {
    if (!filterObj) return;
    return (
      <input
        type="date"
        onChange={e =>
          concatParam(
            moment(
              e.target.value,
              filters.timestamp.validation.pattern
            ).toISOString(),
            filterObj.id
          )
        }
      />
    );
  };

  const handleClick = (value, id) => {
    const newObj = { ...queryParams };
    newObj[id] = value;

    setQueryParams(newObj);

    // concatParam();
  };

  const filterSelect = filterObj => {
    if (!filterObj) return;
    const { id, name, values } = filterObj;

    return (
      <label htmlFor={id}>
        {name}

        <select name={id} id={id}>
          {values.map(val => {
            return (
              <option
                value={val.value}
                onClick={e => {
                  handleClick(e.target.value, id);
                }}
                key={`${val.value}+${val.name}`}
                selected={val.value === queryParams[id]}
              >
                {val.name}
              </option>
            );
          })}
        </select>
      </label>
    );
  };

  return (
    <main>
      <section id="filters">
        {filterSelect(filters.country)}
        {filterSelect(filters.locale)}
        {/* {filterTimestamp(filters.timestamp)} */}
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
        <h1>{uri}</h1>
      </section>
      <section id="playlists">
        {playlists.length > 0 ? displayPlaylists() : "Fetching playlists"}
      </section>
    </main>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
