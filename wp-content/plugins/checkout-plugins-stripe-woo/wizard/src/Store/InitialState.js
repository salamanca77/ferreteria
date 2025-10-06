export const settingsInitialState = {
	settingsProcess: false,
	steps: [
		{ id: 0, title: 'welcome', completed: false },
		{ id: 1, title: 'webhooks', completed: false },
		{ id: 2, title: 'success', completed: false },
		{ id: 3, title: 'express-checkout', completed: false },
		{ id: 4, title: 'thank-you', completed: false },
	],
};

const settingsEvents = ( state, data ) => {
	switch ( data.type ) {
		case 'BLOCKED':
			return {
				...state,
				settingsProcess: 'blocked',
			};
		case 'PROCESSING':
			return {
				...state,
				settingsProcess: 'processing',
			};
		case 'RESET':
			return {
				...state,
				settingsProcess: false,
			};
		case 'UPDATE_STEP':
			return {
				...state,
				steps: state.steps.map( ( step ) =>
					step.id === data.step ? { ...step, completed: data.completed } : step,
				),
			};
		case 'SYNC_STEPS_WITH_DATABASE':
			return {
				...state,
				steps: data.steps,
			};
		default:
			return state;
	}
};

export default settingsEvents;
