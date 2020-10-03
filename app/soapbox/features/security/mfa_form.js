import React from 'react';
import { connect } from 'react-redux';
import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';
import ImmutablePureComponent from 'react-immutable-pure-component';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import QRCode from 'qrcode.react';
import Column from '../ui/components/column';
import ColumnSubheading from '../ui/components/column_subheading';
import LoadingIndicator from 'soapbox/components/loading_indicator';
import Button from 'soapbox/components/button';
import { changeSetting, getSettings } from 'soapbox/actions/settings';
import snackbar from 'soapbox/actions/snackbar';
import {
  SimpleForm,
  SimpleInput,
  FieldsGroup,
  TextInput,
} from 'soapbox/features/forms';
import {
  fetchBackupCodes,
  fetchToptSetup,
  confirmToptSetup,
  fetchUserMfaSettings,
  disableToptSetup,
} from '../../actions/mfa';

/*
Security settings page for user account
Routed to /auth/mfa
Includes following features:
- Set up Multi-factor Auth
*/

const messages = defineMessages({
  heading: { id: 'column.security', defaultMessage: 'Security' },
  subheading: { id: 'column.mfa', defaultMessage: 'Multi-Factor Authentication' },
  mfa_cancel_button: { id: 'column.mfa_cancel', defaultMessage: 'Cancel' },
  mfa_setup_button: { id: 'column.mfa_setup', defaultMessage: 'Proceed to Setup' },
  mfa_setup_confirm_button: { id: 'column.mfa_confirm_button', defaultMessage: 'Confirm' },
  mfa_setup_disable_button: { id: 'column.mfa_disable_button', defaultMessage: 'Disable' },
  passwordFieldLabel: { id: 'security.fields.password.label', defaultMessage: 'Password' },
  confirmFail: { id: 'security.confirm.fail', defaultMessage: 'Incorrect code or password. Try again.' },
  qrFail: { id: 'security.qr.fail', defaultMessage: 'Failed to fetch setup key' },
  codesFail: { id: 'security.codes.fail', defaultMessage: 'Failed to fetch backup codes' },
  disableFail: { id: 'security.disable.fail', defaultMessage: 'Incorrect password. Try again.' },
});

const mapStateToProps = state => ({
  backup_codes: state.getIn(['auth', 'backup_codes', 'codes']),
  settings: getSettings(state),
});

export default @connect(mapStateToProps)
@injectIntl
class MfaForm extends ImmutablePureComponent {

  constructor(props) {
    super(props);
    this.props.dispatch(fetchUserMfaSettings()).then(response => {
      this.props.dispatch(changeSetting(['otpEnabled'], response.data.settings.enabled));
      // this.setState({ otpEnabled: response.data.settings.enabled });
    }).catch(e => e);
    this.handleSetupProceedClick = this.handleSetupProceedClick.bind(this);
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    settings: ImmutablePropTypes.map.isRequired,
  };

  state = {
    displayOtpForm: false,
  }

  handleSetupProceedClick = e => {
    e.preventDefault();
    this.setState({ displayOtpForm: true });
  }

  render() {
    const { intl, settings } = this.props;
    const { displayOtpForm } = this.state;

    return (
      <Column icon='lock' heading={intl.formatMessage(messages.heading)} backBtnSlim>
        <ColumnSubheading text={intl.formatMessage(messages.subheading)} />
        { settings.get('otpEnabled') === true && <DisableOtpForm />}
        { settings.get('otpEnabled') === false && <EnableOtpForm handleSetupProceedClick={this.handleSetupProceedClick} />}
        { settings.get('otpEnabled') === false && displayOtpForm && <OtpConfirmForm /> }
      </Column>
    );
  }

}


@connect()
@injectIntl
class DisableOtpForm extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    password: '',
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleOtpDisableClick = e => {
    e.preventDefault();
    const { password } = this.state;
    const { dispatch, intl } = this.props;
    dispatch(disableToptSetup(password)).then(response => {
      this.context.router.history.push('../auth/edit');
      dispatch(changeSetting(['otpEnabled'], false));
    }).catch(error => {
      dispatch(snackbar.error(intl.formatMessage(messages.disableFail)));
    });
  }

  render() {
    const { intl } = this.props;

    return (
      <SimpleForm>
        <div className='security-settings-panel'>
          <h1 className='security-settings-panel__setup-otp'>
            <FormattedMessage id='mfa.otp_enabled_title' defaultMessage='OTP Enabled' />
          </h1>
          <div><FormattedMessage id='mfa.otp_enabled_description' defaultMessage='You have enabled two-factor authentication via OTP.' /></div>
          <div><FormattedMessage id='mfa.mfa_disable_enter_password' defaultMessage='Enter your current password to disable two-factor auth:' /></div>
          <SimpleInput
            type='password'
            name='password'
            onChange={this.handleInputChange}
          />
          <Button className='button button-primary disable' text={intl.formatMessage(messages.mfa_setup_disable_button)} onClick={this.handleOtpDisableClick} />
        </div>
      </SimpleForm>
    );
  }

}


@connect()
@injectIntl
class EnableOtpForm extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  state = {
    backupCodes: [],
  }

  componentDidMount() {
    const { dispatch, intl } = this.props;
    dispatch(fetchBackupCodes()).then(response => {
      this.setState({ backupCodes: response.data.codes });
    }).catch(error => {
      dispatch(snackbar.error(intl.formatMessage(messages.codesFail)));
    });
  }

  handleCancelClick = e => {
    this.context.router.history.push('../auth/edit');
  }

  render() {
    const { intl } = this.props;
    const { backupCodes, displayOtpForm } = this.state;

    return (
      <SimpleForm>
        <div className='security-settings-panel'>
          <h1 className='security-settings-panel__setup-otp'>
            <FormattedMessage id='mfa.setup_otp_title' defaultMessage='OTP Disabled' />
          </h1>
          <h2 className='security-settings-panel__setup-otp'>
            <FormattedMessage id='mfa.setup_hint' defaultMessage='Follow these steps to set up multi-factor authentication on your account with OTP' />
          </h2>
          <div className='security-warning'>
            <FormattedMessage id='mfa.setup_warning' defaultMessage="Write these codes down or save them somewhere secure - otherwise you won't see them again. If you lose access to your 2FA app and recovery codes you'll be locked out of your account." />
          </div>
          <h2 className='security-settings-panel__setup-otp'>
            <FormattedMessage id='mfa.setup_recoverycodes' defaultMessage='Recovery codes' />
          </h2>
          <div className='backup_codes'>
            { backupCodes.length ?
              <div>
                {backupCodes.map((code, i) => (
                  <div key={i} className='backup_code'>
                    <div className='backup_code'>{code}</div>
                  </div>
                ))}
              </div> :
              <LoadingIndicator />
            }
          </div>
          { !displayOtpForm &&
            <div className='security-settings-panel__setup-otp__buttons'>
              <Button className='button button-secondary cancel' text={intl.formatMessage(messages.mfa_cancel_button)} onClick={this.handleCancelClick} />
              { backupCodes.length ?
                <Button className='button button-primary setup' text={intl.formatMessage(messages.mfa_setup_button)} onClick={this.props.handleSetupProceedClick} /> :
                null
              }
            </div>
          }
        </div>
      </SimpleForm>
    );
  }

}


@connect()
@injectIntl
class OtpConfirmForm extends ImmutablePureComponent {

  static contextTypes = {
    router: PropTypes.object,
  };

  static propTypes = {
    intl: PropTypes.object.isRequired,
  };

  state = {
    password: '',
    done: false,
    code: '',
    qrCodeURI: '',
    confirm_key: '',
  }

  componentDidMount() {
    const { dispatch, intl } = this.props;
    dispatch(fetchToptSetup()).then(response => {
      this.setState({ qrCodeURI: response.data.provisioning_uri, confirm_key: response.data.key  });
    }).catch(error => {
      dispatch(snackbar.error(intl.formatMessage(messages.qrFail)));
    });
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleOtpConfirmClick = e => {
    e.preventDefault();
    const { code, password } = this.state;
    const { dispatch, intl } = this.props;
    dispatch(confirmToptSetup(code, password)).then(response => {
      dispatch(changeSetting(['otpEnabled'], true));
    }).catch(error => {
      dispatch(snackbar.error(intl.formatMessage(messages.confirmFail)));
    });
  }

  render() {
    const { intl } = this.props;
    const { qrCodeURI, confirm_key } = this.state;

    return (
      <SimpleForm>
        <div className='security-settings-panel'>

          <fieldset disabled={false}>
            <FieldsGroup>
              <div className='security-settings-panel__section-container'>
                <h2><FormattedMessage id='mfa.mfa_setup_scan_title' defaultMessage='Scan' /></h2>

                <div><FormattedMessage id='mfa.mfa_setup_scan_description' defaultMessage='Using your two-factor app, scan this QR code or enter text key:' /></div>

                <span className='security-settings-panel qr-code'>
                  <QRCode value={qrCodeURI} />
                </span>

                <div className='security-settings-panel confirm-key'><FormattedMessage id='mfa.mfa_setup_scan_key' defaultMessage='Key:' /> {confirm_key}</div>
              </div>

              <div className='security-settings-panel__section-container'>
                <h2><FormattedMessage id='mfa.mfa_setup_verify_title' defaultMessage='Verify' /></h2>

                <div><FormattedMessage id='mfa.mfa_setup_verify_description' defaultMessage='To enable two-factor authentication, enter the code from your two-factor app:' /></div>
                <TextInput
                  name='code'
                  onChange={this.handleInputChange}
                  autoComplete='off'
                />

                <div><FormattedMessage id='mfa.mfa_setup_enter_password' defaultMessage='Enter your current password to confirm your identity:' /></div>
                <SimpleInput
                  type='password'
                  name='password'
                  onChange={this.handleInputChange}
                />
              </div>
            </FieldsGroup>
          </fieldset>
          <div className='security-settings-panel__setup-otp__buttons'>
            <Button className='button button-secondary cancel' text={intl.formatMessage(messages.mfa_cancel_button)} onClick={this.handleCancelClick} />
            <Button className='button button-primary setup' text={intl.formatMessage(messages.mfa_setup_confirm_button)} onClick={this.handleOtpConfirmClick} />
          </div>
        </div>
      </SimpleForm>
    );
  }

}
