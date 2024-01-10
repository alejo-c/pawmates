import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

type func = () => void
const swal = withReactContent(Swal)

export const messageAlert = (title: string, icon: any) => swal.fire({ title, icon })

export const confirmAlert = (title: string, text: string, atConfirm: func, atCancel: func) => {
    swal.fire({
        title,
        text,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel'
    }).then(res => {
        if (res.isConfirmed) return atConfirm()
        atCancel()
    })
}