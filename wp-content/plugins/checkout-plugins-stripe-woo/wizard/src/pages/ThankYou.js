import React, { useState } from 'react';
import { __ } from '@wordpress/i18n';
import Spinner from '@Admin/components/Spinner';
import { updateStep } from '../utils/Helper';
import { useStateValue } from '../Store/StateProvider';

function ThankYou() {
	const [ clicked, setClicked ] = useState( false );
	const [ { steps }, dispatch ] = useStateValue();

	function letsCustomize() {
		setClicked( true );

		dispatch( {
			type: 'UPDATE_STEP',
			step: 4,
			completed: true,
		} );

		/// Find the step with the smallest id where completed is false
		const incompleteStep = steps.find( ( step ) => step.completed === false );
		const incompleteStepTitle = incompleteStep ? incompleteStep.title : null;
		const areAllStepsCompleted = steps.every( ( step ) => {
			if ( step.title === 'thank-you' ) {
				return true;
			}
			return step.completed;
		} );

		// Update the step and handle the response.
		updateStep( incompleteStepTitle, areAllStepsCompleted )
			.then( ( response ) => {
				if ( response.success ) {
					window.location.href = onboarding_vars.get_element === 'payment' ? onboarding_vars.settings_url : onboarding_vars.gateways_url;
				} else {
					/* eslint-disable no-console */
					console.log( 'Error:', response.message );
					/* eslint-enable */
				}
			} )
			.catch( ( error ) => {
				/* eslint-disable no-console */
				console.error( 'Request failed:', error );
				/* eslint-enable */
			} );
	}

	return (
		<main className="pb-28 mt-24 mx-auto md:w-7/12 w-full px-4 sm:px-6 lg:mt-32 lg:px-8 flex-1">
			<div className="text-center">
				<span className="text-sm font-medium text-primary-100 text-center block tracking-[.24em] uppercase">
					{ __( 'Step 5 of 5', 'checkout-plugins-stripe-woo' ) }
				</span>
				<h1 className="mt-8 lg:mt-10 text-2xl font-semibold text-[#020617] sm:text-3xl md:text-4xl">
					{ __( 'Congratulations. You did it!', 'checkout-plugins-stripe-woo' ) }
				</h1>
				<p
					className="mt-6 text-base justify-center text-primary-200 sm:mt-5 sm:w-full sm:mx-auto md:mt-5 lg:mx-0"
				>
					{
						__(
							'Your store is all set to accept payments. We provide lots of customization options to match your needs, don\'t forget to explore them.',
							'checkout-plugins-stripe-woo',
						)
					}
				</p>

				<iframe
					className="mx-auto mt-10 max-w-[645px] max-h-[400px] w-full h-full"
					src="https://www.youtube.com/embed/CeI5cWJbhvA?si=YhArffU8txBm1jCd?showinfo=0&autoplay=0&mute=0&rel=0&privacy=1"
					title={ __(
						'Easy Express Checkout',
						'checkout-plugins-stripe-woo',
					) }
					allowFullScreen
				></iframe>

				<div className="mt-5 sm:mt-10 sm:inline-block lg:inline-block sm:justify-center lg:justify-center">
					<div className="rounded-md shadow">
						{ clicked ? (
							<button className="disabled w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-wait">
								{ __( 'Finishing setup…', 'checkout-plugins-stripe-woo' ) }
								<Spinner />
							</button>
						) : (
							<button onClick={ letsCustomize } className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-pointer">
								{ __( 'Finish Setup', 'checkout-plugins-stripe-woo' ) }
							</button> )
						}
					</div>
				</div>
			</div>
		</main>
	);
}

export default ThankYou;
