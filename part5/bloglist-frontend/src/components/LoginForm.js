import { useState } from 'react'
import PropTypes from 'prop-types'

const LoginForm = ({ postLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const handlePasswordChange = (event) => {
        setPassword(event.target.value)
    }

    const handleLogin = (event) => {
        event.preventDefault()
        postLogin({
            username,
            password,
        })

        setUsername('')
        setPassword('')
    }

    return (
        <div>
            <form onSubmit={handleLogin}>
                <div>
                    username
                    <input
                        id='username'
                        type='text'
                        value={username}
                        name='Username'
                        onChange={handleUsernameChange}
                    />
                </div>
                <div>
                    password
                    <input
                        id='password'
                        type='password'
                        value={password}
                        name='Password'
                        onChange={handlePasswordChange}
                    />
                </div>
                <button id='login-button' type='submit'>login</button>
            </form>
        </div>
    )
}

LoginForm.propTypes = {
    postLogin: PropTypes.func.isRequired
}

export default LoginForm