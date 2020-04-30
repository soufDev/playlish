import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './styles.css';

export default class ArtistRow extends Component {
  static propTypes = {
    /** Spotify artist */
    artist: PropTypes.object.isRequired,
    /** Function to remove the artist from the selected ones */
    deleteFn: PropTypes.func.isRequired,
  };

  render() {
    const { artist } = this.props;
    console.log('here');

    return (
      <div className="ArtistRow-container" data-test="artist-row">
        <div className="ArtistRow-left">
          <img src={artist.images[0].url} alt={artist.name} />

          <div className="ArtistRow-nameContainer">
            <span>{artist.name}</span>
          </div>
        </div>
        <div className="ArtistRow-delete" onClick={this.props.deleteFn}>
          X
        </div>
      </div>
    );
  }
}
