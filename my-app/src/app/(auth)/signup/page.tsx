"use client"
import { ChangeEvent, FormEvent, useState } from "react";
import style from "../../../style/signup.module.css"
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function Signup() {

    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordRepeat, setPasswordRepeat] = useState("")
    const [error, setError] = useState("")

    const [showPasswordStatus, setShowPasswordStatus] = useState("password")
    const [showPasswordRepeatStatus, setShowPasswordRepeatStatus] = useState("password")
    
    const emailRegexp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const usernameRegexp = /^[a-zA-Zа-яА-Я0-9_!@%&*?\s]{3,}$/
    const passwordRegexp = /^(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    const route = useRouter()



    const validationInputEmail = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        console.log(emailRegexp.test(value));  

        if (emailRegexp.test(value) == true) {
            setError("")
        } else {
            setError("Почта должна состоять от 3 символов, содержать символ @ ")
        }

        setEmail(value) 
    }

    const validationInputUserName = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        console.log(usernameRegexp.test(value));   

        if (usernameRegexp.test(value) == true) {
            setError("")
        } else {
            setError("Имя полизователя должна состоять от 3 символов не иметь символа")
        }

        setUsername(value)
    }

    const validationInputPassword = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        console.log(passwordRegexp.test(value));  

        if (passwordRegexp.test(value) == true) {
            setError("")
        } else {
            setError("Пароль должна состоять от 8 символов, включая цифры, заглавные буквы, строчные буквы и спец символов: @, $, !, %, *, ?, &.")
        }

        setPassword(value) 
    }

    const validationInputPasswordRepeat = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        console.log(passwordRegexp.test(value));  

        if (passwordRegexp.test(value) == true) {
            setError("")
        } else {
            setError("Пароль должна состоять от 8 символов, включая цифры, заглавные буквы, строчные буквы и спец символов: @, $, !, %, *, ?, &.")
        }

        setPasswordRepeat(value) 
    }




    
    const showPasswordFun = () => {
        if (showPasswordStatus == "password") {
            setShowPasswordStatus("text")
        } else {
            setShowPasswordStatus("password")
        }
    }
    
    const showPasswordRepeatFun = () => {
        if (showPasswordRepeatStatus == "password") {
            setShowPasswordRepeatStatus("text")
        } else {
            setShowPasswordRepeatStatus("password")
        }
    }


    const submitSignUpUser = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(password == passwordRepeat && error == "");
        
        if (password == passwordRepeat && error == "") {
            try {
            
                const userData = {
                    email: email,
                    username: username,
                    password: password,
                }

                console.log(userData);

                const response = await axios.post('http://localhost:7000/api/signup', userData);
                console.log('Response:', response);
                console.log('Token:', response.data.token);

                localStorage.setItem("token", response.data.token)
                route.push('/sendfile')
                


            } catch (error) {
                console.log(error);
                if (axios.isAxiosError(error)) {
                    const serverMessage = error
                    console.log(serverMessage);
                    
                    if (serverMessage.response?.data?.msg != undefined) {
                        console.log(serverMessage.response?.data?.msg);     
                        setError(serverMessage.response?.data?.msg)
                    } else {
                        console.log(serverMessage.message)
                        setError(serverMessage.message)
                    }
                }
            }
        } else {
            setError("Пароль не совподает")
        }
    }

    return (
        <div className={style.signup}>
            
            <form className={style.formSignup} onSubmit={(e) => submitSignUpUser(e)}>

                <div className={style.formHead}>
                    <h2>Регистрация</h2>
                </div>

                <div className={style.formInputs}>
                    <input className={style.inputStyle} onChange={(e) => validationInputEmail(e)} placeholder="email" type="email" name="email" id="email" required/>
                    <input className={style.inputStyle} onChange={(e) => validationInputUserName(e)} placeholder="Имя полизователя" type="text" name="username" id="username" required/>
                    <div className={style.passwordBlock}>
                        <input className={style.inputStylePassword} onChange={(e) => validationInputPassword(e)} placeholder="Пароль" type={showPasswordStatus} name="password" id="password" required/>

                        <button className={style.buttonStylePassword} onClick={() => showPasswordFun()} type="button">
                            {
                                showPasswordStatus == "password" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>
                                )
                            }
                            
                        </button>
                    </div>
                    <div className={style.passwordBlock}>
                        <input className={style.inputStylePassword} onChange={(e) => validationInputPasswordRepeat(e)} placeholder="Повторите пароль" type={showPasswordRepeatStatus} name="passwordRepeat" id="passwordRepeat" required/>

                        <button className={style.buttonStylePassword} onClick={() => showPasswordRepeatFun()} type="button">
                            {
                                showPasswordRepeatStatus == "password" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="m644-428-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660-500q0 20-4 37.5T644-428Zm128 126-58-56q38-29 67.5-63.5T832-500q-50-101-143.5-160.5T480-720q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920-500q-23 59-60.5 109.5T772-302Zm20 246L624-222q-35 11-70.5 16.5T480-200q-151 0-269-83.5T40-500q21-53 53-98.5t73-81.5L56-792l56-56 736 736-56 56ZM222-624q-29 26-53 57t-41 67q50 101 143.5 160.5T480-280q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300-500q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3"><path d="M480-320q75 0 127.5-52.5T660-500q0-75-52.5-127.5T480-680q-75 0-127.5 52.5T300-500q0 75 52.5 127.5T480-320Zm0-72q-45 0-76.5-31.5T372-500q0-45 31.5-76.5T480-608q45 0 76.5 31.5T588-500q0 45-31.5 76.5T480-392Zm0 192q-146 0-266-81.5T40-500q54-137 174-218.5T480-800q146 0 266 81.5T920-500q-54 137-174 218.5T480-200Zm0-300Zm0 220q113 0 207.5-59.5T832-500q-50-101-144.5-160.5T480-720q-113 0-207.5 59.5T128-500q50 101 144.5 160.5T480-280Z"/></svg>
                                )
                            }
                            
                        </button>
                    </div>
                    <span className={style.error}>{error}</span>
                </div>

                <div className={style.formButtons}>
                    <button type="submit" className={style.buttonSubmit}>Заригистрироватся</button>

                    <div className={style.formLinks}>
                        <Link className={`${style.Link}`} href={'/login'}>Есть аккаунт вход</Link>
                    </div>

                </div>

            </form>

        </div>
    );
}