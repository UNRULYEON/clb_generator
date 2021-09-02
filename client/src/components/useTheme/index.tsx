import { useEffect, useState } from 'react'

// https://medium.com/hypersphere-codes/detecting-system-theme-in-javascript-css-react-f6b961916d48

export type userPreference = {
	theme: 'light' | 'dark' | 'system'
}

const useTheme = () => {
	const up = localStorage.getItem('user-preferences')
	const userPreference: userPreference = up
		? JSON.parse(up)
		: { theme: 'system' }

	const getCurrentDeviceTheme = () =>
		window.matchMedia('(prefers-color-scheme: dark)').matches
	const [isDarkTheme, setIsDarkTheme] = useState(
		userPreference.theme === 'system'
			? getCurrentDeviceTheme()
			: userPreference.theme === 'dark'
			? true
			: false
	)

	// Function that is passed to the listener
	const mqListener = (e: { matches: boolean }) => {
		if (userPreference.theme === 'system') {
			setIsDarkTheme(e.matches)
		}
	}

	const updateTheme = (theme: userPreference['theme']) => {
		if (userPreference.theme === 'system') {
			setIsDarkTheme(getCurrentDeviceTheme())
		} else {
			setIsDarkTheme(theme === 'dark' ? true : false)
		}

		localStorage.setItem(
			'user-preferences',
			JSON.stringify({ theme: theme } as userPreference)
		)
	}

	// Add listener for device theme change
	useEffect(() => {
		const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
		darkThemeMq.addEventListener('change', mqListener)
		return () => darkThemeMq.removeEventListener('change', mqListener)
	}, [])

	return { isDarkTheme, updateTheme }
}

export default useTheme
