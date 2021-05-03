import React from 'react';
import { defineMessages, injectIntl, FormattedMessage, FormattedNumber } from 'react-intl';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Column from '../ui/components/column';
import RegistrationModePicker from './components/registration_mode_picker';
import { parseVersion } from 'soapbox/utils/features';
import sourceCode from 'soapbox/utils/code';

const messages = defineMessages({
  heading: { id: 'column.admin.dashboard', defaultMessage: 'Dashboard' },
});

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
});

export default @connect(mapStateToProps)
@injectIntl
class Dashboard extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    instance: ImmutablePropTypes.map.isRequired,
  };

  render() {
    const { intl, instance } = this.props;
    const v = parseVersion(instance.get('version'));
    const userCount = instance.getIn(['stats', 'user_count']);
    const mau = instance.getIn(['pleroma', 'stats', 'mau']);
    const retention = (userCount && mau) ? Math.round(mau / userCount * 100) : null;

    return (
      <Column icon='tachometer' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <div className='dashcounters'>
          {mau && <div className='dashcounter'>
            <div>
              <div className='dashcounter__num'>
                <FormattedNumber value={mau} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='admin.dashcounters.mau_label' defaultMessage='monthly active users' />
              </div>
            </div>
          </div>}
          <div className='dashcounter'>
            <a href='/pleroma/admin/#/users/index' target='_blank'>
              <div className='dashcounter__num'>
                <FormattedNumber value={userCount} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='admin.dashcounters.user_count_label' defaultMessage='total users' />
              </div>
            </a>
          </div>
          {retention && <div className='dashcounter'>
            <div>
              <div className='dashcounter__num'>
                {retention}%
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='admin.dashcounters.retention_label' defaultMessage='user retention' />
              </div>
            </div>
          </div>}
          <div className='dashcounter'>
            <a href='/pleroma/admin/#/statuses/index' target='_blank'>
              <div className='dashcounter__num'>
                <FormattedNumber value={instance.getIn(['stats', 'status_count'])} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='admin.dashcounters.status_count_label' defaultMessage='posts' />
              </div>
            </a>
          </div>
          <div className='dashcounter'>
            <div>
              <div className='dashcounter__num'>
                <FormattedNumber value={instance.getIn(['stats', 'domain_count'])} />
              </div>
              <div className='dashcounter__label'>
                <FormattedMessage id='admin.dashcounters.domain_count_label' defaultMessage='peers' />
              </div>
            </div>
          </div>
        </div>
        <RegistrationModePicker />
        <div className='dashwidgets'>
          <div className='dashwidget'>
            <h4><FormattedMessage id='admin.dashwidgets.software_header' defaultMessage='Software' /></h4>
            <ul>
              <li>Soapbox FE <span className='pull-right'>{sourceCode.version}</span></li>
              <li>{v.software} <span className='pull-right'>{v.version}</span></li>
            </ul>
          </div>
        </div>
      </Column>
    );
  }

}
