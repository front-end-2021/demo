import { useContext } from 'react'
import {
    RouterContext, router, routerReducer,
    user, userReducer, UserContext
} from '../DataContext'

export default function FormElements() {
    const { layout } = useContext(RouterContext);

    return (<div className="container-xxl flex-grow-1 container-p-y">
        {layout == router.FormBasicInputs && <FormBasicInputs />}
        {layout == router.FormInputGroups && <FormInputGroups />}
        {layout == router.FormLayoutVertical && <FormLayoutsVertical />}
        {layout == router.FormLayoutHorizontal && <FormLayoutsHorizontal />}
    </div>)
}

function FormBasicInputs() {

    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Forms /</span> Basic Inputs</h4>

        <div className="row">
            <div className="col-md-6">
                <div className="card mb-4">
                    <h5 className="card-header">Default</h5>
                    <div className="card-body">
                        <div>
                            <label htmlFor="defaultFormControlInput" className="form-label">Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="defaultFormControlInput"
                                placeholder="John Doe"
                                aria-describedby="defaultFormControlHelp"
                            />
                            <div id="defaultFormControlHelp" className="form-text">
                                We'll never share your details with anyone else.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card mb-4">
                    <h5 className="card-header">Float label</h5>
                    <div className="card-body">
                        <div className="form-floating">
                            <input
                                type="text"
                                className="form-control"
                                id="floatingInput"
                                placeholder="John Doe"
                                aria-describedby="floatingInputHelp"
                            />
                            <label htmlFor="floatingInput">Name</label>
                            <div id="floatingInputHelp" className="form-text">
                                We'll never share your details with anyone else.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card mb-4">
                    <h5 className="card-header">Form Controls</h5>
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlInput1" className="form-label">Email address</label>
                            <input
                                type="email"
                                className="form-control"
                                id="exampleFormControlInput1"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlReadOnlyInput1" className="form-label">Read only</label>
                            <input
                                className="form-control"
                                type="text"
                                id="exampleFormControlReadOnlyInput1"
                                placeholder="Readonly input here..."
                                readOnly
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlReadOnlyInputPlain1" className="form-label">Read plain</label>
                            <input type="text"
                                readOnly
                                className="form-control-plaintext"
                                id="exampleFormControlReadOnlyInputPlain1"
                                defaultValue="email@example.com"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlSelect1" className="form-label">Example select</label>
                            <select className="form-select" id="exampleFormControlSelect1" aria-label="Default select example">
                                <option value="0" defaultValue="0">Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleDataList" className="form-label">Datalist example</label>
                            <input className="form-control"
                                list="datalistOptions"
                                id="exampleDataList"
                                placeholder="Type to search..." />
                            <datalist id="datalistOptions">
                                <option value="San Francisco"></option>
                                <option value="New York" defaultValue="New York"></option>
                                <option value="Seattle"></option>
                                <option value="Los Angeles"></option>
                                <option value="Chicago"></option>
                            </datalist>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleFormControlSelect2" className="form-label">Example multiple select</label>
                            <select multiple
                                className="form-select"
                                id="exampleFormControlSelect2"
                                aria-label="Multiple select example">
                                <option value="0" defaultValue="0">Open this select menu</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="exampleFormControlTextarea1" className="form-label">Example textarea</label>
                            <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card mb-4">
                    <h5 className="card-header">Input Sizing</h5>
                    <div className="card-body">
                        <small className="text-light fw-semibold">Input text</small>

                        <div className="mt-2 mb-3">
                            <label htmlFor="largeInput" className="form-label">Large input</label>
                            <input
                                id="largeInput"
                                className="form-control form-control-lg"
                                type="text"
                                placeholder=".form-control-lg"
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="defaultInput" className="form-label">Default input</label>
                            <input id="defaultInput" className="form-control" type="text" placeholder="Default input" />
                        </div>
                        <div>
                            <label htmlFor="smallInput" className="form-label">Small input</label>
                            <input
                                id="smallInput"
                                className="form-control form-control-sm"
                                type="text"
                                placeholder=".form-control-sm"
                            />
                        </div>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <small className="text-light fw-semibold">Input select</small>
                        <div className="mt-2 mb-3">
                            <label htmlFor="largeSelect" className="form-label">Large select</label>
                            <select id="largeSelect" className="form-select form-select-lg">
                                <option defaultValue>Large select</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="defaultSelect" className="form-label">Default select</label>
                            <select id="defaultSelect" className="form-select">
                                <option defaultValue>Default select</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="smallSelect" className="form-label">Small select</label>
                            <select id="smallSelect" className="form-select form-select-sm">
                                <option defaultValue>Small select</option>
                                <option value="1">One</option>
                                <option value="2">Two</option>
                                <option value="3">Three</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-xl-6">
                <div className="card mb-4">
                    <h5 className="card-header">Checkboxes and Radios</h5>
                    <div className="card-body">
                        <div className="row gy-3">
                            <div className="col-md">
                                <small className="text-light fw-semibold">Checkboxes</small>
                                <div className="form-check mt-3">
                                    <input className="form-check-input" type="checkbox"
                                        defaultValue="" id="defaultCheck1" />
                                    <label className="form-check-label" htmlFor="defaultCheck1"> Unchecked </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox"
                                        defaultValue="" id="defaultCheck2" defaultChecked />
                                    <label className="form-check-label" htmlFor="defaultCheck2"> Indeterminate </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox"
                                        defaultValue="" id="defaultCheck3" defaultChecked />
                                    <label className="form-check-label" htmlFor="defaultCheck3"> Checked </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="checkbox"
                                        defaultValue="" id="disabledCheck1" disabled />
                                    <label className="form-check-label" htmlFor="disabledCheck1"> Disabled Unchecked </label>
                                </div>
                                <div className="form-check">
                                    <input type="checkbox"
                                        className="form-check-input"
                                        defaultValue=""
                                        id="disabledCheck2"
                                        disabled
                                        defaultChecked />
                                    <label className="form-check-label" htmlFor="disabledCheck2"> Disabled Checked </label>
                                </div>
                            </div>
                            <div className="col-md">
                                <small className="text-light fw-semibold">Radio</small>
                                <div className="form-check mt-3">
                                    <input
                                        name="default-radio-1"
                                        className="form-check-input"
                                        type="radio"
                                        defaultValue=""
                                        id="defaultRadio1"
                                    />
                                    <label className="form-check-label" htmlFor="defaultRadio1"> Unchecked </label>
                                </div>
                                <div className="form-check">
                                    <input type="radio"
                                        name="default-radio-1"
                                        className="form-check-input"
                                        defaultValue=""
                                        id="defaultRadio2"
                                        defaultChecked />
                                    <label className="form-check-label" htmlFor="defaultRadio2"> Checked </label>
                                </div>
                                <div className="form-check">
                                    <input className="form-check-input" type="radio" value="" id="disabledRadio1" disabled />
                                    <label className="form-check-label" htmlFor="disabledRadio1"> Disabled unchecked </label>
                                </div>
                                <div className="form-check">
                                    <input type="radio"
                                        className="form-check-input"
                                        defaultValue=""
                                        id="disabledRadio2"
                                        disabled
                                        defaultChecked />
                                    <label className="form-check-label" htmlFor="disabledRadio2"> Disabled checkbox </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr className="m-0" />
                    <div className="card-body">
                        <div className="row gy-3">
                            <div className="col-md">
                                <small className="text-light fw-semibold d-block">Inline Checkboxes</small>
                                <div className="form-check form-check-inline mt-3">
                                    <input className="form-check-input" type="checkbox"
                                        id="inlineCheckbox1" defaultValue="option1" />
                                    <label className="form-check-label" htmlFor="inlineCheckbox1">1</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="checkbox"
                                        id="inlineCheckbox2" defaultValue="option2" />
                                    <label className="form-check-label" htmlFor="inlineCheckbox2">2</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input"
                                        type="checkbox"
                                        id="inlineCheckbox3"
                                        defaultValue="option3"
                                        disabled
                                    />
                                    <label className="form-check-label" htmlFor="inlineCheckbox3">3 (disabled)</label>
                                </div>
                            </div>
                            <div className="col-md">
                                <small className="text-light fw-semibold d-block">Inline Radio</small>
                                <div className="form-check form-check-inline mt-3">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="inlineRadioOptions"
                                        id="inlineRadio1"
                                        defaultValue="option1"
                                    />
                                    <label className="form-check-label" htmlFor="inlineRadio1">1</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="inlineRadioOptions"
                                        id="inlineRadio2"
                                        defaultValue="option2"
                                    />
                                    <label className="form-check-label" htmlFor="inlineRadio2">2</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="inlineRadioOptions"
                                        id="inlineRadio3"
                                        defaultValue="option3"
                                        disabled
                                    />
                                    <label className="form-check-label" htmlFor="inlineRadio3">3 (disabled)</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card mb-4">
                    <h5 className="card-header">Switches</h5>
                    <div className="card-body">
                        <div className="form-check form-switch mb-2">
                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"
                            >Default switch checkbox input</label
                            >
                        </div>
                        <div className="form-check form-switch mb-2">
                            <input className="form-check-input" type="checkbox"
                                id="flexSwitchCheckChecked" defaultChecked />
                            <label className="form-check-label"
                                htmlFor="flexSwitchCheckChecked">Checked switch checkbox input</label>
                        </div>
                        <div className="form-check form-switch mb-2">
                            <input className="form-check-input" type="checkbox" id="flexSwitchCheckDisabled" disabled />
                            <label className="form-check-label"
                                htmlFor="flexSwitchCheckDisabled">Disabled switch checkbox input</label>
                        </div>
                        <div className="form-check form-switch">
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="flexSwitchCheckCheckedDisabled"
                                defaultChecked
                                disabled
                            />
                            <label className="form-check-label" htmlFor="flexSwitchCheckCheckedDisabled"
                            >Disabled checked switch checkbox input</label
                            >
                        </div>
                    </div>
                </div>
                <div className="card mb-4 mb-xl-0">
                    <h5 className="card-header">Range</h5>
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="formRange1" className="form-label">Example range</label>
                            <input type="range" className="form-range" id="formRange1" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="disabledRange" className="form-label">Disabled range</label>
                            <input type="range" className="form-range" id="disabledRange" disabled />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="formRange2" className="form-label">Min and max</label>
                            <input type="range" className="form-range" min="0" max="5" id="formRange2" />
                        </div>
                        <div>
                            <label htmlFor="formRange3" className="form-label">Steps</label>
                            <input type="range" className="form-range" min="0" max="5" step="0.5" id="formRange3" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-xl-6">
                <div className="card mb-4">
                    <h5 className="card-header">HTML5 Inputs</h5>
                    <div className="card-body">
                        <div className="mb-3 row">
                            <label htmlFor="html5-text-input" className="col-md-2 col-form-label">Text</label>
                            <div className="col-md-10">
                                <input className="form-control" type="text"
                                    defaultValue="Sneat" id="html5-text-input" />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-search-input" className="col-md-2 col-form-label">Search</label>
                            <div className="col-md-10">
                                <input className="form-control" type="search"
                                    defaultValue="Search ..." id="html5-search-input" />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-email-input" className="col-md-2 col-form-label">Email</label>
                            <div className="col-md-10">
                                <input className="form-control" type="email"
                                    defaultValue="john@example.com" id="html5-email-input" />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-url-input" className="col-md-2 col-form-label">URL</label>
                            <div className="col-md-10">
                                <input className="form-control"
                                    type="url"
                                    defaultValue="https://themeselection.com"
                                    id="html5-url-input" />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-tel-input" className="col-md-2 col-form-label">Phone</label>
                            <div className="col-md-10">
                                <input className="form-control" type="tel" defaultValue="90-(164)-188-556" id="html5-tel-input" />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-password-input" className="col-md-2 col-form-label">Password</label>
                            <div className="col-md-10">
                                <input className="form-control" type="password" defaultValue="password" id="html5-password-input" />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-number-input" className="col-md-2 col-form-label">Number</label>
                            <div className="col-md-10">
                                <input className="form-control" type="number" defaultValue="18" id="html5-number-input" />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-datetime-local-input" className="col-md-2 col-form-label">Datetime</label>
                            <div className="col-md-10">
                                <input
                                    className="form-control"
                                    type="datetime-local"
                                    defaultValue="2021-06-18T12:30:00"
                                    id="html5-datetime-local-input"
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-date-input" className="col-md-2 col-form-label">Date</label>
                            <div className="col-md-10">
                                <input className="form-control" type="date" defaultValue="2021-06-18" id="html5-date-input" />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-month-input" className="col-md-2 col-form-label">Month</label>
                            <div className="col-md-10">
                                <input className="form-control" type="month" defaultValue="2021-06" id="html5-month-input" />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-week-input" className="col-md-2 col-form-label">Week</label>
                            <div className="col-md-10">
                                <input className="form-control" type="week" defaultValue="2021-W25" id="html5-week-input" />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-time-input" className="col-md-2 col-form-label">Time</label>
                            <div className="col-md-10">
                                <input className="form-control" type="time" defaultValue="12:30:00" id="html5-time-input" />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="html5-color-input" className="col-md-2 col-form-label">Color</label>
                            <div className="col-md-10">
                                <input className="form-control" type="color" defaultValue="#666EE8" id="html5-color-input" />
                            </div>
                        </div>
                        <div className="row">
                            <label htmlFor="html5-range" className="col-md-2 col-form-label">Range</label>
                            <div className="col-md-10">
                                <input type="range" className="form-range mt-3" id="html5-range" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="card">
                    <h5 className="card-header">File input</h5>
                    <div className="card-body">
                        <div className="mb-3">
                            <label htmlFor="formFile" className="form-label">Default file input example</label>
                            <input className="form-control" type="file" id="formFile" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="formFileMultiple" className="form-label">Multiple files input example</label>
                            <input className="form-control" type="file" id="formFileMultiple" multiple />
                        </div>
                        <div>
                            <label htmlFor="formFileDisabled" className="form-label">Disabled file input example</label>
                            <input className="form-control" type="file" id="formFileDisabled" disabled />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function FormInputGroups() {
    return (<>
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Forms /</span> Input groups</h4>

        <div className="row">
            <div className="col-md-6">
                <div className="card mb-4">
                    <h5 className="card-header">Basic</h5>
                    <div className="card-body demo-vertical-spacing demo-only-element">
                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon11">@</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                aria-label="Username"
                                aria-describedby="basic-addon11"
                            />
                        </div>

                        <div className="form-password-toggle">
                            <label className="form-label" htmlFor="basic-default-password12">Password</label>
                            <div className="input-group">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="basic-default-password12"
                                    placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                    aria-describedby="basic-default-password2"
                                />
                                <span id="basic-default-password2" className="input-group-text cursor-pointer"
                                ><i className="bx bx-hide"></i
                                ></span>
                            </div>
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Recipient's username"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon13"
                            />
                            <span className="input-group-text" id="basic-addon13">@example.com</span>
                        </div>

                        <div className="input-group">
                            <span className="input-group-text" id="basic-addon14">https://example.com/users/</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="URL"
                                id="basic-url1"
                                aria-describedby="basic-addon14"
                            />
                        </div>

                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Amount"
                                aria-label="Amount (to the nearest dollar)"
                            />
                            <span className="input-group-text">.00</span>
                        </div>

                        <div className="input-group">
                            <span className="input-group-text">With textarea</span>
                            <textarea className="form-control" aria-label="With textarea" placeholder="Comment"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card mb-4">
                    <h5 className="card-header">Merged</h5>
                    <div className="card-body demo-vertical-spacing demo-only-element">
                        <div className="input-group input-group-merge">
                            <span className="input-group-text" id="basic-addon-search31"><i className="bx bx-search"></i></span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search..."
                                aria-label="Search..."
                                aria-describedby="basic-addon-search31"
                            />
                        </div>

                        <div className="form-password-toggle">
                            <label className="form-label" htmlFor="basic-default-password32">Password</label>
                            <div className="input-group input-group-merge">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="basic-default-password32"
                                    placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                    aria-describedby="basic-default-password"
                                />
                                <span className="input-group-text cursor-pointer" id="basic-default-password"
                                ><i className="bx bx-hide"></i
                                ></span>
                            </div>
                        </div>

                        <div className="input-group input-group-merge">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Recipient's username"
                                aria-label="Recipient's username"
                                aria-describedby="basic-addon33"
                            />
                            <span className="input-group-text" id="basic-addon33">@example.com</span>
                        </div>

                        <div className="input-group input-group-merge">
                            <span className="input-group-text" id="basic-addon34">https://example.com/users/</span>
                            <input type="text" className="form-control" id="basic-url3" aria-describedby="basic-addon34" />
                        </div>

                        <div className="input-group input-group-merge">
                            <span className="input-group-text">$</span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="100"
                                aria-label="Amount (to the nearest dollar)"
                            />
                            <span className="input-group-text">.00</span>
                        </div>

                        <div className="input-group input-group-merge">
                            <span className="input-group-text">With textarea</span>
                            <textarea className="form-control" aria-label="With textarea"></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card mb-4">
                    <h5 className="card-header">Sizing</h5>
                    <div className="card-body demo-vertical-spacing demo-only-element">
                        <div className="input-group input-group-lg">
                            <span className="input-group-text">@</span>
                            <input type="text" className="form-control" placeholder="Username" />
                        </div>

                        <div className="input-group">
                            <span className="input-group-text">@</span>
                            <input type="text" className="form-control" placeholder="Username" />
                        </div>

                        <div className="input-group input-group-sm">
                            <span className="input-group-text">@</span>
                            <input type="text" className="form-control" placeholder="Username" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card mb-4">
                    <h5 className="card-header">Checkbox and radio addons</h5>
                    <div className="card-body demo-vertical-spacing demo-only-element">
                        <div className="input-group">
                            <div className="input-group-text">
                                <input
                                    className="form-check-input mt-0"
                                    type="checkbox"
                                    value=""
                                    aria-label="Checkbox for following text input"
                                />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with checkbox" />
                        </div>

                        <div className="input-group">
                            <div className="input-group-text">
                                <input
                                    className="form-check-input mt-0"
                                    type="radio"
                                    value=""
                                    aria-label="Radio button for following text input"
                                />
                            </div>
                            <input type="text" className="form-control" aria-label="Text input with radio button" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="row">
            <div className="col-md-6">
                <div className="card mb-4">
                    <h5 className="card-header">Multiple inputs & addon</h5>

                    <div className="card-body demo-vertical-spacing demo-only-element">
                        <small className="text-light fw-semibold d-block">Multiple inputs</small>
                        <div className="input-group">
                            <span className="input-group-text">First and last name</span>
                            <input type="text" aria-label="First name" className="form-control" />
                            <input type="text" aria-label="Last name" className="form-control" />
                        </div>

                        <small className="text-light fw-semibold d-block pt-3">Multiple addons</small>
                        <div className="input-group">
                            <span className="input-group-text">$</span>
                            <span className="input-group-text">0.00</span>
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Dollar amount (with dot and two decimal places)"
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                aria-label="Dollar amount (with dot and two decimal places)"
                            />
                            <span className="input-group-text">$</span>
                            <span className="input-group-text">0.00</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card mb-4">
                    <h5 className="card-header">Speech To Text</h5>
                    <div className="card-body demo-vertical-spacing demo-only-element">
                        <small className="text-light fw-semibold d-block">Input Group</small>

                        <div className="input-group input-group-merge speech-to-text">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Say it"
                                aria-describedby="text-to-speech-addon"
                            />
                            <span className="input-group-text" id="text-to-speech-addon">
                                <i className="bx bx-microphone cursor-pointer text-to-speech-toggle"></i>
                            </span>
                        </div>

                        <small className="text-light fw-semibold d-block pt-3">Textarea</small>

                        <div className="input-group input-group-merge speech-to-text">
                            <textarea className="form-control" placeholder="Say it" rows="2"></textarea>
                            <span className="input-group-text">
                                <i className="bx bx-microphone cursor-pointer text-to-speech-toggle"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-md-6">
                <div className="card mb-4">
                    <h5 className="card-header">Button with dropdowns & addons</h5>
                    <div className="card-body demo-vertical-spacing demo-only-element">
                        <small className="text-light fw-semibold d-block">Button addons</small>
                        <div className="input-group">
                            <button className="btn btn-outline-primary" type="button" id="button-addon1">Button</button>
                            <input
                                type="text"
                                className="form-control"
                                placeholder=""
                                aria-label="Example text with button addon"
                                aria-describedby="button-addon1"
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Recipient's username"
                                aria-label="Recipient's username"
                                aria-describedby="button-addon2"
                            />
                            <button className="btn btn-outline-primary" type="button" id="button-addon2">Button</button>
                        </div>

                        <div className="input-group">
                            <button className="btn btn-outline-primary" type="button">Button</button>
                            <button className="btn btn-outline-primary" type="button">Button</button>
                            <input
                                type="text"
                                className="form-control"
                                placeholder=""
                                aria-label="Example text with two button addons"
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Recipient's username"
                                aria-label="Recipient's username with two button addons"
                            />
                            <button className="btn btn-outline-primary" type="button">Button</button>
                            <button className="btn btn-outline-primary" type="button">Button</button>
                        </div>

                        <small className="text-light fw-semibold d-block pt-3">Button with dropdowns</small>
                        <div className="input-group">
                            <button
                                className="btn btn-outline-primary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Dropdown
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="void(0)">Action</a></li>
                                <li><a className="dropdown-item" href="void(0)">Another action</a></li>
                                <li><a className="dropdown-item" href="void(0)">Something else here</a></li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li><a className="dropdown-item" href="void(0)">Separated link</a></li>
                            </ul>
                            <input type="text" className="form-control" aria-label="Text input with dropdown button" />
                        </div>

                        <div className="input-group">
                            <input type="text" className="form-control" aria-label="Text input with dropdown button" />
                            <button
                                className="btn btn-outline-primary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Dropdown
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a className="dropdown-item" href="void(0)">Action</a></li>
                                <li><a className="dropdown-item" href="void(0)">Another action</a></li>
                                <li><a className="dropdown-item" href="void(0)">Something else here</a></li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li><a className="dropdown-item" href="void(0)">Separated link</a></li>
                            </ul>
                        </div>

                        <div className="input-group">
                            <button
                                className="btn btn-outline-primary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Dropdown
                            </button>
                            <ul className="dropdown-menu">
                                <li><a className="dropdown-item" href="void(0)">Action before</a></li>
                                <li><a className="dropdown-item" href="void(0)">Another action before</a></li>
                                <li><a className="dropdown-item" href="void(0)">Something else here</a></li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li><a className="dropdown-item" href="void(0)">Separated link</a></li>
                            </ul>
                            <input type="text" className="form-control" aria-label="Text input with 2 dropdown buttons" />
                            <button
                                className="btn btn-outline-primary dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Dropdown
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><a className="dropdown-item" href="void(0)">Action</a></li>
                                <li><a className="dropdown-item" href="void(0)">Another action</a></li>
                                <li><a className="dropdown-item" href="void(0)">Something else here</a></li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li><a className="dropdown-item" href="void(0)">Separated link</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-6">
                <div className="row">
                    <div className="col-12">
                        <div className="card mb-4">
                            <h5 className="card-header">Segmented buttons</h5>
                            <div className="card-body demo-vertical-spacing demo-only-element">
                                <div className="input-group">
                                    <button type="button" className="btn btn-outline-primary">Action</button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span className="visually-hidden">Toggle Dropdown</span>
                                    </button>
                                    <ul className="dropdown-menu">
                                        <li><a className="dropdown-item" href="void(0)">Action</a></li>
                                        <li><a className="dropdown-item" href="void(0)">Another action</a></li>
                                        <li><a className="dropdown-item" href="void(0)">Something else here</a></li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li><a className="dropdown-item" href="void(0)">Separated link</a></li>
                                    </ul>
                                    <input
                                        type="text"
                                        className="form-control"
                                        aria-label="Text input with segmented dropdown button"
                                    />
                                </div>

                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        aria-label="Text input with segmented dropdown button"
                                    />
                                    <button type="button" className="btn btn-outline-primary">Action</button>
                                    <button
                                        type="button"
                                        className="btn btn-outline-primary dropdown-toggle dropdown-toggle-split"
                                        data-bs-toggle="dropdown"
                                        aria-expanded="false"
                                    >
                                        <span className="visually-hidden">Toggle Dropdown</span>
                                    </button>
                                    <ul className="dropdown-menu dropdown-menu-end">
                                        <li><a className="dropdown-item" href="void(0)">Action</a></li>
                                        <li><a className="dropdown-item" href="void(0)">Another action</a></li>
                                        <li><a className="dropdown-item" href="void(0)">Something else here</a></li>
                                        <li>
                                            <hr className="dropdown-divider" />
                                        </li>
                                        <li><a className="dropdown-item" href="void(0)">Separated link</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="card mb-4">
                            <h5 className="card-header">Custom select</h5>
                            <div className="card-body demo-vertical-spacing demo-only-element">
                                <div className="input-group">
                                    <label className="input-group-text" htmlFor="inputGroupSelect01">Options</label>
                                    <select className="form-select" id="inputGroupSelect01">
                                        <option defaultValue>Choose...</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <select className="form-select" id="inputGroupSelect02">
                                        <option defaultValue>Choose...</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                    <label className="input-group-text" htmlFor="inputGroupSelect02">Options</label>
                                </div>

                                <div className="input-group">
                                    <button className="btn btn-outline-primary" type="button">Button</button>
                                    <select
                                        className="form-select"
                                        id="inputGroupSelect03"
                                        aria-label="Example select with button addon"
                                    >
                                        <option defaultValue>Choose...</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                </div>

                                <div className="input-group">
                                    <select
                                        className="form-select"
                                        id="inputGroupSelect04"
                                        aria-label="Example select with button addon"
                                    >
                                        <option defaultValue>Choose...</option>
                                        <option value="1">One</option>
                                        <option value="2">Two</option>
                                        <option value="3">Three</option>
                                    </select>
                                    <button className="btn btn-outline-primary" type="button">Button</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-12">
                <div className="card">
                    <h5 className="card-header">Custom file input</h5>
                    <div className="card-body demo-vertical-spacing demo-only-element">
                        <div className="input-group">
                            <label className="input-group-text" htmlFor="inputGroupFile01">Upload</label>
                            <input type="file" className="form-control" id="inputGroupFile01" />
                        </div>

                        <div className="input-group">
                            <input type="file" className="form-control" id="inputGroupFile02" />
                            <label className="input-group-text" htmlFor="inputGroupFile02">Upload</label>
                        </div>

                        <div className="input-group">
                            <button className="btn btn-outline-primary" type="button" id="inputGroupFileAddon03">Button</button>
                            <input
                                type="file"
                                className="form-control"
                                id="inputGroupFile03"
                                aria-describedby="inputGroupFileAddon03"
                                aria-label="Upload"
                            />
                        </div>

                        <div className="input-group">
                            <input
                                type="file"
                                className="form-control"
                                id="inputGroupFile04"
                                aria-describedby="inputGroupFileAddon04"
                                aria-label="Upload"
                            />
                            <button className="btn btn-outline-primary" type="button" id="inputGroupFileAddon04">Button</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>)
}
function FormLayoutsVertical() {
    return (<div className="container-xxl flex-grow-1 container-p-y">
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Forms/</span> Vertical Layouts</h4>
        <div className="row">
            <div className="col-xl">
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Basic Layout</h5>
                        <small className="text-muted float-end">Default label</small>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="basic-default-fullname">Full Name</label>
                                <input type="text" className="form-control" id="basic-default-fullname" placeholder="John Doe" />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="basic-default-company">Company</label>
                                <input type="text" className="form-control" id="basic-default-company" placeholder="ACME Inc." />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="basic-default-email">Email</label>
                                <div className="input-group input-group-merge">
                                    <input
                                        type="text"
                                        id="basic-default-email"
                                        className="form-control"
                                        placeholder="john.doe"
                                        aria-label="john.doe"
                                        aria-describedby="basic-default-email2"
                                    />
                                    <span className="input-group-text" id="basic-default-email2">@example.com</span>
                                </div>
                                <div className="form-text">You can use letters, numbers & periods</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="basic-default-phone">Phone No</label>
                                <input
                                    type="text"
                                    id="basic-default-phone"
                                    className="form-control phone-mask"
                                    placeholder="658 799 8941"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="basic-default-message">Message</label>
                                <textarea
                                    id="basic-default-message"
                                    className="form-control"
                                    placeholder="Hi, Do you have a moment to talk Joe?"
                                ></textarea>
                            </div>
                            <button type="submit" className="btn btn-primary">Send</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-xl">
                <div className="card mb-4">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">Basic with Icons</h5>
                        <small className="text-muted float-end">Merged input group</small>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="basic-icon-default-fullname">Full Name</label>
                                <div className="input-group input-group-merge">
                                    <span id="basic-icon-default-fullname2" className="input-group-text"
                                    ><i className="bx bx-user"></i
                                    ></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="basic-icon-default-fullname"
                                        placeholder="John Doe"
                                        aria-label="John Doe"
                                        aria-describedby="basic-icon-default-fullname2"
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="basic-icon-default-company">Company</label>
                                <div className="input-group input-group-merge">
                                    <span id="basic-icon-default-company2" className="input-group-text"
                                    ><i className="bx bx-buildings"></i
                                    ></span>
                                    <input
                                        type="text"
                                        id="basic-icon-default-company"
                                        className="form-control"
                                        placeholder="ACME Inc."
                                        aria-label="ACME Inc."
                                        aria-describedby="basic-icon-default-company2"
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="basic-icon-default-email">Email</label>
                                <div className="input-group input-group-merge">
                                    <span className="input-group-text"><i className="bx bx-envelope"></i></span>
                                    <input
                                        type="text"
                                        id="basic-icon-default-email"
                                        className="form-control"
                                        placeholder="john.doe"
                                        aria-label="john.doe"
                                        aria-describedby="basic-icon-default-email2"
                                    />
                                    <span id="basic-icon-default-email2" className="input-group-text">@example.com</span>
                                </div>
                                <div className="form-text">You can use letters, numbers & periods</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="basic-icon-default-phone">Phone No</label>
                                <div className="input-group input-group-merge">
                                    <span id="basic-icon-default-phone2" className="input-group-text"
                                    ><i className="bx bx-phone"></i
                                    ></span>
                                    <input
                                        type="text"
                                        id="basic-icon-default-phone"
                                        className="form-control phone-mask"
                                        placeholder="658 799 8941"
                                        aria-label="658 799 8941"
                                        aria-describedby="basic-icon-default-phone2"
                                    />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label" htmlFor="basic-icon-default-message">Message</label>
                                <div className="input-group input-group-merge">
                                    <span id="basic-icon-default-message2" className="input-group-text"
                                    ><i className="bx bx-comment"></i
                                    ></span>
                                    <textarea
                                        id="basic-icon-default-message"
                                        className="form-control"
                                        placeholder="Hi, Do you have a moment to talk Joe?"
                                        aria-label="Hi, Do you have a moment to talk Joe?"
                                        aria-describedby="basic-icon-default-message2"
                                    ></textarea>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-primary">Send</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}
function FormLayoutsHorizontal() {
    return (<div className="container-xxl flex-grow-1 container-p-y">
        <h4 className="fw-bold py-3 mb-4"><span className="text-muted fw-light">Forms/</span> Horizontal Layouts</h4>
        <div className="row">
            <div className="col-xxl">
                <div className="card mb-4">
                    <div className="card-header d-flex align-items-center justify-content-between">
                        <h5 className="mb-0">Basic Layout</h5>
                        <small className="text-muted float-end">Default label</small>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" htmlFor="basic-default-name">Name</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="basic-default-name" placeholder="John Doe" />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" htmlFor="basic-default-company">Company</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="basic-default-company"
                                        placeholder="ACME Inc."
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" htmlFor="basic-default-email">Email</label>
                                <div className="col-sm-10">
                                    <div className="input-group input-group-merge">
                                        <input
                                            type="text"
                                            id="basic-default-email"
                                            className="form-control"
                                            placeholder="john.doe"
                                            aria-label="john.doe"
                                            aria-describedby="basic-default-email2"
                                        />
                                        <span className="input-group-text" id="basic-default-email2">@example.com</span>
                                    </div>
                                    <div className="form-text">You can use letters, numbers & periods</div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" htmlFor="basic-default-phone">Phone No</label>
                                <div className="col-sm-10">
                                    <input
                                        type="text"
                                        id="basic-default-phone"
                                        className="form-control phone-mask"
                                        placeholder="658 799 8941"
                                        aria-label="658 799 8941"
                                        aria-describedby="basic-default-phone"
                                    />
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" htmlFor="basic-default-message">Message</label>
                                <div className="col-sm-10">
                                    <textarea id="basic-default-message"
                                        className="form-control"
                                        placeholder="Hi, Do you have a moment to talk Joe?"
                                        aria-label="Hi, Do you have a moment to talk Joe?"
                                        aria-describedby="basic-icon-default-message2"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="row justify-content-end">
                                <div className="col-sm-10">
                                    <button type="submit" className="btn btn-primary">Send</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className="col-xxl">
                <div className="card mb-4">
                    <div className="card-header d-flex align-items-center justify-content-between">
                        <h5 className="mb-0">Basic with Icons</h5>
                        <small className="text-muted float-end">Merged input group</small>
                    </div>
                    <div className="card-body">
                        <form>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" htmlFor="basic-icon-default-fullname">Name</label>
                                <div className="col-sm-10">
                                    <div className="input-group input-group-merge">
                                        <span id="basic-icon-default-fullname2"
                                            className="input-group-text"><i className="bx bx-user"></i></span>
                                        <input type="text"
                                            className="form-control"
                                            id="basic-icon-default-fullname"
                                            placeholder="John Doe"
                                            aria-label="John Doe"
                                            aria-describedby="basic-icon-default-fullname2" />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" htmlFor="basic-icon-default-company">Company</label>
                                <div className="col-sm-10">
                                    <div className="input-group input-group-merge">
                                        <span id="basic-icon-default-company2"
                                            className="input-group-text"><i className="bx bx-buildings"></i></span>
                                        <input type="text"
                                            id="basic-icon-default-company"
                                            className="form-control"
                                            placeholder="ACME Inc."
                                            aria-label="ACME Inc."
                                            aria-describedby="basic-icon-default-company2" />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 col-form-label" htmlFor="basic-icon-default-email">Email</label>
                                <div className="col-sm-10">
                                    <div className="input-group input-group-merge">
                                        <span className="input-group-text"><i className="bx bx-envelope"></i></span>
                                        <input
                                            type="text"
                                            id="basic-icon-default-email"
                                            className="form-control"
                                            placeholder="john.doe"
                                            aria-label="john.doe"
                                            aria-describedby="basic-icon-default-email2"
                                        />
                                        <span id="basic-icon-default-email2" className="input-group-text">@example.com</span>
                                    </div>
                                    <div className="form-text">You can use letters, numbers & periods</div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 form-label" htmlFor="basic-icon-default-phone">Phone No</label>
                                <div className="col-sm-10">
                                    <div className="input-group input-group-merge">
                                        <span id="basic-icon-default-phone2" className="input-group-text"
                                        ><i className="bx bx-phone"></i
                                        ></span>
                                        <input
                                            type="text"
                                            id="basic-icon-default-phone"
                                            className="form-control phone-mask"
                                            placeholder="658 799 8941"
                                            aria-label="658 799 8941"
                                            aria-describedby="basic-icon-default-phone2"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-3">
                                <label className="col-sm-2 form-label" htmlFor="basic-icon-default-message">Message</label>
                                <div className="col-sm-10">
                                    <div className="input-group input-group-merge">
                                        <span id="basic-icon-default-message2" className="input-group-text"
                                        ><i className="bx bx-comment"></i
                                        ></span>
                                        <textarea
                                            id="basic-icon-default-message"
                                            className="form-control"
                                            placeholder="Hi, Do you have a moment to talk Joe?"
                                            aria-label="Hi, Do you have a moment to talk Joe?"
                                            aria-describedby="basic-icon-default-message2"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="row justify-content-end">
                                <div className="col-sm-10">
                                    <button type="submit" className="btn btn-primary">Send</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>)
}