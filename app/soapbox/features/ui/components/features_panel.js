import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'soapbox/components/icon';
import { NavLink } from 'react-router-dom';
import { injectIntl, defineMessages } from 'react-intl';

const messages = defineMessages({
  edit_profile: { id: 'account.edit_profile', defaultMessage: 'Edit Profile' },
  preferences: { id: 'navigation_bar.preferences', defaultMessage: 'Preferences' },
  security: { id: 'navigation_bar.security', defaultMessage: 'Security' },
  lists: { id: 'column.lists', defaultMessage: 'Lists' },
  bookmarks: { id: 'column.bookmarks', defaultMessage: 'Bookmarks' },
});

export default
@injectIntl
class FeaturesPanel extends React.PureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  render() {
    const { intl } = this.props;

    return (
      <div className='wtf-panel promo-panel'>
        <div className='promo-panel__container'>

          <NavLink className='promo-panel-item' to='/settings/profile'>
            <Icon id='user' className='promo-panel-item__icon' fixedWidth />
            {intl.formatMessage(messages.edit_profile)}
          </NavLink>


          <NavLink className='promo-panel-item' to='/bookmarks'>
            <Icon id='bookmark' className='promo-panel-item__icon' fixedWidth />
            {intl.formatMessage(messages.bookmarks)}
          </NavLink>

          <NavLink className='promo-panel-item' to='/lists'>
            <Icon id='list' className='promo-panel-item__icon' fixedWidth />
            {intl.formatMessage(messages.lists)}
          </NavLink>

          <NavLink className='promo-panel-item' to='/auth/edit'>
            <Icon id='lock' className='promo-panel-item__icon' fixedWidth />
            {intl.formatMessage(messages.security)}
          </NavLink>

          <NavLink className='promo-panel-item' to='/settings/preferences'>
            <Icon id='cog' className='promo-panel-item__icon' fixedWidth />
            {intl.formatMessage(messages.preferences)}
          </NavLink>

        </div>
      </div>
    );
  }

}
