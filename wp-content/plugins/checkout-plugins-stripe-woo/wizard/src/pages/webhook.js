import React, { useEffect, useState } from 'react';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import Spinner from '@Admin/components/Spinner';
import { useNavigate } from 'react-router-dom';
import { useStateValue } from '../Store/StateProvider';

function Webhooks( props ) {
	const [ {}, dispatch ] = useStateValue();
	const [ clicked, setClicked ] = useState( false );
	const [ isOpen, setIsOpen ] = useState( false );
	const [ webhookError, setWebhookError ] = useState( null );
	const [ selectedMode, setSelectedMode ] = useState( onboarding_vars.get_payment_mode );

	const navigate = useNavigate();

	// Function for open and close the popup.
	const togglePopup = () => {
		setIsOpen( ! isOpen );
	};

	// Function call for creating webhook.
	const enableWebhooks = () => {
		// Changing global status state to prevent user from redirecting to next step.
		dispatch( { type: 'PROCESSING' } );

		const formData = new window.FormData();

		formData.append(
			'action',
			'cpsw_onboarding_enable_webhooks',
		);

		// Set webhook error state null to hide the existing error message.
		setWebhookError( null );
		setClicked( true );

		formData.append( 'cpsw_mode', selectedMode );
		formData.append(
			'security',
			onboarding_vars.cpsw_onboarding_enable_webhooks,
		);

		// Ajax call for creating webhook.
		apiFetch( {
			url: onboarding_vars.ajax_url,
			method: 'POST',
			body: formData,
		} ).then( ( res ) => {
			dispatch( { type: 'RESET' } );

			// Handling api response.
			if ( res.success ) {
				dispatch( {
					type: 'UPDATE_STEP',
					step: 1,
					completed: true,
				} );

				// Navigate to next step.
				navigate(
					onboarding_vars.navigator_base + `&cpsw_call=success`,
				);
			} else {
				// Show error message on popup.
				setWebhookError( res?.data?.message );
				setClicked( false );
			}
		} );
	};

	// Function to handle Copy webhook url
	const handleCopy = () => {
		const webhookUrl = document.getElementById( 'cpsw-webhook-url' ).value;
		if ( typeof navigator !== 'undefined' && navigator?.clipboard ) {
			navigator?.clipboard.writeText( webhookUrl ).catch( ( err ) => {
				console.error( 'Failed to copy: ', err ); // eslint-disable-line no-console
			} );
		}
	};

	// changing global status state on page load since it is in blocked state on previous step.
	useEffect( () => {
		dispatch( {
			type: 'RESET',
		} );

		dispatch( {
			type: 'UPDATE_STEP',
			step: 0,
			completed: true,
		} );
	}, [ props.isSyncDone ] );

	return (
		<main className="pb-28 mt-24 mx-auto md:w-7/12 sm:w-10/12 w-full px-4 sm:px-6 lg:mt-32 lg:px-8 flex-1">
			<div className="text-center max-w-[681px] m-auto">
				<span className="text-sm font-medium text-primary-100 text-center block tracking-[.24em] uppercase">
					{ __( 'Step 2 of 5', 'checkout-plugins-stripe-woo' ) }
				</span>
				<h1 className="mt-8 lg:mt-10 text-2xl font-semibold text-[#020617] sm:text-3xl md:text-4xl">
					{ __( 'Let’s create a webhook', 'checkout-plugins-stripe-woo' ) }
				</h1>
				<p
					className="mt-6 text-base justify-center text-primary-200 sm:mt-5 sm:w-full sm:mx-auto md:mt-5 lg:mx-0"
				>
					{ __(
						'The webhook URL is called by Stripe, when events occur in your account, like a source becomes chargeable.',
						'checkout-plugins-stripe-woo',
					) }
				</p>

				<div className="sm:inline-block lg:inline-block sm:justify-center lg:justify-center mt-8">
					<div className="rounded-md shadow">
						{ clicked ? (
							<button className="disabled w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-wait">
								{ __( 'Creating Webhook…', 'checkout-plugins-stripe-woo' ) }
								<Spinner />
							</button>
						) : (
							<button onClick={ togglePopup } className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-pointer">
								{ __( 'Create Webhook', 'checkout-plugins-stripe-woo' ) }
							</button> )
						}
					</div>

					<div className="mt-8">
						<a href={ onboarding_vars.base_url + `&cpsw_call=success` } className="w-full text-center text-base font-normal text-primary-mutedtext ">
							{ __( 'Skip this step', 'checkout-plugins-stripe-woo' ) }
						</a>
					</div>
				</div>
			</div>
			{ isOpen && (
				<div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-20">
					<div className="bg-white rounded-lg shadow-lg p-8 m-4 max-h-full text-center lg:w-[38%] md:w-8/12 w-11/12 relative">
						<button
							type="button"
							className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 absolute right-3 top-3"
							onClick={ () => setIsOpen( false ) }
						>
							<svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
								<path d="M24 8L8 24" stroke="#374151" strokeLinecap="round" strokeLinejoin="round" />
								<path d="M8 8L24 24" stroke="#374151" strokeLinecap="round" strokeLinejoin="round" />
							</svg>
						</button>
						<h2 className="mb-5 text-lg font-semibold text-[#020617] text-left">
							{ __( 'Enable webhook', 'checkout-plugins-stripe-woo' ) }
						</h2>
						<div className="mb-5 text-left">
							<label className=" text-gray-700 font-medium text-sm mb-1 block" htmlFor="cpsw-webhook-url">{ __( 'Webhook URL', 'checkout-plugins-stripe-woo' ) }</label>
							<div className="flex border border-[#CBD5E1] rounded-lg px-[14px] ">
								<input id="cpsw-webhook-url" type="text" className="flex-grow py-[10px] !bg-transparent !border-0 !border-r focus:!bottom-0 focus:!shadow-none border-[#CBD5E1]" value={ onboarding_vars.webhook_url } readOnly />
								<button
									className=" pl-4 py-[10px] rounded-r-md"
									onClick={ handleCopy }
								>
									<svg className="h-5 w-5 text-primary-foregroundBody" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <rect x="8" y="8" width="12" height="12" rx="2" />  <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2" /></svg>
								</button>
							</div>
						</div>
						<div className="mb-8 text-left">
							<label className=" text-gray-700 font-medium text-sm mb-1 block" htmlFor="mode">{ __( 'Select Mode', 'checkout-plugins-stripe-woo' ) }</label>
							<div className="flex w-full items-center bg-[#F1F5F9] text-black rounded-md p-[5px]">
								<button
									onClick={ () => setSelectedMode( 'test' ) }
									className={ `px-3 py-[6px] rounded-[4px] w-6/12 text-sm font-medium  ${ selectedMode === 'test' ? 'bg-white text-primary-100' : 'bg-transparent text-[#1E293B]' }` }
								>
									{ __( 'Test', 'checkout-plugins-stripe-woo' ) }
								</button>
								<button
									onClick={ () => setSelectedMode( 'live' ) }
									className={ `px-3 py-[6px] rounded-[4px] w-6/12 text-sm font-medium  ${ selectedMode === 'live' ? 'bg-white text-primary-100' : 'bg-transparent text-[#1E293B]' }` }
								>
									{ __( 'Live', 'checkout-plugins-stripe-woo' ) }
								</button>
							</div>
						</div>

						<div className="flex space-x-3">
							<div className="w-6/12">
								<button
									className="w-full flex items-center justify-center px-6 py-3 border border-[#CBD5E1] text-base font-normal rounded-md text-[#1E293B] cursor-pointer"
									onClick={ () => setIsOpen( false ) }
								>
									{ __( 'Cancel', 'checkout-plugins-stripe-woo' ) }
								</button>
							</div>
							<div className="w-6/12">
								{ clicked ? (
									<button className="disabled w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-wait">
										{ __( 'Saving…', 'checkout-plugins-stripe-woo' ) }
										<Spinner />
									</button>
								) : (
									<button onClick={ enableWebhooks } className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-pointer">
										{ __( 'Save', 'checkout-plugins-stripe-woo' ) }
									</button>
								) }
							</div>
						</div>
						{ webhookError && (
							<p className="text-red-600 text-xs mt-4 text-left">
								{ webhookError }
							</p>
						) }
					</div>
				</div>
			) }
		</main>
	);
}

export default Webhooks;
