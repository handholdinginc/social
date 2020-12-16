import React from 'react';
import { connect } from 'react-redux';
import ImmutablePureComponent from 'react-immutable-pure-component';
import { Link } from 'react-router-dom';
import RegistrationForm from './components/registration_form';
import SiteBanner from '../public_layout/components/site_banner';


import './js/script.js';
import AOS from 'aos';
import 'aos/dist/aos.css';

const mapStateToProps = (state, props) => ({
    instance: state.get('instance'),
});

const wave = (
  <svg className='wave' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 880' width='1440px' height='880px' preserveAspectRatio='none' transform="scale (1, -1.005)">
    <path d='M 0 0 L 0 851.82031 C 115.03104 776.54213 236.097 723.10606 363.20703 691.54492 C 640.06491 622.80164 852.93698 468.14039 954.31055 358.01367 C 1092.1151 208.31032 1206.0509 47.69868 1365.3828 13.457031 C 1391.8162 7.7762737 1416.6827 3.2957237 1440 0.001953125 L 1440 0 L 0 0 z' fill='var(--background-color)' />
  </svg>
);


class HandholdingLandingPage extends ImmutablePureComponent {

    render() {
        const { instance } = this.props;
        AOS.init();

        return (
            <div className='landing'>
		<header className="pt-195 pb-110 header_1">
                    {wave}
		    <div className="container px-xl-0">
			<div className="row justify-content-center justify-content-md-between align-items-center">
			    <div className="col-md-7 col-xl-6">
				<h2 className="small col-lg-11 color-main" data-aos="fade-down" data-aos-delay="0">
				    Streaming, with a social touch
				</h2>
				<div className="mt-25 col-lg-9 color-heading f-18 text-adaptive" data-aos="fade-down" data-aos-delay="0">
				    Join 25,000+ streamers and microbloggers in the fastest-growing social media streaming community. Stream your favorite content to your friends, in a chat where you can use custom emoji, and find a home in your new microblogging community.
                                    <div/>
				    <a href="/signup" className="btn mt-60 lg action-1 px-xl-4" data-aos="fade-down" data-aos-delay="250">
				        Join Now
				    </a>

				</div>
			    </div>
			    <div className="mb-15 mb-md-0 col-12 col-md-5 col-xl-6 d-flex justify-content-center">
				<img src="instance/hhs-phone.png" className="img-fluid application_2_left_img hshadow" data-aos="fade-down" data-aos-delay="500"/>
			    </div>
			</div>
		    </div>
		</header>

		<section className="pt-105 pb-45 bg-hlight text-center feature_2">
		    <div className="container px-xl-0">
			<div className="row justify-content-center">
			    <div className="col-xl-8 col-lg-10">
				<h2 className="small color-main" data-aos="fade-down" data-aos-delay="0">
				    Your Personal Stream
				</h2>
				<div className="mt-35 mb-65 f-22 color-heading text-adaptive description" data-aos="fade-down" data-aos-delay="250">
Stream your content to your audience, using your own custom emoji and a secure streaming key. Grow your followers on your personal microblog, and stream to them on the streaming service. With Handholding Social, you're in control.
				    </div>
			            </div>
	                            </div>
			    <img src="instance/hhs-streaming.png" alt="" className="img-fluid application_2_left_img" data-aos="fade-down" data-aos-delay="500"/>	                            </div>
	    </section>


	    <section className="pt-100 pb-100 bg-hlight ecommerce_1">
		<div className="container px-xl-0">
		    <div className="row justify-content-center text-center">
			<div className="col-xl-8 col-lg-10">
			    <h2 className="color-main f-32" data-aos="fade-down" data-aos-delay="0">
				Powerful content curation at your fingertips
			    </h2>
			    <div className="mt-35 mb-65 f-22 color-heading text-adaptive description" data-aos="fade-down" data-aos-delay="250">
				With powerful, customizable filters and blocks, show only the content you want to see, when you want to see it.
			    </div>
			</div>
		    </div>

		    <div className="row justify-content-center justify-content-md-between align-items-center">
			<div className="mb-15 mb-md-0 col-12 col-md-5 col-xl-6 d-flex justify-content-center">
			    <img src="instance/hhs-filters.png" alt="" className="img-fluid application_2_left_img hshadow" data-aos="fade-down" data-aos-delay="500"/>
			</div>
			<div className="col-md-7 col-xl-6">
			    <h2 className="col-lg-11 color-main" data-aos="fade-down" data-aos-delay="0">
				Integrated content warnings
			    </h2>
			    <div className="mt-25 col-lg-9 color-heading f-14 text-adaptive" data-aos="fade-down" data-aos-delay="0">
				With native level support for content warnings, users can choose to expand or hide content as they see fit. Don't feel like reading about politics? Click hide on the post with a politics content warning. It's that simple.
			    </div>
                            <br/>
			    <h2 className="col-lg-11 color-main" data-aos="fade-down" data-aos-delay="0">
				Keyword-level filters
			    </h2>
			    <div className="mt-25 col-lg-9 color-heading f-14 text-adaptive" data-aos="fade-down" data-aos-delay="0">
				Choose to filter out whatever content you want at a keyword level. Hide posts mentioning politics, cats, dogs, or whatever you choose.
			    </div>
                            <br/>
			    <h2 className="col-lg-11 color-main" data-aos="fade-down" data-aos-delay="0">
				Power User Regular Expression support
			    </h2>
			    <div className="mt-25 col-lg-9 color-heading f-14 text-adaptive" data-aos="fade-down" data-aos-delay="0">
				Set up your filters and blocks to be done in detail, with our regex power user feature, capturing any number of complex queries and filters. With Handholding Social, all this is at your fingertips.
			    </div>
			</div>
		    </div>
		</div>
            </section>
	    <section className="pt-100 pb-100 bg-hlight ecommerce_1">
		<div className="container px-xl-0">
		    <div className="row justify-content-center justify-content-md-between align-items-center">


			<div className="col-md-7 col-xl-6">
			    <h2 className="col-lg-11 color-main f-22" data-aos="fade-down" data-aos-delay="0">
				Secure Chat
			    </h2>
			    <div className="mt-25 col-lg-9 color-heading f-18 text-adaptive" data-aos="fade-down" data-aos-delay="0">
                                Direct messages and secure chats are available to all of our users. Choose between scoped microblogging (where only your followers can see the posts), Direct Messages, and Secure Chat to fit your own needs.
			    </div>
			</div>

			<div className="mb-15 mb-md-0 col-12 col-md-5 col-xl-6 d-flex justify-content-center">
			    <img src="instance/hhs-chats.png" alt="" className="img-fluid application_2_left_img hshadow" data-aos="fade-down" data-aos-delay="500"/>
			</div>

		    </div>
		</div>
            </section>
	    <section className="pt-100 pb-100 bg-hlight ecommerce_1">
		<div className="container px-xl-0">
		    <div className="row justify-content-center justify-content-md-between align-items-center">

			<div className="mb-15 mb-md-0 col-12 col-md-5 col-xl-6 d-flex justify-content-center">
			    <img src="instance/handholding-logo.png"  alt="" className="img-fluid application_2_left_img" data-aos="fade-down" data-aos-delay="500"/>
			</div>

			<div className="col-md-7 col-xl-6">
			    <h2 className="col-lg-11 color-main f-22" data-aos="fade-down" data-aos-delay="0">
				Ad-Free
			    </h2>
			    <div className="mt-25 col-lg-9 color-heading f-18 text-adaptive" data-aos="fade-down" data-aos-delay="0">
				Join a social media network where you aren't a commodity to be traded. We run no ads, have no promoted content, and do not sell your data. Why settle for less?
                                <div/>
                                <a href="/signup" className="btn mt-60 lg action-1 px-xl-4" data-aos="fade-down" data-aos-delay="250">
				    Join Now
				</a>

			    </div>
			</div>
		    </div>
		</div>
            </section>

            <link href="instance/style.css" rel="stylesheet" />
            <link href="instance/bootstrap.min.css" rel="stylesheet" />
            <link href="instance/jquery.fancybox.min.css" rel="stylesheet" />

            </div>
        );
    }

}

export default connect(mapStateToProps)(HandholdingLandingPage);
