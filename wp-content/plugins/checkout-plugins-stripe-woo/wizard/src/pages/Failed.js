import React from 'react';
import { __ } from '@wordpress/i18n';

function Failed() {
	return (
		<main className="pb-28 mt-24 mx-auto md:w-7/12 w-full px-4 sm:px-6 lg:mt-32 lg:px-8 flex-1">
			<div className="text-center">
				<img
					className="block h-16 w-16 text-center mx-auto"
					src={ onboarding_vars.assets_url + 'images/failed.svg' }
					alt="connection Failed"
				/>
				<h1 className="mt-10 text-2xl font-semibold text-[#020617] sm:text-3xl md:text-4xl">
					{ __( 'Connection not Created', 'checkout-plugins-stripe-woo' ) }
				</h1>
				<p
					className="mt-6 text-base justify-center text-primary-200 sm:mt-5 sm:w-full sm:mx-auto md:mt-5 lg:mx-0"
				>
					{ __(
						'There was an error while connection with Stripe.',
						'checkout-plugins-stripe-woo',
					)
					}
				</p>
			</div>
			<div className="w-max text-center mt-8 mx-auto">
				<div className="rounded-md shadow">
					<a href={ onboarding_vars.authorization_url } className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-pointer">
						{ __( 'Please Try Again.', 'checkout-plugins-stripe-woo' ) }
					</a>
				</div>

				<div className="mt-4">
					<a href={ onboarding_vars.manual_connect_url } className="w-full text-center text-base font-normal text-primary-mutedtext">
						{ __( 'Manage API keys manually', 'checkout-plugins-stripe-woo' ) }
					</a>
				</div>
			</div>
		</main>
	);
}

export default Failed;
