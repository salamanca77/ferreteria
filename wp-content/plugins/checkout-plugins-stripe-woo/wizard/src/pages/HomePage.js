import React, { useEffect, useState } from 'react';
import { __ } from '@wordpress/i18n';
import Spinner from '@Admin/components/Spinner';
import { useNavigate } from 'react-router-dom';
import { useStateValue } from '../Store/StateProvider';

function HomePage() {
	const [ clicked, setClicked ] = useState( false );
	const [ {}, dispatch ] = useStateValue();
	const navigate = useNavigate();

	function connectWithStripe() {
		setClicked( true );
		if ( '' === onboarding_vars.woocommerce_installed || '' === onboarding_vars.woocommerce_activated ) {
			navigate( onboarding_vars.navigator_base + '&cpsw_call=setup-woocommerce' );
		} else {
			window.location.href = onboarding_vars.authorization_url;
		}
	}

	useEffect( () => {
		dispatch( {
			type: 'BLOCKED',
		} );
	}, [] );

	return (
		<main className="pb-28 mb-[70px] mt-24 mx-auto md:w-7/12 sm:w-10/12 w-full px-4 sm:px-6 lg:mt-32 lg:px-8 flex-1">
			<div className="text-center">
				<span className="text-sm font-medium text-primary-100 text-center block tracking-[.24em] uppercase">
					{ __( 'Step 1 of 5', 'checkout-plugins-stripe-woo' ) }
				</span>
				<h1 className=" mt-8 lg:mt-10 text-2xl font-semibold text-[#020617] sm:text-3xl md:text-4xl">
					{ __( 'Let\'s Connect with Stripe!', 'checkout-plugins-stripe-woo' ) }
				</h1>
				<p
					className="mt-6 text-base justify-center text-[#475569] sm:mt-5 sm:text-base sm:w-full sm:mx-auto md:mt-5 lg:mx-0"
				>
					{
						__(
							'Checkout Plugins highly recommends using Stripe Connect, one-click onboarding solution offered by Stripe.',
							'checkout-plugins-stripe-woo',
						)
					}
				</p>
				<div className="mt-5 sm:mt-10 sm:inline-block lg:inline-block sm:justify-center lg:justify-center">
					<div className="rounded-md shadow">

						{ clicked ? (
							<button className="disabled w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-wait">
								{ __( 'Connecting…', 'checkout-plugins-stripe-woo' ) }
								<Spinner />
							</button>
						) : (
							<button onClick={ connectWithStripe } className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-pointer">
								{ __( 'Connect with Stripe', 'checkout-plugins-stripe-woo' ) }
							</button> )
						}
					</div>
				</div>
			</div>
		</main>
	);
}

export default HomePage;
