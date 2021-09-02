import React, { useEffect } from 'react'
import CoverGrid from './components/CoverGrid'
import Switch from '@material-ui/core/Switch'
import useTheme from './components/useTheme'

function App() {
	const { isDarkTheme, updateTheme } = useTheme()

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		updateTheme(event.target.checked ? 'dark' : 'light')
	}

	useEffect(() => {
		const htmlElement = document.getElementById('html')

		if (htmlElement) {
			if (isDarkTheme) {
				htmlElement.className = 'theme-dark'
			} else {
				htmlElement.className = 'theme-light'
			}
		}
	}, [isDarkTheme])

	return (
		<div className='App'>
			<div className='theme-switch'>
				<Switch checked={isDarkTheme} onChange={handleChange} name='dark' />
			</div>
			<h1>Certified lover boy</h1>
			<h2>Cover generator</h2>
			<h3>Click on an emoji to edit or remove</h3>
			<CoverGrid />
		</div>
	)
}

export default App
