import React, { useEffect, useState } from 'react'
import CoverGrid from './components/CoverGrid'
import Switch from '@material-ui/core/Switch'

type userPreference = {
	theme: 'light' | 'dark' | 'system'
}

const useThemeDetector = () => {
	const getCurrentTheme = () =>
		window.matchMedia('(prefers-color-scheme: dark)').matches
	const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme())
	const mqListener = (e: { matches: boolean }) => {
		setIsDarkTheme(e.matches)
	}

	useEffect(() => {
		const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)')
		darkThemeMq.addEventListener('change', mqListener)
		return () => darkThemeMq.removeEventListener('change', mqListener)
	}, [])

	return isDarkTheme
}

function App() {
	const isDarkTheme = useThemeDetector()
	const [theme, setTheme] = useState({
		dark: false
	})

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		localStorage.setItem(
			'user-preferences',
			JSON.stringify({
				theme: event.target.checked ? 'dark' : 'light'
			} as userPreference)
		)
		const htmlElement = document.getElementById('html')
		if (htmlElement)
			htmlElement.className = event.target.checked
				? 'theme-dark'
				: 'theme-light'

		setTheme({ ...theme, [event.target.name]: event.target.checked })
	}

	useEffect(() => {
		const htmlElement = document.getElementById('html')
		const up = localStorage.getItem('user-preferences')

		if (htmlElement && up) {
			const preferences = JSON.parse(up) as userPreference
			if (preferences.theme === 'system') {
				if (isDarkTheme) {
					htmlElement.className = 'theme-dark'
					setTheme({ dark: true })
				} else {
					htmlElement.className = 'theme-light'
					setTheme({ dark: false })
				}
			}
		}
	}, [isDarkTheme])

	//initial load
	useEffect(() => {
		const up = localStorage.getItem('user-preferences')
		const htmlElement = document.getElementById('html')

		if (htmlElement) {
			if (!up) {
				localStorage.setItem(
					'user-preferences',
					JSON.stringify({ theme: 'system' })
				)
				setTheme({ dark: isDarkTheme })
				htmlElement.className = isDarkTheme ? 'theme-dark' : 'theme-light'
			} else {
				const preferences = JSON.parse(up) as userPreference
				setTheme({
					dark:
						preferences?.theme === 'dark' ||
						(preferences?.theme === 'system' && isDarkTheme)
							? true
							: false
				})
				htmlElement.className =
					preferences?.theme === 'dark' ||
					(preferences?.theme === 'system' && isDarkTheme)
						? 'theme-dark'
						: 'theme-light'
			}
		}
	}, [])

	return (
		<div className='App'>
			<div className='theme-switch'>
				<Switch checked={theme.dark} onChange={handleChange} name='dark' />
			</div>
			<h1>Certified lover boy</h1>
			<h2>Cover generator</h2>
			<h3>Click on an emoji to edit or remove</h3>
			<CoverGrid />
		</div>
	)
}

export default App
