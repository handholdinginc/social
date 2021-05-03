import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';
import RegistrationForm from './components/registration_form';
import SiteBanner from '../public_layout/components/site_banner';

const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
});

class LandingPage extends ImmutablePureComponent {

  render() {
    const { instance } = this.props;

    return (
      <div className='landing'>
        <div className='landing-columns'>
          <RegistrationForm />
        </div>
      </div>
    );
  }

}

export default connect(mapStateToProps)(LandingPage);
