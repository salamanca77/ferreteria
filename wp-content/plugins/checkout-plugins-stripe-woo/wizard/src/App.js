import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

/* Main Compnent */
import '@Admin/App.scss';
import Settings from '@Admin/Settings';
import { StateProvider } from './Store/StateProvider';
import settingsEvents, { settingsInitialState } from './Store/InitialState';

ReactDOM.render(
	<StateProvider
		initialState={ settingsInitialState }
		reducer={ settingsEvents }
	>
		<BrowserRouter>
			<Settings />
		</BrowserRouter>
	</StateProvider>,
	document.getElementById( 'cpsw-onboarding-content' ),
);
