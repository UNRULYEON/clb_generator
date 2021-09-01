import { useState } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import data from 'emoji-mart/data/apple.json'
import { Emoji, BaseEmoji, NimblePicker } from 'emoji-mart'
import Popover from '@material-ui/core/Popover'

const CoverGrid = () => {
	const [emojis, setEmojis] = useState<{ colons: string; native: string }[]>([
		{ colons: ':pregnant_woman:', native: '🤰' },
		{ colons: ':pregnant_woman:', native: '🤰' },
		{ colons: ':pregnant_woman:', native: '🤰' },
		{ colons: ':pregnant_woman:', native: '🤰' },
		{ colons: ':pregnant_woman:', native: '🤰' },
		{ colons: ':pregnant_woman:', native: '🤰' },
		{ colons: ':pregnant_woman:', native: '🤰' },
		{ colons: ':pregnant_woman:', native: '🤰' },
		{ colons: ':pregnant_woman:', native: '🤰' },
		{ colons: ':pregnant_woman:', native: '🤰' },
		{ colons: ':pregnant_woman:', native: '🤰' },
		{ colons: ':pregnant_woman:', native: '🤰' }
	])
	const [selected, setSelected] = useState<number>(-1)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleChange = (emoji?: BaseEmoji) => {
		const newEmojis = [...emojis]

		if (!emoji) {
			newEmojis[selected] = { colons: '', native: '' }
		} else {
			newEmojis[selected] = {
				colons: emoji.colons || '',
				native: emoji.native || ''
			}
		}

		setEmojis(newEmojis)
	}

	const handleRemoveAllEmojis = () => {
		const newEmojis = emojis.map(() => ({ colons: '', native: '' }))
		setEmojis(newEmojis)
	}

	const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
		setSelected(Number(event.currentTarget.getAttribute('data-key')))
		setAnchorEl(event.currentTarget)
	}

	const handleClose = () => {
		setSelected(-1)
		setAnchorEl(null)
	}

	const executeRequest = () => {
		console.log(emojis)
		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(emojis)
		}

		fetch('/api/generate-cover', requestOptions)
			.then(async res => {
				// link.href = URL.createObjectURL(
				//   new Blob([res.data], { type: "video/mp4" })
				// );
				// link.click();
				const json = await res.json()
				// const url = window.URL.createObjectURL(new Blob([json]))
				// console.log(url)
				// const link = document.createElement("a")
				// link.href = url
				// link.setAttribute("download", "file.png")
				// document.body.appendChild(link)
				// link.click()

				const link = document.createElement('a')
				link.target = '_blank'
				link.download = 'file.png'
				link.href = URL.createObjectURL(new Blob([json], { type: 'image/png' }))
				link.click()
			})
			.catch(e => console.log(e))
	}

	const open = Boolean(anchorEl)
	const id = open ? 'simple-popover' : undefined

	return (
		<>
			<div className='grid-body'>
				<div className='emoji-grid'>
					{emojis.map((emoji, key) => (
						<div className='emoji-container' key={key}>
							<button
								className={`emoji ${selected === key ? 'selected' : ''}`}
								data-key={key}
								onClick={handleOpen}
							>
								<Emoji emoji={emoji.colons} size={64} />
							</button>
						</div>
					))}
					<Popover
						id={id}
						open={open}
						anchorEl={anchorEl}
						onClose={handleClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'center'
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'center'
						}}
						PaperProps={{ elevation: 0, className: 'picker-popover' }}
					>
						<button className='remove-emoji' onClick={() => handleChange()}>
							remove emoji
						</button>
						<NimblePicker
							showPreview={false}
							emoji='smirk'
							autoFocus
							set='apple'
							title={'Pick one loverboy'}
							data={data as any}
							onSelect={emoji => handleChange(emoji as BaseEmoji)}
						/>
					</Popover>
				</div>
				<div className='actions'>
					<button
						className='remove-all-emojis'
						onClick={() => handleRemoveAllEmojis()}
					>
						Remove all emojis
					</button>
					<button className='download' onClick={() => executeRequest()}>
						Download cover
					</button>
				</div>
			</div>
		</>
	)
}

export default CoverGrid
