type InputProps = {
    type: string,
    icon: React.ReactNode,
    name: string,
    value: any,
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const Input: React.FC<InputProps> = ({ type, icon, name, value, placeholder, onChange }) => {
    const autocompleteEmail = type === 'email' ? type : ''
    return (
        <div className='input-group mb-3'>
            <span className='input-group-text'>{icon}</span>
            <div className='form-floating'>
                <input
                    type={type}
                    name={name}
                    onChange={onChange}
                    defaultValue={value}
                    key={name}
                    id={`${name}-input`}
                    placeholder=''
                    className='form-control'
                    autoComplete={autocompleteEmail}
                ></input>
                <label>{placeholder}</label>
            </div>
        </div >
    )
}

export default Input