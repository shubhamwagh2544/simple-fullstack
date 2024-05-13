import axios from "axios"
import { useEffect, useState } from "react"

export function Users() {

    const [users, setUsers] = useState([])

    useEffect(() => {
        async function call() {
            const res = await axios.get('http://localhost:3000/users')
            setUsers(res.data)
            console.log(users)
        }
        call()
    }, [])

    return (
        <div>
            {
                users.map(user => (
                    <div>
                        <li>{user.name}</li>
                        <li>{user.email}</li>
                    </div>
                ))
            }
        </div>
    )
}