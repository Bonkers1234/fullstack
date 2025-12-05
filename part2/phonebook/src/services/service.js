
import axios from 'axios'

const baseUrl = '/api/persons'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const addPhone = (object) => {
    const request = axios.post(baseUrl, object)
    return request.then(response => response.data)
}

const deletePhoneNum = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request
}

const updatePhone = (id, newObject) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

export default { getAll, addPhone, deletePhoneNum, updatePhone }