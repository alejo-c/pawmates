type Gender = { gender: string, icon: string }

const petTypes: Map<string, string> = new Map([['C', 'Cat'], ['D', 'Dog']])

export const petGenders: Map<string, Gender> = new Map([
    ['M', { gender: 'Male', icon: 'mars' }],
    ['F', { gender: 'Female', icon: 'venus' }],
])

export default petTypes