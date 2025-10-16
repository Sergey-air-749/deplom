"use client"
import { ChangeEvent, useEffect, useRef, useState } from "react";
import style from "../../../style/getfile.module.css";

import { setAuth, setUserData } from '../../../festures/authSlice'
import { useAppSelector, useAppDispatch, useAppStore } from '../../../components/hooks'


import Link from "next/link";
import axios from "axios";

interface FileItem {
  filename: string;
  text: string;
  data: string;
  id: string;
}

export default function Getfile() {
  const [showPopUp, setShowPopUp] = useState(false)
  const [files, setFiles] = useState<FileItem[]>([])
  const [shareId, setShareId] = useState<String>('')
  const { isAuth, userData } = useAppSelector(state => state.authReducer)
  

  useEffect(() => {
    console.log(files);
  }, [files])

  useEffect(() => {
    console.log('New Share ID is:', shareId);
  }, [shareId])
  
  useEffect(() => {
    if (userData?.shareId != undefined) {
      setShareId(userData?.shareId)
      console.log(shareId);
      pingFileFun()
    } else {
      console.log(2);
    }
    console.log(userData?.shareId);
  }, [userData?.shareId])
  

  const pingFileFun = async () => {

    console.log(1);
  
    try {

      const response = await axios.get('http://localhost:7000/api/pingfiles/' + userData?.shareId)
      console.log(response.data);

      console.log(JSON.stringify(response.data) != JSON.stringify({}) && JSON.stringify(response.data) !=  JSON.stringify([]));
      
      if (JSON.stringify(response.data) != JSON.stringify({}) && JSON.stringify(response.data) != JSON.stringify([])) {
        console.log(4);
        const intervalId2 = setTimeout(() => {
          pingFileFun()
          clearTimeout(intervalId2)
          console.log(intervalId2);
        }, 5000) 
        setFiles(response.data)
        setShowPopUp(true)
      } else {
        console.log(3);
        const intervalId2 = setTimeout(() => {
          pingFileFun()
          clearTimeout(intervalId2)
          console.log(intervalId2);
        }, 5000) 
      }
    
    } catch (error) {
      console.log(error);
        if (axios.isAxiosError(error)) {
            const serverMessage = error
            console.log(serverMessage);
            
            if (serverMessage.response?.data?.msg != undefined) {
              console.log(serverMessage.response?.data?.msg);     
            } else {
              console.log(serverMessage.message)
            }
        }
    } 
    
  }




  const closePopUpFun = () => {
    setShowPopUp(false)
  }





  const fileAcceptFun = async (filename: String, id: String) => {


    try {

      //Получает файл преоброзует его споиащю блоб ии создаёт ссылку

      const response = await axios.get(`http://localhost:7000/api/getFileDownload/${shareId}/${id}`)
      console.log(response.data);

      let link = document.createElement('a');
      link.download = String(filename);

      //v1

      let blob = new Blob([response.data])
      console.log(blob);

      link.href = URL.createObjectURL(blob);
      link.click();

      console.log(link);

    } catch (error) {
      console.log(error);
        if (axios.isAxiosError(error)) {
            const serverMessage = error
            console.log(serverMessage);
            
            if (serverMessage.response?.data?.msg != undefined) {
              console.log(serverMessage.response?.data?.msg);     
            } else {
              console.log(serverMessage.message)
            }
        }
    } 


    console.log({msg:'Файлы загружины'});
    pingFileFun()


    const newFiles = files.filter((item) => item.id != id)

    if (JSON.stringify(newFiles) == JSON.stringify([])) {
      setShowPopUp(false)
    }
    setFiles(newFiles)


  }




  const filesAcceptFun = async () => {

    console.log(String(files[0]?.filename));
    

    for (let i = 0; i < files.length; i++) {

      if (files[i].text != undefined) {

        for (let i = 0; i < files.length; i++) {

          navigator.clipboard.writeText(String(files[i].text))

          const response = await axios.get(`http://localhost:7000/api/getTextDownload/${shareId}/${files[i].id}`)
          console.log(response.data);

        }

      } else if (files[i].filename != undefined) {

        try {

          //Получает файл преоброзует его споиащю блоб ии создаёт ссылку

          const response = await axios.get(`http://localhost:7000/api/getFileDownload/${shareId}/${files[i].id}`)
          console.log(response.data);

          let link = document.createElement('a');
          link.download = String(files[i].filename);

          //v1

          let blob = new Blob([response.data])
          console.log(blob);

          link.href = URL.createObjectURL(blob);
          link.click();
          
          console.log(link);

        } catch (error) {
          console.log(error);
          if (axios.isAxiosError(error)) {
            const serverMessage = error
            console.log(serverMessage);
            
            if (serverMessage.response?.data?.msg != undefined) {
              console.log(serverMessage.response?.data?.msg);     
            } else {
              console.log(serverMessage.message)
            }
          }
        } 

      }
      

      
      // let link = document.createElement('a');
      // link.download = String(files[i].filename);

      // let blob = new Blob([`http://localhost:7000/api/getFileDownload/${shareId}/${files[i].filename}`])
      // link.href = URL.createObjectURL(blob);
      // console.log(blob);

      // console.log(link);
      

      // link.click();
      
    }


    console.log({msg:'Файлы загружины'});
    setShowPopUp(false)
    setFiles([])
    pingFileFun()

  }



  const textCopyFun = async (text: String, id: String) => {
    console.log(text);
    navigator.clipboard.writeText(String(text))
    const response = await axios.get(`http://localhost:7000/api/getTextDownload/${shareId}/${id}`)
    console.log(response.data);

    const newFiles = files.filter((item) => item.id != id)
    if (JSON.stringify(newFiles) == JSON.stringify([])) {
      setShowPopUp(false)
    }
    setFiles(newFiles)
    pingFileFun()
  }










  const filesCancelFun = async () => {
    try {

      setFiles([])
      const response = await axios.get('http://localhost:7000/api/files/cancel/' + userData?.shareId)
      console.log(response.data);
      pingFileFun()
      setShowPopUp(false)
    
    } catch (error) {
      console.log(error);
    } 
  }

  const fileCancelFun = async (id: string) => {
    try {

      const response = await axios.get('http://localhost:7000/api/files/cancel/' + userData?.shareId + '/' +  id)
      console.log(response.data);

      if (JSON.stringify(response.data) == JSON.stringify([])) {
        setShowPopUp(false)
      }

      pingFileFun()

    
    } catch (error) {
      console.log(error);
    } 
  }


  console.log(JSON.stringify(files));
  console.log(JSON.stringify(files) != JSON.stringify([]));



  return (
    <div className={style.getfile}>

      <div className={style.blockForm}>

        <div className={style.formGetfile}>


          <div className={showPopUp != false ? (style.getFilePopUpBackground) : (style.hide)}>

            <div className={style.getFilePopUp}>

              <div className={style.acceptFiles}>

                <header className={style.getFilePopUpHeader}>

                  <h2 className={style.getFilePopUpTitle}>Принять файлы</h2>

                  <button type="button" onClick={() => closePopUpFun()} className={style.buttonFilePopUpClose}>                    
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#FFFFFF"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
                  </button>

                </header>


                <div>

                  {
                    showPopUp != false ? (
                      <div className={style.getFilePopUpItems}>
                        {
                          
                          files.map((file, index) => (

                            file.filename != undefined ? (

                              <div key={index} className={style.fileItem}>

                                <div className={style.fileBlock}>

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
                                    <span>{file.filename}</span>
                                  </div>


                                </div>

                                <div className={style.fileInfo}>
                                  <span className={style.metaData}>{file.data}</span>

                                  <button className={style.styleButtonDownlodeCancel} type="button" onClick={() => fileCancelFun(file.id)}>Откланить</button>
                                  <button className={style.styleButtonDownlode} type="button" onClick={() => fileAcceptFun(file.filename, file.id)}>Скачать</button>
                                </div>
                            
                              </div> 

                            ) : file.text != undefined ? (
                              <div key={index} className={style.textItem}>

                                
                                <div className={style.textBlock}>
                                  <span>{file.text}</span>
                                </div>


                                <div className={style.textInfo}>
                                  <span className={style.metaData}>{file.data}</span>

                                  <button className={style.styleButtonDownlodeCancel} type="button" onClick={() => fileCancelFun(file.id)}>Откланить</button>
                                  <button className={style.styleButtonDownlode} type="button" onClick={() => textCopyFun(file.text, file.id)}>Капировать</button>
                                </div>

                                

                              </div> 
                            ) : (
                              <div></div>
                            )

                                 

                          )) 
                        }
                      </div>
                  
                    ) : (
                      <div></div>
                    )
                  }

                </div>

              </div>

              <div className={style.getFilePopUpButtons}>
                <button type="button" onClick={() => filesCancelFun()} className={style.styleButtonCancel}>Откланить всё</button>
                <button type="button" onClick={() => filesAcceptFun()} className={style.styleButtonAccept}>Принять всё</button>
              </div>



            </div>

          </div>  


          <div className={style.formInfo}>

            <div className={style.formIcon}>

              <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M19.6577 21.1413L19.0711 21.7279C18.29 22.509 18.29 23.7753 19.0711 24.5564L19.656 25.1413H54.9996C56.1042 25.1413 56.9996 24.2459 56.9996 23.1413V23.1413C56.9996 22.0367 56.1042 21.1413 54.9996 21.1413H19.6577Z" fill="#008CFF"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M19.0711 24.5564C18.29 23.7753 18.29 22.509 19.0711 21.7279L19.6577 21.1413L27.5563 13.2426C28.3374 12.4616 28.3374 11.1953 27.5564 10.4142V10.4142C26.7753 9.63317 25.509 9.63316 24.7279 10.4142L14.8284 20.3137L13.4142 21.7279C12.6332 22.509 12.6332 23.7753 13.4142 24.5564L14.8284 25.9706L24.7279 35.8701C25.509 36.6511 26.7753 36.6511 27.5564 35.8701V35.8701C28.3374 35.089 28.3374 33.8227 27.5564 33.0416L19.656 25.1413L19.0711 24.5564Z" fill="#008CFF"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M49.3429 48.142L49.9295 47.5554C50.7106 46.7743 50.7106 45.508 49.9295 44.7269L49.3446 44.142H14.001C12.8964 44.142 12.001 45.0374 12.001 46.142V46.142C12.001 47.2466 12.8964 48.142 14.001 48.142H49.3429Z" fill="#96C3FF"/>
                <path d="M49.9295 44.7269C50.7106 45.508 50.7106 46.7743 49.9295 47.5554L49.3429 48.142L41.4443 56.0407C40.6632 56.8217 40.6632 58.088 41.4443 58.8691V58.8691C42.2253 59.6501 43.4916 59.6501 44.2727 58.8691L54.1722 48.9696L55.5864 47.5554C56.3674 46.7743 56.3674 45.508 55.5864 44.7269L54.1722 43.3127L44.2727 33.4132C43.4916 32.6322 42.2253 32.6322 41.4443 33.4132V33.4132C40.6632 34.1943 40.6632 35.4606 41.4443 36.2417L49.3446 44.142L49.9295 44.7269Z" fill="#96C3FF"/>
              </svg>


            </div>

            <div className={style.formTitle}>
              <h2>Получить файл</h2>
              <p>Здесь вы можете принять файлы с других устройств</p>
            </div>

          </div>


          <div className={style.formData}>
            
            <div className={style.userIdBlock}>
              <p>id Вашего устройства устройства</p>
              {
                userData == null ? (
                  <h2>Загрузка...</h2>
                ) : (
                  <div className={style.userId}>

                    <h2>{userData?.shareId}</h2>

                    {
                      JSON.stringify(files) != JSON.stringify([]) ? (
                        <button type="button"  className={style.openFilePopUp} onClick={() => pingFileFun()}>Открыть список файлов</button>
                      ) : (
                        <div></div>
                      )
                    }

                  </div>
                  
                )

              }
            </div>

          </div>


          <div className={style.navExchangeBlock}>

            <div className={style.navExchange}>

              <Link className={`${style.LinkExchange} ${style.select}`} href={'/getfile'}>Получить</Link>
              <Link className={`${style.LinkExchange}`} href={'/sendfile'}>Отправить</Link>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
