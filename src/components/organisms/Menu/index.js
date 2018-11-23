import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Button from '../../elements/Button';
import MenuHeader from '../../molecules/MenuHeader';
import MenuUserCard from '../../molecules/MenuUserCard';
import MenuSeparator from '../../elements/MenuSeparator';
import MenuNavigation from '../../molecules/MenuNavigation';
import MenuFollow from '../../molecules/MenuFollow';
import MenuFooter from '../../molecules/MenuFooter';
import { AuthConsumer } from '../../../contexts/AuthContext';

import './styles.css';

export default class Menu extends Component {
  static propTypes = {
    /** Spotify connected user */
    connectedUser: PropTypes.object,
    /** Function to redirect the user to the homepage */
    redirectToHome: PropTypes.func.isRequired
  };

  render() {
    return (
      <div className="Menu-container">
        <AuthConsumer>
          {({ isConnected, user }) => (
            <div className="Menu-innerContainer">
              {isConnected && user ? (
                <>
                  <div className="MenuUpper-container">
                    <MenuHeader />
                    <MenuUserCard styles={{ marginTop: '64px' }} />
                    <MenuSeparator />
                    <MenuNavigation />
                    <MenuSeparator />
                    <MenuFollow />
                    <MenuFooter />
                  </div>
                </>
              ) : (
                <>
                  It seems that you're not authenticated.
                  <Button text="Login" onClickFn={this.redirectToHome} />
                </>
              )}
            </div>
          )}
        </AuthConsumer>
      </div>
    );
  }
}
