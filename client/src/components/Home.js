import { useState, useEffect } from "react"
const Home = (() => {
    const [message, setMessage] = useState('')

    useEffect(() => {
        if(!message) {
            fetch('/homeChatroom')
                .then((res) => res.json())
                .then((messageList) => {
                    setMessage(messageList)
                })
        }
    })

    return (
        <div>
            <h1>home page</h1>
            <form action="/homeMessage" method="POST">
                <input type="text" name="author" placeholder="Username" />
                <input type="text" name="messageBody" placeholder="What would you like to say?" />
                <input type="submit" value="send" />
            </form>
        </div>
    )
})

export default Home