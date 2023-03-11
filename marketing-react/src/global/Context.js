import React, {
    useContext, useState,
} from 'react'
import '../styles/animation.scss'

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
        width: '100vw', height: '100vh', 
        zIndex: 9999, opacity: '0.357', 
        background: 'black', color: 'white',
        position: 'fixed', top: '0', left: '0',
    }}>
        <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: `translate(-50%)`, zIndex: 999
        }} className="d-loading">
            <span className="d-pulse d-pulse-1"></span>
            <span className="d-pulse d-pulse-2"></span>
            <span className="d-pulse d-pulse-3"></span>
        </div>
    </div>;
}