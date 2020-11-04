import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

const App = () => {
  const [spotifyAccessToken, setSpotifyAccessToken] = useState("");

  useEffect(() => {
    getSpotifyAccessToken().then(({ data }) =>
      setSpotifyAccessToken(data.access_token)
    );
  }, []);

  const getSpotifyAccessToken = () => {
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

  console.log(spotifyAccessToken);
  return "Oi from React";
};

ReactDOM.render(<App />, document.querySelector("#root"));
