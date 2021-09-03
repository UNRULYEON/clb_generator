import { useState } from 'react'
import 'emoji-mart/css/emoji-mart.css'
import data from 'emoji-mart/data/apple.json'
import { Emoji, BaseEmoji, NimblePicker, emojiIndex } from 'emoji-mart'
import Popover from '@material-ui/core/Popover'
import { AnimateSharedLayout, motion } from 'framer-motion'
import Button from '../Button'
import CircularProgress from '@material-ui/core/CircularProgress'

type EmojiType = {
	emojis: string[]
}

const randomEmojis = () => {
	let result: { colons: string; native: string }[] = []
	const categories = data.categories as EmojiType[]
	let randomEmojis: string[] = []
	let finalEmojis: string[] = []

	categories.map(category => {
		const emojis = category.emojis.slice(0, 20).map(emoji => emoji) //grab first 10 emojis for each category
		// let everyEmoji = category.emojis.map(emoji_name => emoji_name) //grab all emojis
		return (randomEmojis = [...randomEmojis, ...emojis])
	})

	randomEmojis.map(() => {
		if (finalEmojis.length < 12) {
			const emoji_string =
				randomEmojis[Math.floor(Math.random() * randomEmojis.length)]

			if (emoji_string) {
				finalEmojis.push(emoji_string)
			}
		}
	})

	for (let i = 0; i < finalEmojis.length; i++) {
		let temp = emojiIndex.search(finalEmojis[i]) as
			| { colons: string; native: string }[]
			| null
		if (temp) {
			result.push({ colons: temp[0].colons, native: temp[0].native })
		}
	}
	return result
}

const CoverGrid = () => {
	const [emojis, setEmojis] = useState<{ colons: string; native: string }[]>(
		randomEmojis()
	)
	const [selected, setSelected] = useState<number>(-1)
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [loading, setLoading] = useState<boolean>(false)

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
		const native_emojis = emojis.map(emoji => emoji.native)

		const requestOptions = {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(native_emojis)
		}

		setLoading(true)

		fetch('/api/generate-cover', requestOptions)
			.then(async res => {
				const blob = await res.blob()
				let headertype = res.headers.get('Content-disposition')
				const link = document.createElement('a')
				link.target = '_blank'
				link.download = `${headertype?.slice(22, headertype?.length - 1)}`
				link.href = URL.createObjectURL(new Blob([blob], { type: 'image/png' }))

				// download
				link.click()
			})
			.catch(e => console.log(e))
			.finally(() => setLoading(false))
	}

	const open = Boolean(anchorEl)
	const id = open ? 'simple-popover' : undefined
	const emptyGrid = emojis.every(emoji => emoji.colons.length <= 0)

	return (
		<>
			<div className='grid-body'>
				<div className='cover'>
					<AnimateSharedLayout>
						{loading && (
							<motion.div
								className='cover-loader'
								layout
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
							>
								<CircularProgress thickness={5} size={80} />
							</motion.div>
						)}
					</AnimateSharedLayout>
					<div className='emoji-grid'>
						{emojis.map((emoji, key) => (
							<div
								className={`emoji-container ${loading ? 'disable-emoji' : ''}`}
								key={key}
							>
								<motion.button
									disabled={loading}
									className={`emoji-button ${emptyGrid ? 'empty-grid' : ''} ${
										loading ? 'disabled' : ''
									}`}
									data-key={key}
									onClick={handleOpen}
									whileHover={{ scale: loading ? 1 : 1.05 }}
									whileTap={{ scale: loading ? 1 : 0.95 }}
									transition={{ duration: 0.1 }}
								>
									<Emoji emoji={emoji.colons} size={64} sheetSize={64} />
								</motion.button>
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
								theme={'dark'}
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
						disabled={loading}
						buttonDanger
						fullWidth
						onClick={() => handleRemoveAllEmojis()}
					>
						Remove all emojis
					</Button>
					<Button fullWidth disabled={loading} onClick={() => executeRequest()}>
						Download cover
					</Button>
				</div>
			</div>
		</>
	)
}

export default CoverGrid
