import React, { Suspense } from "react"
import { Marketing } from './Marketing';
import '../styles/home.scss';

export default function Home() {
    return (
        <Suspense fallback={<Loading />}>
            <div className='container'>
                <title>Create Marketing</title>
                <link rel="icon" href="/favicon.ico" />
                <main>
                    <Marketing />
                </main>
                <Footer />
            </div>
        </Suspense>
    )
}
function Footer() {
    return (
        <footer>
            <a
                href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                target="_blank"
                rel="noopener noreferrer" >
                Powered by{' Dainb '}
            </a>
        </footer>
    )
}
function Loading() {
    return <h2>Loadding ...</h2>
}