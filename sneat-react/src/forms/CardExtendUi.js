import { useEffect, useState } from 'react'
import Masonry from 'masonry-layout'

import elm1 from '../assets/img/elements/1.jpg'
import elm2 from '../assets/img/elements/2.jpg'
import elm4 from '../assets/img/elements/4.jpg'
import elm5 from '../assets/img/elements/5.jpg'
import elm7 from '../assets/img/elements/7.jpg'
import elm11 from '../assets/img/elements/11.jpg'
import elm12 from '../assets/img/elements/12.jpg'
import elm13 from '../assets/img/elements/13.jpg'
import elm17 from '../assets/img/elements/17.jpg'
import elm18 from '../assets/img/elements/18.jpg'
import elm19 from '../assets/img/elements/19.jpg'
import elm20 from '../assets/img/elements/20.jpg'

export function CardBasic() {
    const [masonry, setMasonry] = useState(null)
    useEffect(() => {
        // mounted/updated
        if (masonry == null) {
            setTimeout(() => {
                if (masonry != null) return

                const msnry = new Masonry('.layoutRowMasonry', {
                    percentPosition: true
                });
                setMasonry(msnry)
            }, 333)
        }
    })

    return (<div className="container-xxl flex-grow-1 container-p-y">
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">UI Elements /</span> Cards Basic</h4>

        <div className="row mb-5">
            <div className="col-md-6 col-lg-4 mb-3">
                <div className="card h-100">
                    <img className="card-img-top" src={elm2} alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">
                            Some quick example text to build on the card title and make up the bulk of the card's content.
                        </p>
                        <a href="void(0)" className="btn btn-outline-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-3">
                <div className="card h-100">
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <h6 className="card-subtitle text-muted">Support card subtitle</h6>
                    </div>
                    <img className="img-fluid" src={elm13} alt="Card image cap" />
                    <div className="card-body">
                        <p className="card-text">Bear claw sesame snaps gummies chocolate.</p>
                        <a href="void(0)" className="card-link">Card link</a>
                        <a href="void(0)" className="card-link">Another link</a>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-3">
                <div className="card h-100">
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <h6 className="card-subtitle text-muted">Support card subtitle</h6>
                        <img
                            className="img-fluid d-flex mx-auto my-4"
                            src={elm4}
                            alt="Card image cap"
                        />
                        <p className="card-text">Bear claw sesame snaps gummies chocolate.</p>
                        <a href="void(0)" className="card-link">Card link</a>
                        <a href="void(0)" className="card-link">Another link</a>
                    </div>
                </div>
            </div>
        </div>

        <h5 className="pb-1 mb-4">Content types</h5>

        <div className="row mb-5">
            <div className="col-md-6 col-lg-4">
                <h6 className="mt-2 text-muted">Body</h6>
                <div className="card mb-4">
                    <div className="card-body">
                        <p className="card-text">
                            This is some text within a card body. Jelly lemon drops tiramisu chocolate cake cotton candy
                            soufflé oat cake sweet roll. Sugar plum marzipan dragée topping cheesecake chocolate bar. Danish
                            muffin icing donut.
                        </p>
                    </div>
                </div>
                <h6 className="mt-2 text-muted">Titles, text, and links</h6>
                <div className="card mb-4">
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <div className="card-subtitle text-muted mb-3">Card subtitle</div>
                        <p className="card-text">
                            Some quick example text to build on the card title and make up the bulk of the card's content.
                        </p>
                        <a href="void(0)" className="card-link">Card link</a>
                        <a href="void(0)" className="card-link">Another link</a>
                    </div>
                </div>
                <h6 className="mt-2 text-muted">List groups</h6>
                <div className="card mb-4">
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Cras justo odio</li>
                        <li className="list-group-item">Dapibus ac facilisis in</li>
                        <li className="list-group-item">Vestibulum at eros</li>
                    </ul>
                </div>
            </div>
            <div className="col-md-6 col-lg-4">
                <h6 className="mt-2 text-muted">Images</h6>
                <div className="card mb-4">
                    <img className="card-img-top" src={elm5} alt="Card image cap" />
                    <div className="card-body">
                        <p className="card-text">
                            Some quick example text to build on the card title and make up the bulk of the card's content.
                        </p>
                        <p className="card-text">
                            Cookie topping caramels jujubes gingerbread. Lollipop apple pie cupcake candy canes cookie ice
                            cream. Wafer chocolate bar carrot cake jelly-o.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-lg-4">
                <h6 className="mt-2 text-muted">Kitchen sink</h6>
                <div className="card">
                    <img className="card-img-top" src={elm7} alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">Some quick example text to build on the card title.</p>
                    </div>
                    <ul className="list-group list-group-flush">
                        <li className="list-group-item">Cras justo odio</li>
                        <li className="list-group-item">Vestibulum at eros</li>
                    </ul>
                    <div className="card-body">
                        <a href="void(0)" className="card-link">Card link</a>
                        <a href="void(0)" className="card-link">Another link</a>
                    </div>
                </div>
            </div>
        </div>

        <h6 className="pb-1 mb-4 text-muted">Header and footer</h6>
        <div className="row mb-5">
            <div className="col-md-6 col-lg-4 mb-3">
                <div className="card">
                    <div className="card-header">Featured</div>
                    <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">
                            With supporting text below as a natural lead-in to additional content natural lead-in to
                            additional content.
                        </p>
                        <a href="void(0)" className="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-3">
                <div className="card">
                    <h5 className="card-header">Quote</h5>
                    <div className="card-body">
                        <blockquote className="blockquote mb-0">
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante.Lorem
                                ipsum dolor sit amet, consectetur.
                            </p>
                            <footer className="blockquote-footer">
                                Someone famous in
                                <cite title="Source Title">Source Title</cite>
                            </footer>
                        </blockquote>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-lg-4 mb-3">
                <div className="card text-center">
                    <div className="card-header">Featured</div>
                    <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural.</p>
                        <a href="void(0)" className="btn btn-primary">Go somewhere</a>
                    </div>
                    <div className="card-footer text-muted">2 days ago</div>
                </div>
            </div>
        </div>

        <h5 className="pb-1 mb-4">Text alignment</h5>
        <div className="row mb-5">
            <div className="col-md-6 col-lg-4">
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="void(0)" className="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-lg-4">
                <div className="card text-center mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="void(0)" className="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-lg-4">
                <div className="card text-end mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        <a href="void(0)" className="btn btn-primary">Go somewhere</a>
                    </div>
                </div>
            </div>
        </div>

        <h5 className="pb-1 mb-4">Images caps & overlay</h5>
        <div className="row mb-5">
            <div className="col-md-6 col-xl-4">
                <div className="card mb-3">
                    <img className="card-img-top" src={elm18} alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">
                            This is a wider card with supporting text below as a natural lead-in to additional content. This
                            content is a little bit longer.
                        </p>
                        <p className="card-text">
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-xl-4">
                <div className="card mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">
                            This is a wider card with supporting text below as a natural lead-in to additional content. This
                            content is a little bit longer.
                        </p>
                        <p className="card-text">
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </p>
                    </div>
                    <img className="card-img-bottom" src={elm1} alt="Card image cap" />
                </div>
            </div>
            <div className="col-md-6 col-xl-4">
                <div className="card bg-dark border-0 text-white">
                    <img className="card-img" src={elm11} alt="Card image" />
                    <div className="card-img-overlay">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">
                            This is a wider card with supporting text below as a natural lead-in to additional content. This
                            content is a little bit longer.
                        </p>
                        <p className="card-text">Last updated 3 mins ago</p>
                    </div>
                </div>
            </div>
        </div>

        <h5 className="pb-1 mb-4">Horizontal</h5>
        <div className="row mb-5">
            <div className="col-md">
                <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img className="card-img card-img-left" src={elm12} alt="Card image" />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <p className="card-text">
                                    This is a wider card with supporting text below as a natural lead-in to additional content.
                                    This content is a little bit longer.
                                </p>
                                <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md">
                <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">Card title</h5>
                                <p className="card-text">
                                    This is a wider card with supporting text below as a natural lead-in to additional content.
                                    This content is a little bit longer.
                                </p>
                                <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <img className="card-img card-img-right" src={elm17} alt="Card image" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <h5 className="pb-1 mb-4">Style variation</h5>
        <div className="row">
            <div className="col-md-6 col-xl-4">
                <div className="card bg-primary text-white mb-3">
                    <div className="card-header">Header</div>
                    <div className="card-body">
                        <h5 className="card-title text-white">Primary card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up.</p>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-xl-4">
                <div className="card bg-secondary text-white mb-3">
                    <div className="card-header">Header</div>
                    <div className="card-body">
                        <h5 className="card-title text-white">Secondary card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up.</p>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-xl-4">
                <div className="card bg-success text-white mb-3">
                    <div className="card-header">Header</div>
                    <div className="card-body">
                        <h5 className="card-title text-white">Success card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up.</p>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-xl-4">
                <div className="card bg-danger text-white mb-3">
                    <div className="card-header">Header</div>
                    <div className="card-body">
                        <h5 className="card-title text-white">Danger card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up.</p>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-xl-4">
                <div className="card bg-warning text-white mb-3">
                    <div className="card-header">Header</div>
                    <div className="card-body">
                        <h5 className="card-title text-white">Warning card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up.</p>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-xl-4">
                <div className="card bg-info text-white mb-3">
                    <div className="card-header">Header</div>
                    <div className="card-body">
                        <h5 className="card-title text-white">Info card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up.</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
            <div className="col-md-6 col-xl-4">
                <div className="card shadow-none bg-transparent border border-primary mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Primary card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up.</p>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-xl-4">
                <div className="card shadow-none bg-transparent border border-secondary mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Secondary card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up.</p>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-xl-4">
                <div className="card shadow-none bg-transparent border border-success mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Success card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up.</p>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-xl-4">
                <div className="card shadow-none bg-transparent border border-danger mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Danger card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up.</p>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-xl-4">
                <div className="card shadow-none bg-transparent border border-warning mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Warning card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up.</p>
                    </div>
                </div>
            </div>
            <div className="col-md-6 col-xl-4">
                <div className="card shadow-none bg-transparent border border-info mb-3">
                    <div className="card-body">
                        <h5 className="card-title">Info card title</h5>
                        <p className="card-text">Some quick example text to build on the card title and make up.</p>
                    </div>
                </div>
            </div>
        </div>

        <h5 className="pb-1 my-5">Card layout</h5>

        <h6 className="pb-1 mb-4 text-muted">Card Groups</h6>
        <div className="card-group mb-5">
            <div className="card">
                <img className="card-img-top" src={elm4} alt="Card image cap" />
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">
                        This is a wider card with supporting text below as a natural lead-in to additional content. This
                        content is a little bit longer.
                    </p>
                </div>
                <div className="card-footer">
                    <small className="text-muted">Last updated 3 mins ago</small>
                </div>
            </div>
            <div className="card">
                <img className="card-img-top" src={elm5} alt="Card image cap" />
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">
                        This card has supporting text below as a natural lead-in to additional content.
                    </p>
                </div>
                <div className="card-footer">
                    <small className="text-muted">Last updated 3 mins ago</small>
                </div>
            </div>
            <div className="card">
                <img className="card-img-top" src={elm1} alt="Card image cap" />
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <p className="card-text">
                        This is a wider card with supporting text below as a natural lead-in to additional content. This
                        card has even longer content than the first to show that equal height action.
                    </p>
                </div>
                <div className="card-footer">
                    <small className="text-muted">Last updated 3 mins ago</small>
                </div>
            </div>
        </div>

        <h6 className="pb-1 mb-4 text-muted">Grid Card</h6>
        <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
            <div className="col">
                <div className="card h-100">
                    <img className="card-img-top" src={elm2} alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">
                            This is a longer card with supporting text below as a natural lead-in to additional content.
                            This content is a little bit longer.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card h-100">
                    <img className="card-img-top" src={elm13} alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">
                            This is a longer card with supporting text below as a natural lead-in to additional content.
                            This content is a little bit longer.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card h-100">
                    <img className="card-img-top" src={elm4} alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">
                            This is a longer card with supporting text below as a natural lead-in to additional content.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card h-100">
                    <img className="card-img-top" src={elm18} alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">
                            This is a longer card with supporting text below as a natural lead-in to additional content.
                            This content is a little bit longer.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card h-100">
                    <img className="card-img-top" src={elm19} alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">
                            This is a longer card with supporting text below as a natural lead-in to additional content.
                            This content is a little bit longer.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col">
                <div className="card h-100">
                    <img className="card-img-top" src={elm20} alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">
                            This is a longer card with supporting text below as a natural lead-in to additional content.
                            This content is a little bit longer.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <h6 className="pb-1 mb-4 text-muted">Masonry</h6>
        <div className="row layoutRowMasonry">
            <div className="col-sm-6 col-lg-4 mb-4">
                <div className="card">
                    <img className="card-img-top" src={elm5} alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Card title that wraps to a new line</h5>
                        <p className="card-text">
                            This is a longer card with supporting text below as a natural lead-in to additional content.
                            This content is a little bit longer.
                        </p>
                    </div>
                </div>
            </div>
            <div className="col-sm-6 col-lg-4 mb-4">
                <div className="card p-3">
                    <figure className="p-3 mb-0">
                        <blockquote className="blockquote">
                            <p>A well-known quote, contained in a blockquote element.</p>
                        </blockquote>
                        <figcaption className="blockquote-footer mb-0 text-muted">
                            Someone famous in <cite title="Source Title">Source Title</cite>
                        </figcaption>
                    </figure>
                </div>
            </div>
            <div className="col-sm-6 col-lg-4 mb-4">
                <div className="card">
                    <img className="card-img-top" src={elm18} alt="Card image cap" />
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">
                            This card has supporting text below as a natural lead-in to additional content.
                        </p>
                        <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                    </div>
                </div>
            </div>
            <div className="col-sm-6 col-lg-4 mb-4">
                <div className="card bg-primary text-white text-center p-3">
                    <figure className="mb-0">
                        <blockquote className="blockquote">
                            <p>A well-known quote, contained in a blockquote element.</p>
                        </blockquote>
                        <figcaption className="blockquote-footer mb-0 text-white">
                            Someone famous in <cite title="Source Title">Source Title</cite>
                        </figcaption>
                    </figure>
                </div>
            </div>
            <div className="col-sm-6 col-lg-4 mb-4">
                <div className="card text-center">
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">This card has a regular title and short paragraph of text below it.</p>
                        <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                    </div>
                </div>
            </div>
            <div className="col-sm-6 col-lg-4 mb-4">
                <div className="card">
                    <img className="card-img-top" src={elm4} alt="Card image cap" />
                </div>
            </div>
            <div className="col-sm-6 col-lg-4 mb-4">
                <div className="card p-3 text-end">
                    <figure className="mb-0">
                        <blockquote className="blockquote">
                            <p>A well-known quote, contained in a blockquote element.</p>
                        </blockquote>
                        <figcaption className="blockquote-footer mb-0 text-muted">
                            Someone famous in <cite title="Source Title">Source Title</cite>
                        </figcaption>
                    </figure>
                </div>
            </div>
            <div className="col-sm-6 col-lg-4 mb-4">
                <div className="card">
                    <div className="card-body">
                        <h5 className="card-title">Card title</h5>
                        <p className="card-text">
                            This is another card with title and supporting text below. This card has some additional content
                            to make it slightly taller overall.
                        </p>
                        <p className="card-text"><small className="text-muted">Last updated 3 mins ago</small></p>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}