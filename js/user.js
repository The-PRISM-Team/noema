const _defaultUsername = 'XxXnoemaUserXxX'
if (!isDefined(localStorage.username)) localStorage.username = _defaultUsername
let username = localStorage.username
window.username = username
function setUsername(name) {
    if (typeof name !== "string")
        name = name.toString()
    if (!isDefined(name)) name = _defaultUsername
    localStorage.username = username = name
    window.username = name
}