import React from "react";
import Col from "react-bootstrap/Col";
import Media from "react-bootstrap/Media";

const Playlists = ({ filteredByName }) => {
  return filteredByName.map(playlist => {
    const { id } = playlist;
    const { url } = playlist.images[0];

    return (
      <Col xs={true} key={id}>
        <Media className="justify-content-center mb-3">
          <img src={url} alt="Playlist Cover" />
        </Media>
      </Col>
    );
  });
};
export default Playlists;
