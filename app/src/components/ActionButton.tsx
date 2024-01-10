import Icon from './Icon'

type ButtonProps = { target?: string, icon: string } & React.ButtonHTMLAttributes<HTMLButtonElement>

export const ActionButton: React.FC<ButtonProps> = ({ target = '', disabled, onClick: handleClick, icon }) => {
    const modal = target === '' ? '' : 'modal'
    return <>
        <button
            className='btn p-1 px-2'
            data-bs-toggle={modal}
            data-bs-target={target}
            disabled={disabled}
            onClick={handleClick}
        >
            <Icon icon={icon} />
        </button>
    </>
}

export default ActionButton