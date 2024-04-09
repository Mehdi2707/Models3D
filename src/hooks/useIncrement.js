import {useState} from "react";

export function useIncrement(initial = 0) {
    const [state, setState] = useState(initial)
    const setIncrement = () => setState(v => v+1)
    const setDecrement = () => setState(v => v-1)
    return [state, setIncrement, setDecrement]
}
