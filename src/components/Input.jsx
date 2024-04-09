import {useId} from "react";

/**
 *
 * @param {string} placeholder
 * @param {string} value
 * @param {string} label
 * @param {string} type
 * @param {(s: string) => void} onChange
 */
export function Input ({placeholder, value, onChange, label, type}) {
    const id = useId()
    return <div>
        <label className='form-label' htmlFor={id}>{label}</label>
        <input
            id={id}
            className="form-control"
            value={value}
            type={type}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            />
    </div>
}