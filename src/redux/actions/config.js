import { SET_THEME } from './types';

export const setTheme = (theme) => ({ 
  type: SET_THEME, 
  payload: theme 
});

export const setLanguage = (language) => ({
  type: 'SET_LANGUAGE',
  payload: language
});