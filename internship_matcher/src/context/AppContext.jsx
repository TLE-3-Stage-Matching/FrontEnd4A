// It's giving centralized state management for the whole app, not just vacancies.
import {createContext} from 'react';

// Create the context. It's the heart of our state.
export const AppContext = createContext(null);
