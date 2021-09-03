import {
	default as MuiButton,
	ButtonProps as MuiButtonProps
} from '@material-ui/core/Button'
import { PropsWithChildren } from 'react'

type ButtonProps = {
	buttonDanger?: boolean
	buttonConfirm?: boolean
} & MuiButtonProps

const Button = (props: PropsWithChildren<ButtonProps>) => {
	const {
		children,
		buttonDanger,
		buttonConfirm,
		className,
		fullWidth,
		onClick,
		disabled
	} = props

	const type = buttonDanger
		? 'type-danger'
		: buttonConfirm
		? 'type-confirm'
		: ''

	return (
		<MuiButton
			disabled={disabled}
			fullWidth={fullWidth}
			onClick={onClick}
			size='large'
			className={`${className ? className : ''} ${type}`}
			variant='contained'
			disableElevation
		>
			{children}
		</MuiButton>
	)
}

export default Button
