type IconProps = { icon: string, style?: string }

const Icon: React.FC<IconProps> = ({ icon, style = '' }) =>
    <i className={`fa-solid fa-${icon} ${style}`} />

export default Icon