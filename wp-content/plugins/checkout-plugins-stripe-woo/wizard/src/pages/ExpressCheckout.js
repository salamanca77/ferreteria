import React, { useEffect, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import Spinner from '@Admin/components/Spinner';
import { useNavigate } from 'react-router-dom';
import { useStateValue } from '../Store/StateProvider';

function ExpressCheckout() {
	const [ {}, dispatch ] = useStateValue();
	const [ clicked, setClicked ] = useState( false );
	const [ notificationError, setErrorNotification ] = useState( false );
	const cardPaymentMethodDetails = onboarding_vars.available_gateways?.find( ( value ) => value.id === 'cpsw_stripe' );
	const navigate = useNavigate();

	function enableExpressCheckout() {
		dispatch( { type: 'PROCESSING' } );
		setClicked( true );
		const formData = new window.FormData();

		formData.append(
			'action',
			'cpsw_onboarding_enable_express_checkout',
		);
		formData.append(
			'security',
			onboarding_vars.cpsw_onboarding_enable_express_checkout,
		);

		apiFetch( {
			url: onboarding_vars.ajax_url,
			method: 'POST',
			body: formData,
		} ).then( ( res ) => {
			dispatch( { type: 'RESET' } );
			if ( res.success ) {
				dispatch( {
					type: 'UPDATE_STEP',
					step: 3,
					completed: true,
				} );
				navigate(
					onboarding_vars.navigator_base + `&cpsw_call=thank-you`,
				);
			}
		} );
	}

	const navigateToPrevStep = () => navigate( onboarding_vars?.navigator_base + `&cpsw_call=success` );

	useEffect( () => {
		if ( ! cardPaymentMethodDetails.enabled ) {
			setErrorNotification( true );
		}
	}, [] );

	return (
		<main className={ `pb-28 mt-24 mx-auto md:w-7/12 sm:w-10/12 w-full px-4 sm:px-6 lg:mt-32 lg:px-8 flex-1 ${ notificationError && 'pt-12' }` }>
			<div className="text-center">
				<span className="text-sm font-medium text-primary-100 text-center block tracking-[.24em] uppercase">
					{ __( 'Step 4 of 5', 'checkout-plugins-stripe-woo' ) }
				</span>
				<h1 className="mt-8 lg:mt-10 text-2xl font-semibold text-[#020617] sm:text-3xl md:text-4xl">
					{ __( 'One Last Step', 'checkout-plugins-stripe-woo' ) }
				</h1>
				<p
					className="mt-6 text-base justify-center text-primary-200 sm:mt-5 sm:w-full sm:mx-auto md:mt-5 lg:mx-0"
					dangerouslySetInnerHTML={ {
						__html: sprintf(
							// Translators: This message recommends activating Express Checkout and Stripe Card Processing for better conversions.
							__(
								'For better conversions, we recommend activating %1$sExpress Checkout%2$s along with your new %1$sStripe Card Processing.%2$s',
								'checkout-plugins-stripe-woo',
							),
							'<span class=" inline font-bold">',
							'</span>',
						),
					} }
				/>

				<div className="flex justify-center items-center gap-8 mx-auto mt-4">
					<img className="my-3 h-7" src={ onboarding_vars.assets_url + 'images/apple-pay.svg' } alt="Apple pay" />
					<img className="my-3 h-7" src={ onboarding_vars.assets_url + 'images/gpay.svg' } alt="Google pay" />
				</div>
				<div className="sm:inline-block lg:inline-block sm:justify-center lg:justify-center mt-8">
					<div className="rounded-md shadow">
						{ clicked ? (
							<button className="disabled w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-wait">
								{ __( 'Activating…', 'checkout-plugins-stripe-woo' ) }
								<Spinner />
							</button>
						) : (
							<button onClick={ enableExpressCheckout } className={ `${ notificationError && ' disabled pointer-events-none hover:bg-primary-100 cursor-default opacity-50 ' } w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-pointer` }>
								{ __( 'Activate Express Checkout', 'checkout-plugins-stripe-woo' ) }
							</button> )
						}
					</div>

					<div className="mt-8">
						<a href={ onboarding_vars.base_url + `&cpsw_call=thank-you` } className="w-full text-center text-base font-normal text-primary-mutedtext">
							{ __( 'Skip this step', 'checkout-plugins-stripe-woo' ) }
						</a>
					</div>
				</div>
			</div>

			{ notificationError ? (
				<div className="bg-cart-50 p-4 fixed left-0 top-0 right-0 transition ease-in-out delay-150 mt-16">
					<div className="block">
						<div className="text-center justify-center">
							<p className="text-sm mx-auto w-full text-primary-100 text-center">
								{ __( 'To enable this feature, the Stripe Card Processing payment method must be enabled.', 'checkout-plugins-stripe-woo' ) }
								<span onClick={ navigateToPrevStep } className="font-medium cursor-pointer">
									{ __( ' Please enable it from the previous tab.', 'checkout-plugins-stripe-woo' ) }
								</span>
							</p>
						</div>
					</div>
				</div>
			) : ( '' ) }

		</main>
	);
}

export default ExpressCheckout;
