import React from 'react';
import { __ } from '@wordpress/i18n';
import { useStateValue } from '../Store/StateProvider';
import { useNavigate } from 'react-router-dom';

function FooterNavigationBar( props ) {
	const { previousStep, nextStep, currentStep, maxSteps } = props;
	const [ { settingsProcess } ] = useStateValue();
	const navigate = useNavigate();
	const paginationClass = 'relative z-10 inline-flex items-center rounded-full p-1 text-sm font-semibold text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500';

	const handlePreviousStep = function( e ) {
		e.preventDefault();
		navigate( onboarding_vars.navigator_base + `&cpsw_call=` + previousStep );
	};

	const handleNextStep = function( e ) {
		e.preventDefault();
		navigate( onboarding_vars.navigator_base + `&cpsw_call=` + nextStep );
	};

	// Check if currentStep exists and return null if it doesn't
	if ( currentStep === '' ) {
		return null;
	}

	return (
		<>
			<footer className="cpsw-setup-footer w-full fixed inset-x-0 bottom-0 h-[70px] z-10 bg-primary-background">
				<div className="flex items-center justify-between sm:w-max gap-8 mx-auto px-7 py-4 h-full">
					<div className="cpsw-footer-left-section flex">
						<div
							className={ `flex-shrink-0 flex text-sm font-normal cursor-pointer ${
								'' === previousStep
									? 'text-primary-mutedtext pointer-events-none'
									: 'text-primary-foregroundBody hover:text-primary-100'
							}` }
							onClick={ handlePreviousStep }
						>
							<button type="button">
								{ __( 'Back', 'checkout-plugins-stripe-woo' ) }
							</button>
						</div>
					</div>

					<div className="cpsw-footer--pagination hidden md:-mt-px md:flex gap-3">
						{ Array( maxSteps )
							.fill()
							.map( ( i, index ) => {
								return (
									<span
										key={ index }
										className={ `cpsw-footer-pagination--tab ${ paginationClass } ${
											currentStep === index
												? 'bg-primary-100'
												: 'bg-primary-foreground'
										}` }
									></span>
								);
							} ) }
					</div>

					<div className="cpsw-footer-right-section flex">
						<button
							onClick={ handleNextStep }
							className={ `flex-shrink-0 flex text-sm font-normal cursor-pointer ${
								'' === nextStep || 'processing' === settingsProcess || 'blocked' === settingsProcess
									? 'disabled pointer-events-none text-primary-mutedtext'
									: 'hover:text-primary-100 text-primary-foregroundBody '
							}` }
						>
							{ __( 'Next', 'checkout-plugins-stripe-woo' ) }
						</button>
					</div>
				</div>
			</footer>
		</>
	);
}
export default FooterNavigationBar;
