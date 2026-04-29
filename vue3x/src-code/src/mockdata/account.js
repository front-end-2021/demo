export function emptyAcc() { return { id: 0, name: '', pass: '' } }
export function getUsers() {
    let ls_ = localStorage.getItem('users')
    if (ls_) {
        ls_ = JSON.parse(ls_)
    } else {
        ls_ = [
            Object.assign(emptyAcc(), {
                id: 1, name: 'Guest', pass: '123'
            }),
            Object.assign(emptyAcc(), {
                id: 2, name: 'DaiNB', pass: '123'
            })
        ]
        return ls_
    }
}