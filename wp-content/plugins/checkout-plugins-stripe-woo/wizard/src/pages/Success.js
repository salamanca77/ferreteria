import { useState } from 'react';
import { Switch } from '@headlessui/react';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import Spinner from '@Admin/components/Spinner';
import { useNavigate } from 'react-router-dom';
import { useStateValue } from '../Store/StateProvider';

function classNames( ...classes ) {
	return classes.filter( Boolean ).join( ' ' );
}

function Success() {
	const [ {}, dispatch ] = useStateValue();
	const [ clicked, setClicked ] = useState( false );
	const [ gateways, setGateways ] = useState( onboarding_vars.available_gateways );
	const navigate = useNavigate();

	function enableGateways( e ) {
		e.preventDefault();
		dispatch( { type: 'PROCESSING' } );
		setClicked( true );
		const formData = new window.FormData();

		const object = {};
		gateways.forEach( function( value ) {
			object[ value.id ] = document.getElementsByName( value.id )[ 0 ]?.value;
		} );
		const json = JSON.stringify( object );

		formData.append( 'formdata', json );
		formData.append(
			'action',
			'cpsw_onboarding_enable_gateway',
		);
		formData.append(
			'security',
			onboarding_vars.cpsw_onboarding_enable_gateway,
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
					step: 2,
					completed: true,
				} );

				navigate( onboarding_vars.navigator_base + `&cpsw_call=express-checkout` );
			}
		} );
	}

	return (
		<main className="pb-28 mt-24 mx-auto md:w-7/12 sm:w-10/12 w-full px-4 sm:px-6 lg:mt-32 lg:px-8 flex-1">
			<div className="text-center">
				<span className="text-sm font-medium text-primary-100 text-center block tracking-[.24em] uppercase">
					{ __( 'Step 3 of 5', 'checkout-plugins-stripe-woo' ) }
				</span>
				<h1 className="mt-8 lg:mt-10 text-2xl font-semibold text-[#020617] sm:text-3xl md:text-4xl">
					<span className="flex justify-center items-center">
						{ __( 'Congratulations!', 'checkout-plugins-stripe-woo' ) }
					</span>
					{ __( 'You have successfully connected to Stripe.', 'checkout-plugins-stripe-woo' ) }
				</h1>
				<p
					className="mt-6 text-base justify-center text-primary-200 sm:mt-5 sm:w-full sm:mx-auto md:mt-5 lg:mx-0"
				>
					{ __( 'Let\'s activate the gateways.', 'checkout-plugins-stripe-woo' ) }
				</p>
				<ul role="list" className="overflow-hidden sm:rounded-md mt-10 max-w-screen-md mx-auto">
					{ gateways?.map( ( gateway ) => (
						<li key={ gateway.id }>
							<span href="#" className="block hover:bg-gray-50 bg-white mb-4 border border-[#E2E8F0] shadow-custom-drop rounded-lg">
								<div className="flex items-center px-4 py-4">
									<div className="min-w-0 flex-1 flex items-center">
										<div className="flex-shrink-0">
											<img className="h-8 w-16 max-w-80" src={ gateway.icon } alt={ gateway.name } />
										</div>
										<div className="min-w-0 flex-1 px-4 md:gap-4">
											<div>
												<p className="text-lg font-medium text-primary-cardtitle flex truncate">{ gateway.name } { gateway.recommended ? (
													<span className="h-max self-end ml-2 px-2 py-0 text-[#16A34A] text-xs font-medium bg-[#F0FDF4] rounded-[4px] border border-[#BBF7D0]">
														{ __( 'Recommended', 'checkout-plugins-stripe-woo' ) }
													</span>
												) : ( '' ) }
												</p>
												<p className="text-sm text-primary-mutedtext flex">
													<span className="text-left text-sm" >{ 'all' === gateway.currencies ? ( __( 'Supports all currencies', 'checkout-plugins-stripe-woo' ) ) : ( __( 'Supports ', 'checkout-plugins-stripe-woo' ) + gateway.currencies ) }</span>
												</p>
											</div>
										</div>
									</div>
									<div>
										<Switch
											checked={ gateway.enabled }
											value={ gateway.enabled }
											name={ gateway.id }
											onChange={ () => {
												gateway.enabled = ! gateway.enabled;
												setGateways( [ ...gateways ] );
											} }
											className={ classNames(
												gateway.enabled ? 'bg-cart-500 ' : 'bg-gray-200',
												'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cart-500',
											) }
										>
											<span className="sr-only">{ gateway.id }</span>
											<span
												aria-hidden="true"
												className={ classNames(
													gateway.enabled ? 'translate-x-5' : 'translate-x-0',
													'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
												) }
											/>
										</Switch>
									</div>
								</div>
							</span>
						</li>
					) ) }
				</ul>
				<div className="mt-5 sm:mt-8 sm:inline-block lg:inline-block sm:justify-center lg:justify-center">
					<div className="rounded-md shadow">
						{ clicked ? (
							<button className="disabled w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-wait">
								{ __( 'Activating…', 'checkout-plugins-stripe-woo' ) }
								<Spinner />
							</button>
						) : (
							<button onClick={ enableGateways } className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-normal rounded-md text-white bg-primary-100 hover:bg-cart-700 cursor-pointer">
								{ __( 'Activate Gateways', 'checkout-plugins-stripe-woo' ) }
							</button> )
						}
					</div>
					<div className="mt-8">
						<a href={ onboarding_vars.base_url + `&cpsw_call=express-checkout` } className="w-full text-center text-base font-normal text-primary-mutedtext">
							{ __( 'Skip this step', 'checkout-plugins-stripe-woo' ) }
						</a>
					</div>
				</div>
			</div>
		</main>
	);
}

export default Success;
