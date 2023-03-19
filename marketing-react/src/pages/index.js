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
                <article>
                    <h1 className='title'>
                        Welcome to <a href="void(0)">Planning</a>
                    </h1>

                    <p className='description'>
                        Get started by click <code>+ New &#9673;</code>
                    </p>

                    <div className='grid'>
                        <a href="https://nextjs.org/docs" className='card'>
                            <h3>Documentation &rarr;</h3>
                            <p>Find in-depth information about Next.js features and API.</p>
                        </a>

                        <a href="https://nextjs.org/learn" className='card'>
                            <h3>Learn &rarr;</h3>
                            <p>Learn about Next.js in an interactive course with quizzes!</p>
                        </a>

                        <a
                            href="https://github.com/vercel/next.js/tree/master/examples"
                            className='card' >
                            <h3>Examples &rarr;</h3>
                            <p>Discover and deploy boilerplate example Next.js projects.</p>
                        </a>

                        <a
                            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                            className='card' >
                            <h3>Deploy &rarr;</h3>
                            <p>
                                Instantly deploy your Next.js site to a public URL with Vercel.
                            </p>
                        </a>
                    </div>
                </article>
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