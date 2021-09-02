import { useState } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import data from 'emoji-mart/data/apple.json'
import { Emoji, BaseEmoji, NimblePicker } from 'emoji-mart'
import Popover from '@material-ui/core/Popover'

import Button from '../Button'

// 🤰🏻🤰🏾🤰🏽🤰🏻🤰🏽🤰🏻🤰🏻🤰🏿🤰🏼

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

		setSelected(-1)
		setAnchorEl(null)
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
		// let tempBody = ["🤰🏻","🤰🏾","🤰🏽","🤰🏻","🤰🏽","🤰🏻","🤰🏻","🤰🏿","🤰🏼","🤰🏽","🤰🏼","🤰🏻"]
		const native_emojis = emojis.map(emoji => emoji.native)

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(native_emojis)
		}

		fetch('/api/generate-cover', requestOptions)
			.then(async res => {
				const blob = await res.blob()
				const link = document.createElement('a')
				link.target = '_blank'
				link.download = 'clb.png'
				link.href = URL.createObjectURL(new Blob([blob], { type: 'image/png' }))

				// download
				link.click()
			})
			.catch(e => console.log(e))
	}

	const open = Boolean(anchorEl)
	const id = open ? 'simple-popover' : undefined

	return (
		<>
			<div className='grid-body'>
				<div className='cover'>
					<div className='emoji-grid'>
						{emojis.map((emoji, key) => (
							<div className='emoji-container' key={key}>
								<button
									className={`emoji-button ${
										selected === key ? 'selected' : ''
									}`}
									data-key={key}
									onClick={handleOpen}
								>
									<Emoji emoji={emoji.colons} size={64} sheetSize={64} />
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
							<Button
								buttonDanger
								className='remove-emoji'
								onClick={() => handleChange()}
							>
								remove emoji
							</Button>
							<NimblePicker
								showPreview={false}
								emoji='smirk'
								set='apple'
								title={'Pick one loverboy'}
								data={data as any}
								onSelect={emoji => handleChange(emoji as BaseEmoji)}
							/>
						</Popover>
					</div>
				</div>
				<div className='actions'>
					<Button
						buttonDanger
						fullWidth
						onClick={() => handleRemoveAllEmojis()}
					>
						Remove all emojis
					</Button>
					<Button fullWidth onClick={() => executeRequest()}>
						Download cover
					</Button>
				</div>
			</div>
		</>
	)
}

export default CoverGrid
