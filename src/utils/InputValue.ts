import React from "react"

export const useInputTextValue = (initialState:any) => {
    const [state,setState] = React.useState(initialState)
    const handleChange = (e:React.SyntheticEvent<HTMLInputElement>) => {
        setState(e.currentTarget.value)
    }
    const handleReset = () => {
        setState(initialState)
    }

    return [state,handleChange,handleReset]
}
