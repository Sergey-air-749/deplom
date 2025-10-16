"use client"
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import style from "../../../style/sendfile.module.css";
import Link from "next/link";

import { useAppSelector, useAppDispatch, useAppStore } from '../../../components/hooks'
import { setAuth } from '../../../festures/authSlice'
import axios from "../../../../node_modules/axios/index";
import { useRouter } from "next/navigation";

export default function Sendfile() {
  const [files, setFiles] = useState<File[]>([])
  const [text, setText] = useState("")
  const [shareId, setShareId] = useState("")
  const [option, setOption] = useState("File")
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")

  const { isAuth, userData } = useAppSelector(state => state.authReducer)
  const route = useRouter()

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const fileAddInputRef = useRef<HTMLInputElement | null>(null);
  const textareaInputRef = useRef<HTMLTextAreaElement | null>(null);



  const fileInputChange = () => {
    fileInputRef.current?.click(); 
  }

  const fileInputAddChange = () => {
    fileAddInputRef.current?.click(); 
  }

  const selectFunChange = (e: ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    setOption(e.target.value)
  }


  const authReducer = useAppSelector(state => state.authReducer)
  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log(option);
  }, [option])

  useEffect(() => {
    console.log(authReducer);
  }, [authReducer])

  useEffect(() => {
    console.log(files);
  }, [files])

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(1);
    console.log(e.target.files);
    
    

    if (e.target.files != null) {
      const files = e.target.files;
      console.log(files);
      let fileFilter = []

      for (let i = 0; i < files.length; i++) {
        if (files[i].size != 0) {
          fileFilter.push(files[i])
        }

        console.log(fileFilter);
      }

      setFiles(fileFilter) 

      // for (let i = 0; i < files.length; i++) {
      //   const file = files[i];
      //   const reader = new FileReader();

      //   reader.readAsDataURL(file);

      //   reader.onload = () => {
      //     // console.log(reader.result);
      //   };
      // }   
    }
  };


  const CloseFileFun = (index: number) => {

    if (files != null) {

      let fileFilter = []

      for (let i = 0; i < files.length; i++) {
        
        if (i != index) {
          fileFilter.push(files[i])
        }

        console.log(fileFilter);
      } 

      
      if (JSON.stringify(fileFilter) == JSON.stringify([])) {
        setFiles([])
      } else {
        setFiles(fileFilter)
      }
    }

  }


  const AddFileFun = (e: ChangeEvent<HTMLInputElement>) => {

    if (e.target.files != null) {
      const filesValue = e.target.files;
      console.log(filesValue);
      let fileFilter = files

      for (let i = 0; i < filesValue.length; i++) {
        if (filesValue[i].size != 0) {
          fileFilter.push(filesValue[i])
        }

        console.log(fileFilter);
      }

      setFiles([...fileFilter]) 
    }

  }






  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaInputRef.current != null) {
      textareaInputRef.current.style.height = 'auto';
      textareaInputRef.current.style.height = `${textareaInputRef.current.scrollHeight + 2}px`;
    }

    setText(e.target.value)
  }
    
  const valueShareId = (e: ChangeEvent<HTMLInputElement>) => {
    setShareId(e.target.value)
  }
    



  const upLoad = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {

      let username = userData?.username
      const token = localStorage?.getItem("token")
      const date = new Date()
      let device = ""
      let dateParse = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`

      const userAgentString = navigator.userAgent;

      if (/iPhone/i.test(userAgentString)) {
        device = "iPhone"
      } else if (/iPad/i.test(userAgentString)) {
        device = "iPad"
      } else if (/iPad/i.test(userAgentString)) {
        device = "iPad"
      } else if (/Android/i.test(userAgentString)) {
        device = "Android"
      } else if (/Windows/i.test(userAgentString)) {
        device = "Windows"
      } else {
        device = ""
      }
    




      if (option == 'Text') {

        if (text != null) {

          console.log(device);
          console.log(username);


          const obj = {
            textValue: text,
            device: device,
            data: dateParse,
            username: username
          }


          const response = await axios.post('http://localhost:7000/api/textLoad/' + shareId, obj, {
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${token}`,
            }
          });

          console.log('Response:', response);

          setShareId("")
          setText("")
          setMessage("Текст отправлены")

        }
        
      } else  if (option == 'File') {
  
        if (files != null) {

          const formData = new FormData();

          for (let i = 0; i < files.length; i++) {
            console.log(files[i]);
            formData.append('files', files[i]); // "files" ключ по которому будут переданы файлы 
          }

          formData.forEach((value, key) => {
            console.log(`${key}:`, value);
          });
  


          console.log(device);
          console.log(username);


          const response = await axios.post('http://localhost:7000/api/fileLoad/' + shareId, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'authorization': `Bearer ${token}`,
              'device': device,
              'data': dateParse,
              'username': username as (string | undefined) 
            }
          });

          console.log('Response:', response);

          setShareId("")
          setText("")
          setFiles([])
          setMessage("Файлы отправлены")

        }
          
      }
        


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
  }





  return (
    <div className={style.sendfile}>

      <div className={style.blockForm}>

        <form className={style.formSendFile} onSubmit={(e) => upLoad(e)}>

          <div className={style.formHead}>

            <div className={style.formIcon}>

              <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M19.6577 21.1413L19.0711 21.7279C18.29 22.509 18.29 23.7753 19.0711 24.5564L19.656 25.1413H54.9996C56.1042 25.1413 56.9996 24.2459 56.9996 23.1413V23.1413C56.9996 22.0367 56.1042 21.1413 54.9996 21.1413H19.6577Z" fill="#008CFF"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M19.0711 24.5564C18.29 23.7753 18.29 22.509 19.0711 21.7279L19.6577 21.1413L27.5563 13.2426C28.3374 12.4616 28.3374 11.1953 27.5564 10.4142V10.4142C26.7753 9.63317 25.509 9.63316 24.7279 10.4142L14.8284 20.3137L13.4142 21.7279C12.6332 22.509 12.6332 23.7753 13.4142 24.5564L14.8284 25.9706L24.7279 35.8701C25.509 36.6511 26.7753 36.6511 27.5564 35.8701V35.8701C28.3374 35.089 28.3374 33.8227 27.5564 33.0416L19.656 25.1413L19.0711 24.5564Z" fill="#008CFF"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M49.3429 48.142L49.9295 47.5554C50.7106 46.7743 50.7106 45.508 49.9295 44.7269L49.3446 44.142H14.001C12.8964 44.142 12.001 45.0374 12.001 46.142V46.142C12.001 47.2466 12.8964 48.142 14.001 48.142H49.3429Z" fill="#96C3FF"/>
                <path d="M49.9295 44.7269C50.7106 45.508 50.7106 46.7743 49.9295 47.5554L49.3429 48.142L41.4443 56.0407C40.6632 56.8217 40.6632 58.088 41.4443 58.8691V58.8691C42.2253 59.6501 43.4916 59.6501 44.2727 58.8691L54.1722 48.9696L55.5864 47.5554C56.3674 46.7743 56.3674 45.508 55.5864 44.7269L54.1722 43.3127L44.2727 33.4132C43.4916 32.6322 42.2253 32.6322 41.4443 33.4132V33.4132C40.6632 34.1943 40.6632 35.4606 41.4443 36.2417L49.3446 44.142L49.9295 44.7269Z" fill="#96C3FF"/>
              </svg>


            </div>

            <div className={style.formTitle}>
              <h2>Отпавить файл</h2>
              <p>Здесь вы можите отправить файл на другое устройства</p>
            </div>

            <div className={style.selectBlock}>
              <select className={style.selectOptionStyle} onChange={(e) => selectFunChange(e)}>
                <option value="File" defaultValue="">Отправить файл</option>
                <option value="Text">Отправить текст</option>
              </select>
            </div>

          </div>

          {
            JSON.stringify(files) != JSON.stringify([]) && option != "Text" ? (
              <div className={style.filePreview}>

                <div className={style.filePreviewTitle}>
                  <h3>Файлы</h3>
                </div>

                <div className={style.filePreviewFiles}>
                  {files.map((file, index) => (
                    <div key={index} className={style.fileItem}>

                      <div className={style.fileInfo}>

                        <div className={style.fileIcon}>

                          <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_103_46)">
                              <path d="M100 100V0H50H37.5L0 37.5V50V100H100Z" fill="white"/>
                              <path d="M50 0H37.5L0 37.5V50H50V0Z" fill="white"/>
                              <path d="M8.53554 28.9645L28.9645 8.53553C32.1143 5.38571 37.5 7.61654 37.5 12.0711V32.5C37.5 35.2614 35.2614 37.5 32.5 37.5H12.0711C7.61654 37.5 5.38572 32.1143 8.53554 28.9645Z" fill="#E4E4E4"/>
                              <path d="M0 37.5L37.5 0V18.75L18.75 37.5H0Z" fill="#E4E4E4"/>
                            </g>

                            <defs>
                              <clipPath id="clip0_103_46">
                              <rect width="100" height="100" rx="5" fill="white"/>
                              </clipPath>
                            </defs>

                          </svg>

                        </div>

                        <div className={style.fileName}>

                          <span>{file.name}</span>

                        </div>


                      </div>


                      <div className={style.fileClose}>
                        <button type="button" onClick={() => CloseFileFun(index)} className={style.buttonFileClose}>
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                        </button>
                      </div>


                    </div>
                    
                  ))}

                  <div className={style.Fileblock}>
                    <button type="button" className={style.styleButton} onClick={() => fileInputAddChange()}>Добавить файл</button>
                  </div>
                  
                </div>
              </div>
            ) : option == "Text" ? (
              <div>
                
              </div>
            ) : (
              <div className={style.notFile}>
                <span>Файлов нет</span>
              </div>
            )
          }

        

          <div className={style.formInputs}>
            {
              option == "Text" ? (
                <textarea ref={textareaInputRef} value={text} placeholder="Введите текст..." onChange={(e) => handleTextChange(e)} className={style.styleTextareaInput}></textarea>
              ) : option == "File" ? (
                <div className={style.Fileblock}>
                  <input type="file" name="files" ref={fileInputRef} onChange={(e) => handleFileChange(e)} className={style.fileInput} required multiple/>
                  <input type="file" name="filesAdd" ref={fileAddInputRef} onChange={(e) => AddFileFun(e)} className={style.fileInput} multiple/>
                  <button className={style.styleButtonFileSelect} type="button" onClick={() => fileInputChange()}>Выбрать файл</button>
                </div>
                
              ) : (
                null
              )
            }
            <input type="tel" value={shareId} name="userId" onChange={(e) => valueShareId(e)} placeholder="id Устройства" className={` ${style.styleInput} `} required/>
          </div>

          <div className={style.formButtons}>
            <button className={style.styleButton} type="submit">Отправить</button>
            <span className={style.message}>{ message }</span>
            <span className={style.error}>{ error }</span>
          </div>

          <div className={style.navExchangeBlock}>

            <div className={style.navExchange}>

              <Link className={`${style.LinkExchange}`} href={'/getfile'}>Получить</Link>
              <Link className={`${style.LinkExchange} ${style.select}`} href={'/sendfile'}>Отправить</Link>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
}
