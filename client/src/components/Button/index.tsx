import {
	default as MuiButton,
	ButtonProps as MuiButtonProps
} from '@material-ui/core/Button'
import { PropsWithChildren } from 'react'

type ButtonProps = {} & MuiButtonProps

const Button = (props: PropsWithChildren<ButtonProps>) => {
	const { children } = props

	return (
		<MuiButton {...props} variant='contained' disableElevation>
			{children}
		</MuiButton>
	)
}

export default Button
