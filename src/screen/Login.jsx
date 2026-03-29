import { useState } from 'react'
import '../index.css'
import axios from 'axios'
import {useNavigate} from 'react-router-dom'

function Login(){
    const navigator = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://dev.patriotmed.id/dashboard-user/LoginDashboard', {
                username,
                password,
            });
            localStorage.setItem("token", response.data.data.token);
            console.log('Login successful:', response.data);
            navigator('/Dashboard');
        } catch (error) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
        }
    }

    return(
        <main className="flex justify-center items-center bg-[#4D8066] h-screen">
            <div className="bg-[#FEFBF8] p-8 rounded-lg shadow-lg max-w-lg w-full">
                <form onSubmit={handleSubmit} className="flex flex-col items-start ">
                    <h1 className="text-base md:text-xl lg:text-2xl text-[#474344] font-bold my-2">Hello!</h1>
                    <h2 className="text-xs md:text-sm lg:text-base text-[#474344] my-2">Login to enter</h2>
                    <input 
                        type="text"
                        placeholder="Username"
                        className="w-full p-4 my-2 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-[#4D8066]"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input 
                        type="password"
                        placeholder="Password"
                        className="w-full p-4 my-2 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-[#4D8066]"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit" className="bg-[#9CDCF7] text-[#474344] p-4 rounded-4xl focus:outline-none focus:ring-2 focus:ring-[#4D8066] w-full font-bold">
                        Login
                    </button>
                </form>
            </div>
        </main>
    );
}

export default Login;