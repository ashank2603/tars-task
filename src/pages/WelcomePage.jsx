import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import earthBg from '../assets/galaxy2.mp4'

const WelcomePage = () => {
  const [firstName, setFirstName] = useState("")
  const [showInput, setShowInput] = useState(false)
  const navigate = useNavigate()
    
  return (
    <div>
        <header className='relative flex items-center justify-center h-screen  overflow-hidden'>
            <div className='relative z-30 p-5 text-2xl text-white bg-opacity-50 rounded-xl'>
                <div className='flex flex-col pb-7'>
                    <h1 className='text-6xl'>Welcome</h1>
                    {!showInput && <button onClick={() => setShowInput(true)}>Get Started</button>}
                </div>
                {showInput &&
                <div className='flex flex-col'>
                    <input 
                        placeholder='Type your first name...'
                        className='opacity-80'
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <button
                        onClick={() => {
                            localStorage.setItem('firstName',firstName)
                            navigate("/home")
                        }}
                    >
                        Let's Go
                    </button>
                </div>}
            </div>
            <video
                autoPlay
                loop
                muted
                className='absolute z-10 w-auto min-w-full min-h-full max-w-none'
            >
                <source 
                    src={earthBg}
                    type="video/mp4"
                />
                Your browser does not support the video tag
            </video>
        </header>
    </div>
  )
}

export default WelcomePage