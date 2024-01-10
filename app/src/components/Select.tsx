import { ReactNode } from 'react'

export type Option = { key: any, value: string, isDefault?: boolean }

type SelectProps = {
    name: string,
    default: string
    placeholder: string,
    icon: ReactNode,
    value: any,
    options: Option[],
    onChange: (e: any) => void
}

const Select: React.FC<SelectProps> = ({ name, default: def, placeholder, icon, value, options, onChange }) => {
    return <>
        <div className='input-group mb-3'>
            <span className='input-group-text'>{icon}</span>
            <div className='form-floating'>
                <select
                    name={name}
                    defaultValue={value}
                    key={name}
                    onChange={onChange}
                    id={`${name}-select`}
                    className='form-select'
                >
                    <option value='' disabled>{def}</option>
                    {
                        options.map(option =>
                            <option key={option.key} value={option.key}>
                                {option.value}
                            </option>
                        )
                    }
                </select>
                <label>{placeholder}</label>
            </div>
        </div>
    </>
}

export default Select