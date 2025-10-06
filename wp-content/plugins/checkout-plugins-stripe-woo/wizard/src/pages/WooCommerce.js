import React, { useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import Spinner from '@Admin/components/Spinner';

function WooCommerce() {
	if ( '' !== onboarding_vars.woocommerce_installed && '' !== onboarding_vars.woocommerce_activated ) {
		window.location.href = onboarding_vars.navigator_base;
	}

	const [ state, setState ] = useState( '' );
	const [ notification, setNotification ] = useState( false );
	const [ notificationError, setErrorNotification ] = useState( false );

	function installWooCommerce() {
		if ( '' === onboarding_vars.woocommerce_installed ) {
			setState( 'installing' );
			setTimeout( () => {
				setNotification( true );
			}, 10000 );
			wp.updates.queue.push( {
				action: 'install-plugin', // Required action.
				data: {
					slug: 'woocommerce',
				},
			} );

			// Required to set queue.
			wp.updates.queueChecker();
		} else {
			setState( 'activating' );
			const formData = new window.FormData();

			formData.append(
				'action',
				'cpsw_onboarding_install_woocommerce',
			);
			formData.append(
				'security',
				onboarding_vars.cpsw_onboarding_install_woocommerce,
			);

			apiFetch( {
				url: onboarding_vars.ajax_url,
				method: 'POST',
				body: formData,
			} ).then( ( res ) => {
				if ( res.success ) {
					window.location.href = onboarding_vars.onboarding_base;
				} else {
					setErrorNotification( true );
				}
			} );
		}
	}

	return (
		<main className={ `mt-24 mx-auto max-w-7xl px-4 sm:px-6 lg:mt-32 lg:px-8 ${ ( notification || notificationError ) && 'pt-12' }` }>
			<div className="text-center">
				<img className="m-auto mb-10" src={ onboarding_vars.assets_url + 'images/cpsw-woo-warning.svg' } alt="Express Checkout" />
				<h1 className="text-2xl font-semibold text-[#020617] sm:text-3xl md:text-4xl">
					{ '' === onboarding_vars.woocommerce_installed ? __( 'Missing ', 'checkout-plugins-stripe-woo' ) : __( 'Inactive ', 'checkout-plugins-stripe-woo' ) }
					{ __( 'WooCommerce', 'checkout-plugins-stripe-woo' ) }
				</h1>
				<p
					className="mt-6 text-base justify-center text-[#475569] sm:mt-5 sm:w-full sm:mx-auto md:mt-5 lg:mx-0"
				>
					{ __(
						'Checkout Plugins - Stripe for WooCommerce needs WooCommerce to be active on your store.',
						'checkout-plugins-stripe-woo',
					)
					}
				</p>
				<div className="mt-5 sm:mt-10 sm:flex justify-center">
					<div className="rounded-md shadow">
						{ ( () => {
							if ( 'installing' === state ) {
								return (
									<button className="disabled w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700  cursor-wait">
										{ __( 'Installing…', 'checkout-plugins-stripe-woo' ) }
										<Spinner />
									</button>
								);
							} else if ( 'activating' === state ) {
								return (
									<button className="disabled w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700  cursor-wait">
										{ __( 'Activating, just a moment…', 'checkout-plugins-stripe-woo' ) }
										<Spinner />
									</button>
								);
							}
							return (
								<button onClick={ installWooCommerce } className="install-dependency w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-pointer">
									{ '' === onboarding_vars.woocommerce_installed ? __( 'Install and continue', 'checkout-plugins-stripe-woo' ) : __( 'Activate and Proceed', 'checkout-plugins-stripe-woo' ) }
								</button>
							);
						} )() }
					</div>
				</div>
			</div>
			{ notification ? (
				<div className="bg-cart-50 p-4 fixed left-0 top-0 right-0 transition ease-in-out delay-150 mt-16">
					<div className="block">
						<div className="text-center justify-center">
							<p className="text-sm mx-auto w-full text-primary-100 text-center">{ __( 'Installing WooCommerce will take time. Please be patient.', 'checkout-plugins-stripe-woo' ) }</p>
						</div>
					</div>
				</div>
			) : ( '' ) }

			{ notificationError ? (
				<div className="bg-cart-50 p-4 fixed left-0 top-0 right-0 transition ease-in-out delay-150 mt-16">
					<div className="block">
						<div className="text-center justify-center">
							<p className="text-sm mx-auto w-full text-primary-100 text-center">{ __( 'WooCommerce installing failed. Please try again.', 'checkout-plugins-stripe-woo' ) }</p>
						</div>
					</div>
				</div>
			) : ( '' ) }

		</main>
	);
}

export default WooCommerce;
