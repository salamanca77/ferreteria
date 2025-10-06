import React from 'react';
import { __ } from '@wordpress/i18n';
import { Disclosure } from '@headlessui/react';
import { useNavigate } from 'react-router-dom';
import { useStateValue } from '../Store/StateProvider';
import { updateStep } from '../utils/Helper';

function Header( props ) {
	const { currentStep } = props;
	const [ { settingsProcess } ] = useStateValue();
	const [ { steps } ] = useStateValue();
	const navigate = useNavigate();

	const menus = [
		{
			name: __( 'Welcome', 'checkout-plugins-stripe-woo' ),
			step: 1,
			link: '',
		},
		{
			name: __( 'Webhook', 'checkout-plugins-stripe-woo' ),
			step: 2,
			link: 'webhooks',
		},
		{
			name: __( 'Connect Gateway', 'checkout-plugins-stripe-woo' ),
			step: 3,
			link: 'success',
		},
		{
			name: __( 'Express Checkout', 'checkout-plugins-stripe-woo' ),
			step: 4,
			link: 'express-checkout',
		},
		{
			name: __( 'Done', 'checkout-plugins-stripe-woo' ),
			step: 5,
			link: 'thank-you',
		},
	];

	const handleClick = ( e ) => {
		e.preventDefault();

		// Function to handle redirection based on WooCommerce status.
		const redirectPageOnExit = () => {
			if ( ! onboarding_vars.woocommerce_installed || ! onboarding_vars.woocommerce_activated ) {
				window.location.href = onboarding_vars.plugins_page_url;
			} else {
				window.location.href = onboarding_vars.settings_url;
			}
		};

		// Check if the current step is empty.
		if ( currentStep === '' ) {
			redirectPageOnExit();
			return; // Exit the function early since there's no step to update.
		}

		// Find the step with the smallest id where completed is false
		const incompleteStep = steps.find( ( step ) => step.completed === false );
		const incompleteStepTitle = incompleteStep ? incompleteStep.title : null;

		// Update the step and handle the response.
		updateStep( incompleteStepTitle )
			.then( ( response ) => {
				if ( response.success ) {
					redirectPageOnExit();
				} else {
					/* eslint-disable no-console*/
					console.log( 'Error:', response.message );
					/* eslint-enable */
				}
			} )
			.catch( ( error ) => {
				/* eslint-disable no-console*/
				console.error( 'Request failed:', error );
				/* eslint-enable */
			} );
	};

	const handleMenuClick = ( step ) => {
		if ( 'processing' === settingsProcess || 'blocked' === settingsProcess || '' === step ) {
			return;
		}
		navigate( onboarding_vars.navigator_base + `&cpsw_call=` + step );
	};

	return (
		<>
			<Disclosure
				as="nav"
				className="bg-white fixed top-0 w-full z-10 border-b border-slate-200"
			>
				{ ( { } ) => (
					<>
						<div className="px-4 sm:px-6 lg:px-8">
							<div className="flex h-16 justify-between">
								<div className="flex">
									<div className="flex flex-shrink-0 items-center">
										{
											currentStep === ''
												? (
													<img
														className="block h-6 w-auto"
														src={ onboarding_vars.assets_url + 'images/menu-logo-2.svg' }
														alt="Checkout plugins"
													/>
												) :				(
													<img
														className="block h-8 w-auto"
														src={ onboarding_vars.assets_url + 'images/menu-logo.svg' }
														alt="Checkout plugins"
													/> )
										}
									</div>
								</div>
								{ currentStep !== '' &&
									<div className="md:flex self-center hidden">
										{ menus.map( ( menu, index ) => {
											const isCompleted = currentStep > menu.step - 1;
											const isActive = currentStep === menu.step - 1;
											const separatorClass = ` ${ isActive ? 'bg-primary-100' : 'bg-[#E2E8F0]' }`;
											const menuClass = ` ${ isActive ? 'text-primary-100' : 'text-primary-mutedtext' }`;
											let iconClass = '';

											if ( isActive ) {
												iconClass = 'bg-primary-100 text-white';
											} else if ( isCompleted ) {
												iconClass = 'bg-primary-mutedtext';
											} else {
												iconClass = 'bg-white border border-primary-mutedtext text-primary-mutedtext';
											}

											// Determine the content for icon.
											const icon = isCompleted ? (
												<svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
												</svg>
											) : (
												menu.step
											);

											return (
												<>
													<div className="flex items-center cursor-pointer" key={ menu.id } onClick={ () => {
														handleMenuClick( menu.link );
													} }>
														<div className={ `w-5 h-5 flex items-center justify-center rounded-full text-xs ${ iconClass }` }>
															{ icon }
														</div>
														<span className={ `ml-2 ${ menuClass }` }>
															{ menu.name }
														</span>
													</div>
													{ index < menus.length - 1 && (
														<div className={ `flex-grow h-px lg:w-9 w-4 items-center lg:mx-4 mx-2 my-auto ${ separatorClass }` }></div>
													) }
												</>
											);
										} ) }
									</div>
								}
								<div className="flex items-center">
									<button
										type="button"
										className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
										onClick={ handleClick }
										title={ __(
											'Exit setup wizard',
											'checkout-plugins-stripe-woo',
										) }
									>
										<svg width="22" height="22" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
											<path d="M24 8L8 24" stroke="#374151" strokeLinecap="round" strokeLinejoin="round" />
											<path d="M8 8L24 24" stroke="#374151" strokeLinecap="round" strokeLinejoin="round" />
										</svg>
									</button>
								</div>
							</div>
						</div>
					</>
				) }
			</Disclosure>
		</>
	);
}
export default Header;
