const express = require('express')  
const mongoose = require('mongoose')  
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const router = express.Router()
require('dotenv').config();
const path = require('path');

const Users = require('../moduls/users')

const authMidelwares = require('../midelwares/authMidelwares')
const multer = require('multer')

router.get('/getUserData', authMidelwares, async (req, res, next) => {
    const userId = req.userId

    try {
        const user = await Users.findOne({_id: userId})
        console.log(user);
        res.json(user)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
});


router.get('/images/avatars/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const usersAvatars = path.join(__dirname, '../avatars', `${id}.png`)
        console.log(usersAvatars);
        res.sendFile(usersAvatars)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
});









const generateFilename = (fileName) => {
    const randomNameId = Math.floor(Math.random() * 9999999999)

    const lastDotIndex = fileName.lastIndexOf('.');

    if (lastDotIndex === -1 || lastDotIndex === 0) {
        return `${randomNameId}`;
    }

    const fileExtension = fileName.substring(lastDotIndex + 1)

    console.log(`${randomNameId}.${fileExtension}`);
    return `${randomNameId}.${fileExtension}`;
}


    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            const pathFiles = path.join(__dirname, '../files')
            console.log(pathFiles);
            cb(null, pathFiles)
        },
        filename: function (req, file, cb) {
            console.log(file);
            cb(null, generateFilename(file.originalname))
        }
        
    })


const upload = multer({
    storage: storage,
    limits: { 
        fileSize: 1024 * 1024 * 100000
    }
})



router.post('/fileLoad/:id/', upload.array('files'), authMidelwares, async (req, res) => {
    try {

        const userId = req.userId
    
        const { id } = req.params
        const { data, device, username } = req.headers

        // console.log(id);  
        // console.log(device);  
        // console.log(data);  
        // console.log(username);

        // console.log(req.files);

        const user = await Users.findOne({shareId: id})
        const sentToUsername = await Users.findOne({_id: userId})

        req.files.forEach((item, index) => {

            const obj = {
                id: Math.floor(Math.random() * 9999999999),
                filename: item.filename,
                sentFromDevice: device,
                data: data,
                sentToUsername: username
            }

            console.log(obj);

            user.filse.push(obj)
            sentToUsername.filseStorySend.push(obj)
        })

        console.log(user);
        await user.save()
        await sentToUsername.save()


        res.status(200).send({msg:'Файлы успешно загружены!'});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message})
    }
});


router.post('/textLoad/:id', authMidelwares, async (req, res) => {

    console.log(req.body);

    try {
        const { id } = req.params
        const { textValue, data, device, username } = req.body
        const userId = req.userId

        const user = await Users.findOne({shareId: id})
        const sentToUsername = await Users.findOne({_id: userId})

        const obj = {
            id: Math.floor(Math.random() * 9999999999),
            text: textValue,
            sentFromDevice: device,
            data: data,
            sentToUsername: username
        }

        console.log(obj);

        user.filse.push(obj)
        sentToUsername.filseStorySend.push(obj)

        console.log(user);
        await user.save()
        await sentToUsername.save()


        res.status(200).send({msg:'Текст успешно загружены!'});
    } catch (error) {
        console.log(error);
        res.status(500).json({msg: error.message})
    }
});










router.get('/pingfiles/:shareId', async (req, res) => {  // <--- Добавить authMidelwares
    try {
        const { shareId } = req.params
        const user = await Users.findOne({shareId: shareId})
        
        console.log(JSON.stringify(user.filse));  
        res.send(user.filse);
    } catch (error) {
        console.log(error);  
        res.send(error);
    }
});


router.get('/getFileDownload/:shareId/:fileId', async (req, res) => {
    try {
        console.log(req.params);
        
        const { shareId, fileId } = req.params
    
        const userShareId = await Users.findOne({shareId: shareId})
        const filse = userShareId.filse

        const getFile = filse.find((item) => item.id == fileId)
        const deleteFile = filse.filter((item) => item.id != fileId)
        
        console.log("filse: " + JSON.stringify(filse));

        console.log("====================================================\n\n");
        console.log("findFile (getFile)");
        console.log(getFile);
        console.log("====================================================");
        console.log("deleteFile");
        console.log(deleteFile);
        console.log("====================================================\n\n");
        
        if (getFile != undefined) {
            userShareId.filseStoryGet.push(getFile)
            userShareId.filse = deleteFile
            await userShareId.save()

            const pathFiles = path.join(__dirname, '../files', getFile.filename)

            res.sendFile(pathFiles);
        } else {
            res.send({msg:'Файл не найден'});
        }
    } catch (error) {
        console.log(error);  
        res.status(500).send(error);
    }
});



router.get('/getTextDownload/:shareId/:textId', async (req, res) => {
    try {
        const { shareId, textId } = req.params

        const user = await Users.findOne({shareId: shareId})
        const filse = user.filse

        const deleteText = filse.filter((item) => item.id != textId)
        const getText = filse.find((item) => item.id == textId)
        
        console.log("filse: " + JSON.stringify(filse));

        console.log("====================================================\n\n");
        console.log(deleteText);
        console.log("====================================================");
        console.log(getText);
        console.log("====================================================\n\n");
        
        if (getText != undefined) {
            user.filseStoryGet.push(getText)
            user.filse = deleteText
            await user.save()

            res.send({msg:'Текст принет'});
        } else {
            res.send({msg:'Текст не найден'});
        }
    } catch (error) {
        console.log(error);  
        res.status(500).send(error);
    }
});

router.get('/files/cancel/:shareId', async (req, res) => {  // <--- Добавить authMidelwares
    try {
        const { shareId } = req.params
        const user = await Users.findOne({shareId: shareId})
        user.filse = []
        await user.save()
        
        res.send({msg: 'Загрузка отменена'});
    } catch (error) {
        console.log(error);  
        res.send(error);
    }
});


router.get('/files/cancel/:shareId/:id', async (req, res) => {  // <--- Добавить authMidelwares
    try {
        const { shareId, id } = req.params
        const user = await Users.findOne({shareId: shareId})
        const newFilse = user.filse.filter((item) => item.id != id)
        user.filse = newFilse
        await user.save()
        
        res.send({msg: 'Загрузка отменена'});
    } catch (error) {
        console.log(error);  
        res.send(error);
    }
});






























router.post('/signup', async (req, res) => {
    try {
        const {email, username, password} = req.body

        console.log(req.body);
        

        const existingUserEmail = await Users.findOne({email})
        console.log(existingUserEmail);

        const existingUserUsername = await Users.findOne({username})
        console.log(existingUserUsername);

        if (existingUserEmail != null) {
            res.status(400).json({msg: "Полизователь уже существует"})
            
        } else if (existingUserUsername != null) {
            res.status(400).json({msg: `Имя пользователя ${username} уже зането`})
            
        } else {
            const hashed = await bcrypt.hash(password, 10)
            const shareId = Math.floor(Math.random() * 99999999)

            const newUser = new Users(
                {
                    email: email,
                    username: username, 
                    password: hashed,
                    shareId: shareId,
                    avatar: { '400': "http://localhost:7000/api/images/avatars/default", '1000': "http://localhost:7000/api/images/avatars/default" }
                }
            )
            await newUser.save()
            console.log(newUser);

            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"})
            res.json({token: token})

        }

    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

router.post('/login', async (req, res) => {
    try {
        const {email, username, password} = req.body

        if (email == '') {
            const loginInUsername = await Users.findOne({username})
            examinationUser(loginInUsername)
        } else if (username == '') {
            const loginInEmail = await Users.findOne({email})
            examinationUser(loginInEmail)
        }

        async function examinationUser(Users) {
            if (!Users) {
                if (email == '') {
                    res.status(400).json({msg: "Неверное имя пользователя"})
                } else if (username == '') {
                    res.status(400).json({msg: "Неверная Почта"})       
                }
            } else {
                const passwordValed = await bcrypt.compare(password, Users.password)
                console.log(passwordValed);

                if (passwordValed != false) {
                    const token = jwt.sign({id: Users._id}, process.env.JWT_SECRET_KEY, {expiresIn: "1h"})
                    res.json({token: token})
                } else {
                    res.status(400).json({msg: "Не верный пароль"})
                }

            }
        }

    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router;