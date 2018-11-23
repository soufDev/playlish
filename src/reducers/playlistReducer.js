import * as actionTypes from '../actions/actionTypes';

const initialState = {
  isFetchingPlaylists: false,
  playlists: null,

  isFetchingTracks: false,
  isAddingTracks: false,
  tracks: null,
  isCreating: false,
  playlist: null
};

/**
 * This method handles the playlist actions. It returns an object which will
 * be set in the data entry of the reducer.
 */
const playlistReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LIST_PLAYLISTS_REQUEST: {
      return {
        ...state,
        isFetchingPlaylists: true
      };
    }
    case actionTypes.LIST_PLAYLISTS_SUCCESS: {
      const playlists = action.response.data
        ? action.response.data.items
        : initialState.playlists;
      return {
        ...state,
        isFetchingPlaylists: false,
        playlists,
        lastUpdated: action.receivedAt
      };
    }
    case actionTypes.LIST_PLAYLISTS_FAILURE: {
      return {
        ...state,
        isFetchingPlaylists: false,
        playlists: initialState.playlists,
        lastUpdated: action.receivedAt
      };
    }

    case actionTypes.REMOVE_ARTIST: {
      const artistToRemove = action.artist;
      const tracks = state.tracks
        ? state.tracks.filter(t => t.artists[0].id !== artistToRemove.id)
        : initialState.tracks;
      return {
        ...state,
        tracks
      };
    }
    case actionTypes.GET_ARTIST_TOP_TRACKS_REQUEST: {
      return {
        ...state,
        isFetchingTracks: true
      };
    }
    case actionTypes.GET_ARTIST_TOP_TRACKS_SUCCESS: {
      // TODO handle duplicates
      // TODO take the min between tracks.length and 5
      const artistTracks = action.response.data.tracks.slice(0, 5);
      const tracks =
        state.tracks && state.tracks.length > 0
          ? [...state.tracks, ...artistTracks]
          : artistTracks;
      return {
        ...state,
        isFetchingTracks: false,
        tracks,
        lastUpdated: action.receivedAt
      };
    }
    case actionTypes.GET_ARTIST_TOP_TRACKS_FAILURE: {
      return {
        ...state,
        isFetchingTracks: false,
        tracks: undefined,
        lastUpdated: action.receivedAt
      };
    }

    case actionTypes.CREATE_PLAYLIST_REQUEST: {
      return {
        ...state,
        isCreating: true
      };
    }
    case actionTypes.CREATE_PLAYLIST_SUCCESS: {
      // formatting received response
      const playlist = action.response.data;
      return {
        ...state,
        isCreating: false,
        playlist,
        lastUpdated: action.receivedAt
      };
    }
    case actionTypes.CREATE_PLAYLIST_FAILURE: {
      return {
        ...state,
        isCreating: false,
        playlist: undefined,
        lastUpdated: action.receivedAt
      };
    }

    case actionTypes.ADD_TRACKS_PLAYLIST_REQUEST: {
      return {
        ...state,
        isAddingTracks: true
      };
    }
    case actionTypes.ADD_TRACKS_PLAYLIST_SUCCESS: {
      return {
        ...state,
        isAddingTracks: false,
        snapshotId: action.response.data.snapshot_id,
        lastUpdated: action.receivedAt
      };
    }
    case actionTypes.ADD_TRACKS_PLAYLIST_FAILURE: {
      return {
        ...state,
        isAddingTracks: false,
        snapshotId: undefined,
        lastUpdated: action.receivedAt
      };
    }
    default:
      return state;
  }
};

export default playlistReducer;
