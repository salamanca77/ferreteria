import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import HomePage from '@Admin/pages/HomePage';
import Success from '@Admin/pages/Success';
import ExpressCheckout from '@Admin/pages/ExpressCheckout';
import Failed from '@Admin/pages/Failed';
import ThankYou from '@Admin/pages/ThankYou';
import WooCommerce from '@Admin/pages/WooCommerce';
import FooterNavigationBar from './components/FooterNavigation';
import Header from './components/Header';
import Webhooks from './pages/Webhook';
import { useStateValue } from './Store/StateProvider';

function Settings() {
	const [ isSyncDone, setSyncDone ] = useState( false );
	const query = new URLSearchParams( useLocation().search );
	const status = query.get( 'cpsw_call' );
	let previousStep = '',
		nextStep = '',
		stepSequence = '';
	const maxSteps = 5;

	let routePage = <p></p>;
	switch ( status ) {
		case 'setup-woocommerce':
			routePage = <WooCommerce />;
			break;
		case 'failed':
			routePage = <Failed />;
			break;
		case 'thank-you':
			routePage = <ThankYou />;
			previousStep = 'express-checkout';
			stepSequence = 4;
			break;
		case 'express-checkout':
			routePage = <ExpressCheckout />;
			previousStep = 'success';
			nextStep = 'thank-you';
			stepSequence = 3;
			break;
		case 'success':
			routePage = <Success />;
			nextStep = 'express-checkout';
			previousStep = 'webhooks';
			stepSequence = 2;
			break;
		case 'webhooks':
			routePage = <Webhooks isSyncDone={ isSyncDone } />;
			nextStep = 'success';
			stepSequence = 1;
			break;
		default:
			routePage = <HomePage />;
			stepSequence = 0;
			break;
	}

	const [ { steps }, dispatch ] = useStateValue();

	useEffect( () => {
		const currentStepFromDb = onboarding_vars.incomplete_step;
		// Check if all steps are initially marked as completed: false.
		const allStepsIncomplete = steps.every( ( step ) => ! step.completed );
		if ( currentStepFromDb && allStepsIncomplete ) {
			const stepId = steps.find( ( step ) => step.title === currentStepFromDb );

			const updatedSteps = steps.map( ( step ) =>
				step.id < stepId.id ? { ...step, completed: true } : step,
			);

			dispatch( {
				type: 'SYNC_STEPS_WITH_DATABASE',
				steps: updatedSteps,
			} );

			setSyncDone( true );
		}
	}, [] );

	return (
		<div className="relative h-full bg-primary-background my-0 rounded-xl">
			<div className="mx-auto overflow-x-hidden">
				<div className="relative z-10 lg:w-full flex-col flex h-full">
					<Header currentStep={ stepSequence } />
					{ routePage }
					<FooterNavigationBar
						previousStep={ previousStep }
						nextStep={ nextStep }
						currentStep={ stepSequence }
						maxSteps={ maxSteps }
					/>
				</div>
			</div>
		</div>
	);
}

export default Settings;
