import React, { useState } from 'react'
import {motion} from "framer-motion"
import Input from '../components/Input';
import { Lock, Mail, User,Loader } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';
import { useAuthStore } from '../store/authStore';
const SignUpPage = () => {

    const[formData,setFormData] = useState({
        name:'',
        email:'',
        password:''
    });
    const navigate = useNavigate();

    const {signup,error,isLoading} = useAuthStore();
    const handleSubmit = async (e) =>{
        e.preventDefault();
        try {
            await signup(formData.email,formData.password,formData.name)
            navigate("/verify-email")
        } catch (error) {
            console.log(error)
        }
    }

    const handleOnChange = (e) =>{
        const {value,name} = e.target;

        setFormData({
            ...formData,
            [name]:value
        });
    }


    return (
    <motion.div
    initial={{opacity:0,y:20}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.5}}
    className='max-w-md w-full bg-gray-800 bg-opacity-50 
    backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl
    overflow-hidden'>
        <div className='p-8'>
            <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r 
            from-green-400 to-emerald-500 text-transparent bg-clip-text'>
                Create Account
            </h2>

            <form onSubmit={handleSubmit}>
                <Input icon={User}
                 placeholder={`Full Name`}
                 name={`name`}
                 type={`text`}
                 value={formData.name}
                 onChange={handleOnChange}
                 />

                <Input icon={Mail}
                 placeholder={`Your Email`}
                 type={`email`}
                 name={`email`}
                 value={formData.email}
                 onChange={handleOnChange}
                 />

                <Input icon={Lock}
                 placeholder={`*******`}
                 type={`password`}
                 name={`password`}
                 value={formData.password}
                 onChange={handleOnChange}
                 />
                {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
                <PasswordStrengthMeter password={formData.password}/>
                <motion.button
                    className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
                    font-bold rounded-lg shadow-lg hover:from-green-600
                    hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                        focus:ring-offset-gray-900 transition duration-200'
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type='submit'
                    disabled={isLoading}
                >
                    {isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' size={24}/> : "Sign up"}
                    </motion.button>
            </form>
        </div>

        <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
            <p className='text-sm text-gray-400'>
                Already have an Account? {" "}
                <Link to={'/login'} className='text-green-400 hover:underline'>Login</Link>
            </p>
        </div>
    </motion.div>
  )
}

export default SignUpPage