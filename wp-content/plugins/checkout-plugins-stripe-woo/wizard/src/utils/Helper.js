import apiFetch from '@wordpress/api-fetch';

export const updateStep = ( step, completed = false ) => {
	const ajaxData = new window.FormData();
	ajaxData.append( 'action', 'cpsw_onboarding_exit' );
	ajaxData.append( 'security', onboarding_vars.cpsw_onboarding_exit );
	ajaxData.append( 'current_step', step );
	ajaxData.append( 'completed', completed ? 'true' : 'false' );

	// Return the promise from apiFetch
	return apiFetch( {
		url: onboarding_vars.ajax_url,
		method: 'POST',
		body: ajaxData,
	} );
};
