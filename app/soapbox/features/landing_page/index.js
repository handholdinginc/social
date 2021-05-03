import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';
import RegistrationForm from './components/registration_form';
import SiteBanner from '../public_layout/components/site_banner';

import Header from './components/header';
import Footer from './components/footer';


const mapStateToProps = (state, props) => ({
  instance: state.get('instance'),
});

class LandingPage extends ImmutablePureComponent {

  render() {
    const { instance } = this.props;

    return (
        <div className='public-layout'>
            <div className='public-layout__top'>
                <Header />
                <div className='landing'>
                    <div className='landing-columns'>
                        <div className='landing-columns--left'>
                            <div className='landing__brand'>
                                <Link className='brand' to='/'>
                                    <SiteBanner />
                                </Link>
                                <div className='brand__tagline'>
                                    <span>{instance.get('description')}</span>
                                </div>
                            </div>
                        </div>
                        <div className='landing-columns--right'>
                            <RegistrationForm />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
  }

}

export default connect(mapStateToProps)(LandingPage);
