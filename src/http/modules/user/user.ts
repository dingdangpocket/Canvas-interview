import axios from "axios"
const user = {
    getUser(){
        return axios({
            method:"GET",
            url:"/api/todos/1",
            headers: {
                'Content-Type': 'application/json'
            },
        })
    },
}
export default user;


