type AdoptionRequest = {
    id: number
    pet_id: number
    adopter_id: number
    status: string
}

export const emptyRequest = {
    id: 0,
    pet_id: 0,
    adopter_id: 0,
    status: '',
}

export default AdoptionRequest
