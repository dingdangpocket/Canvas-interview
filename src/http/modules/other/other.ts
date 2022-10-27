import axios from "axios"
const other = {
    getData(){
        return axios({
            method:"GET",
            url:"/api/todos/1",
            headers: {
                'Content-Type': 'application/json'
            },
        })
    },
}
export default other;

