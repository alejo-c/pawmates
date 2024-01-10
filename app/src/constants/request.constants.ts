type Status = { status: string, badge: string }

const adoptionStatuses: Map<string, Status> = new Map([
    ['1', { status: 'Available', badge: 'success' }],
    ['2', { status: 'In Process', badge: 'primary' }],
    ['3', { status: 'Adopted', badge: 'secondary' }],
    ['4', { status: 'Approved', badge: 'success' }],
    ['5', { status: 'Rejected', badge: 'danger' }],
])

export default adoptionStatuses