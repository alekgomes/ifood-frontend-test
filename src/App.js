import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import fetchSpotifyAccessToken from "./services/spotify/accessToken";
import fetchApiFilters from "./services/ifood/apiFilters";
import "bootstrap/dist/css/bootstrap.min.css";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Playlists from "./Playlists";
import Filters from "./Filters";

import "./style.css";

const App = () => {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const [filteredByName, setFilteredByName] = useState([]);
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

  const concatParam = () => {
    const { locale, country, timestamp, limit, offset } = queryParams;
    const newUri = `featured-playlists?locale=${locale}&country=${country}&timestamp=${timestamp}&limit=${limit}&offset=${offset}`;
    return newUri;
  };

  const handleClick = (value, id) => {
    const newObj = { ...queryParams };
    if (value === "en_US") value = "US";
    newObj[id] = value;

    setQueryParams(newObj);
  };

  return (
    <Container className="text-center">
      <Row>
        <Col>
          <header className="mt-3">
            <h1>Spotifood</h1>
            <p>A trilha sonora da sua refeição</p>
          </header>
        </Col>
      </Row>
      <main>
        <section id="filters">
          <Filters
            filters={filters}
            queryParams={queryParams}
            setSearch={setSearch}
            search={search}
            handleClick={handleClick}
          />
        </section>

        <section id="playlists" className="mt-3">
          <Row xs={1} sm={2} md={3} lg={4}>
            {playlists.length > 0 ? (
              <Playlists filteredByName={filteredByName} />
            ) : (
              "Fetching playlists"
            )}
          </Row>
        </section>
      </main>
    </Container>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
