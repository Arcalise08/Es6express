

const onLoad = () => {
    const authorize = window.document.querySelector('button.btn.authorize');
    const select = window.document.querySelector('.swagger-ui')

    if (!authorize || !select) {
        setTimeout(() => {
            onLoad()
        },500)
    }
    else {
        authorize.onclick = onClick;
        select.addEventListener('change', () => {
            if (authorize && authorize?.parentNode)
                authorize.parentNode.removeChild(authorize)
            setTimeout(() => {
                onLoad()
            },250)

        })
    }
}

const onClick = () => {
    const previousBuild = window.document.querySelectorAll('.custom');
    if (previousBuild?.length > 0) {
        previousBuild.forEach((ele) => {
            ele.parentElement.removeChild(ele)
        })
    }

    const input = window.document.querySelector('.modal-ux-content .wrapper input')

    if (!input) {
        setTimeout(() => {
            onClick()
        },500)
    }
    else {
        const token = localStorage.getItem('token')
        const btn = document.createElement('button')
        btn.innerText = "retrieve"
        const btnStyles = "line-height: 1;" +
            "display: inline;" +
            "color: #49cc90;" +
            "border-width: 2px;" +
            "border-style: solid;" +
            "margin-left: 5px;" +
            "padding: 5px;" +
            "border-radius: 5px;" +
            "border-color: #49cc90;" +
            "background-color: transparent;" +
            "font-weight: 600;"
        btn.style.cssText = btnStyles
        btn.className = "custom"

        const title = document.createElement('label')
        title.innerText = "Save:"
        title.style.marginTop = "10px"


        const cachedInput = document.createElement('input')
        cachedInput.style.cssText = "border: 1px solid #d9d9d9; margin-top: 10px; border-radius:5px; padding: 8px 10px; min-width:230px"

        cachedInput.value = token;

        const saveBtn = btn.cloneNode(true)
        saveBtn.textContent = "save"
        saveBtn.style = `${btnStyles} border-color: gray; color: gray;`


        const div = document.createElement('div');
        div.append(cachedInput, saveBtn)

        const section = document.createElement('section')
        section.className = "custom"
        section.style.marginTop = '15px'
        section.style.marginBottom = '15px'


        btn.onclick = () => {
            const saved_token = localStorage.getItem("token")
            if (!!saved_token || true) {

                const event = new Event('input', {
                    bubbles: true,
                })
                event.simulated = true;
                input.value = saved_token
                input.dispatchEvent(event)

                const lockedBtn = window.document.querySelector('button.btn.modal-btn.auth.button')
                lockedBtn.onclick = () => onClick(true);
            }
        }

        saveBtn.onclick = () => {
            const value = cachedInput.value;
            localStorage.setItem('token', value);
        }

        section.append(title, div)
        input.parentNode.parentNode.append(section)
        input.parentNode.append(btn)

    }
}

window.addEventListener("load", onLoad)

