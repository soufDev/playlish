import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { FaMusic, FaClock, FaFire } from 'react-icons/fa';

import { createPlaylistRequest } from '../../../actions/createPlaylistAction';
import { searchArtistsRequest } from '../../../actions/searchArtistsAction';
import { resetSearchArtistsRequest } from '../../../actions/searchArtistsAction';
import { removeTracksRequest } from '../../../actions/removeTracksAction';
import { getArtistTopTracksRequest } from '../../../actions/getArtistTopTracksAction';

import StatsContainer from '../../organisms/StatsContainer';
import PageCoverWithInput from '../../molecules/PageCoverWithInput';
import PlaylistStatItem from '../../molecules/PlaylistStatItem';
import SearchedArtist from '../../molecules/SearchedArtist';
import SelectedArtist from '../../molecules/SelectedArtist';
import Input from '../../elements/Input';
import Button from '../../elements/Button';
import Title from '../../elements/Title';

import cover from '../../../assets/cover_3.jpg';

import './styles.css';

class CreatePlaylistPage extends Component {
  static propTypes = {
    /** Function performing an API call to create a playlist into Spotify */
    createPlaylist: PropTypes.func.isRequired,
    /** The Spotify connected user */
    connectedUser: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      playlistName: '',
      artistKeyword: ''
    };
  }

  onClickCreatePlaylist = () => {
    const { playlistName } = this.state;
    const { selectedArtists, connectedUser, accessToken } = this.props;

    const tracks = selectedArtists
      ? selectedArtists
          .map(artist => {
            return Object.values(artist)[0].tracks;
          })
          .flat()
      : [];

    // TODO check artists and playlist name not empty
    this.props.createPlaylist(
      connectedUser.id,
      tracks,
      playlistName,
      accessToken
    );
  };

  onChangePlaylistName = e => {
    const playlistName = e.target.value;
    this.setState({ playlistName });
  };

  onChangeSearchArtists = e => {
    const artistKeyword = e.target.value;
    this.setState({ artistKeyword });
    const { accessToken } = this.props;

    if (artistKeyword.length > 2) {
      this.props.searchArtists(artistKeyword, accessToken);
    }
  };

  addArtist = artist => {
    const { getArtistTopTracks, accessToken, resetSearchArtists } = this.props;
    getArtistTopTracks(artist, accessToken);
    this.setState({ artistKeyword: '' });
    resetSearchArtists();
  };

  countTracks = () => {
    const { selectedArtists } = this.props;
    if (!selectedArtists || selectedArtists.length === 0) return 0;

    const artistsArray = selectedArtists.map(
      item => Object.values(item)[0].tracks.length
    );
    return artistsArray.reduce((sum, x) => sum + x);
  };

  msToTime = duration => {
    // const milliseconds = parseInt((duration % 1000) / 100),
    //   seconds = parseInt((duration / 1000) % 60);
    let minutes = parseInt((duration / (1000 * 60)) % 60),
      hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    // seconds = seconds < 10 ? "0" + seconds : seconds;

    // return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    return hours + 'h ' + minutes + 'min';
  };

  calculateDuration = () => {
    const { selectedArtists } = this.props;
    if (!selectedArtists || selectedArtists.length === 0) return 0;

    const tracksDurationArray = selectedArtists.map(
      item => Object.values(item)[0].tracks.duration_ms
    );
    const duration = tracksDurationArray.reduce((sum, x) => sum + x);
    return this.msToTime(duration);
  };

  calculatePopularity = countTracks => {
    const { selectedArtists } = this.props;
    if (!selectedArtists || selectedArtists.length === 0 || countTracks === 0)
      return 0;

    const tracksPopularityArray = selectedArtists.map(item =>
      Object.values(item)[0].tracks.map(t => t.popularity)
    );

    const artistsPopularityArray =
      tracksPopularityArray.reduce((sum, x) => sum + x) / countTracks;

    console.log('t', tracksPopularityArray);

    return Math.round(
      tracksPopularityArray.reduce((sum, x) => sum + x) / countTracks
    );
  };

  render() {
    const { searchedArtists, selectedArtists } = this.props;
    const countTracks = this.countTracks();
    const playlistDuration = this.calculateDuration();
    const playlistPopularity = this.calculatePopularity(countTracks);
    const createInputPlaceholder = 'Enter a name for your playlist';

    return (
      <div className="PlaylistDetailPage-container">
        <PageCoverWithInput
          alt="Create your playlist"
          src={cover}
          value={this.state.value}
          placeholder={createInputPlaceholder}
          onChangeFn={this.onChangePlaylistName}
        />

        <StatsContainer>
          <PlaylistStatItem
            icon={<FaMusic />}
            value={countTracks}
            text="Tracks"
          />
          <PlaylistStatItem
            icon={<FaClock />}
            value={playlistDuration}
            text="Duration"
          />
          <PlaylistStatItem
            icon={<FaFire />}
            value={playlistPopularity}
            text="Popularity"
          />
        </StatsContainer>

        <div className="CreatePlaylistPage-body">
          <div className="CreatePlaylistPage-innerBody">
            <Title text="Search" />

            <Input
              placeholder="Arctic Monkeys, Terror, Welshly Arms ..."
              value={this.state.artistKeyword}
              onChangeFn={this.onChangeSearchArtists}
              styles={{ padding: '0px', border: 'none' }}
            />
            <div className="CreatePlaylistPage-searchResults">
              {!searchedArtists ? (
                <p>
                  Start by searching for artists. Note that we'll only display
                  the 5 most relevant ones. Then, add them to your playlist.
                </p>
              ) : (
                searchedArtists.items.map((artist, i) => {
                  return (
                    <SearchedArtist
                      artist={artist}
                      key={`searched-artists-${i}`}
                      onClickFn={() => this.addArtist(artist)}
                      last={i === searchedArtists.items.length - 1}
                    />
                  );
                })
              )}
            </div>

            {selectedArtists && selectedArtists.length > 0 ? (
              <div className="CreatePlaylistPage-playlist">
                <Title text="Your Playlist" />
                {selectedArtists.map((artist, i) => {
                  return (
                    <SelectedArtist
                      artist={Object.values(artist)[0]}
                      key={`selected-artist-${i}`}
                    />
                  );
                })}
                <Button
                  text="Create"
                  onClickFn={this.onClickCreatePlaylist}
                  styles={{ marginTop: '32px' }}
                  disabled={!this.state.playlistName}
                />
              </div>
            ) : (
              ''
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    resetSearchArtists: () => dispatch(resetSearchArtistsRequest()),
    getArtistTopTracks: (artist, accessToken) =>
      dispatch(getArtistTopTracksRequest(artist, accessToken)),
    removeTracks: (tracksUris, accessToken) =>
      dispatch(removeTracksRequest(tracksUris, accessToken)),
    searchArtists: (keyword, accessToken) =>
      dispatch(searchArtistsRequest(keyword, accessToken)),
    createPlaylist: (userId, tracks, playlistName, accessToken) =>
      dispatch(createPlaylistRequest(userId, tracks, playlistName, accessToken))
  };
};

const mapStateToProps = state => {
  const { createPlaylistReducer } = state;

  const isSearchingArtists = createPlaylistReducer
    ? createPlaylistReducer.isSearchingArtists
    : false;
  const searchedArtists = createPlaylistReducer
    ? createPlaylistReducer.searchedArtists
    : null;
  const isFetchingTracks = createPlaylistReducer
    ? createPlaylistReducer.isFetchingTracks
    : false;
  const selectedArtists = createPlaylistReducer
    ? createPlaylistReducer.selectedArtists
    : null;

  return {
    isSearchingArtists,
    searchedArtists,
    isFetchingTracks,
    selectedArtists
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreatePlaylistPage);
