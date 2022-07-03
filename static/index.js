window.addEventListener('load', async () => {
    const totalElmt = document.querySelector('#total')

    function updateTotal(newTotal) {
        // update total in HTML
        totalElmt.innerHTML = '$' + newTotal
        if (newTotal < 0) totalElmt.setAttribute('class', 'negative')
        if (newTotal > 0) totalElmt.setAttribute('class', 'positive')
        if (newTotal === 0) totalElmt.setAttribute('class', '')
    }

    const initialTotal = await fetch('/api/current').then(res => res.text()).then(n => Number(n))
    updateTotal(initialTotal)

    document.addEventListener('pointerup', async e => {
        console.log(e.target)
        if (e.target instanceof HTMLButtonElement) {
            let newTotal

            if (e.target.id === 'reset') {
                newTotal = await fetch('/api/reset').then(res => res.text()).then(n => Number(n))
            } else {
                const amt = e.target.dataset.amount
                newTotal = await fetch(`/api/add?amount=${amt}`).then(res => res.text()).then(n => Number(n))
            }

            updateTotal(newTotal)
        }
    })
})
