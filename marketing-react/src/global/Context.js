import React, {
    useContext, useState,
} from 'react'

export const LoadingContext = React.createContext()

export const useLoading = () => useContext(LoadingContext)

export function LoadingProvider({ children }) {
    const [loading, setLoading] = useState(true)
    return (
        <LoadingContext.Provider
            value={{
                loading: loading,
                setLoading: (isLoading) => setLoading(!!isLoading),
            }}>
            {children}
            {loading && <Loading />}
        </LoadingContext.Provider>
    )
}
function Loading() {
    return <div style={{
        width: '100vw', height: '100vh', zIndex: 9999,
        background: 'black', color: 'white',
        position: 'fixed', top: '0', left: '0',
        opacity: '0.123', textAlign: 'center'
    }}>
        <span style={{
            position: 'absolute', top: '50%', transform: `translate(-50%)`
        }}>...</span>
    </div>;
}