const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const middleware = require('./middleware/user_middleware')
const {UserController,TasksController,MediumController,SectionController,InboxController,LogController} = require('./controller/index')


app.use(UserController.helper.path, express.static(UserController.helper.express_path));
app.use(bodyParser.json())


app.post('/profile', UserController.helper.upload.single('avatar'), UserController.post);
app.get('/profile',middleware.superUser,UserController.get);
app.post('/profile/login',UserController.login)
app.put('/profile',middleware.anyMember,UserController.update)


//============== End Of Profile Section ============


app.get('/task',middleware.anyMember,TasksController.get)
app.post('/task',middleware.superUser,TasksController.post)
app.put('/task',middleware.anyMember,TasksController.update)


//============== End Of Task Section ============

app.get('/section',middleware.anyMember,SectionController.get)
app.post('/section',UserController.helper.upload.single('template'),SectionController.post)
app.put('/section',UserController.helper.upload.single('template'),SectionController.update)

//============== End Of Section Section :D ============


app.get('/medium',MediumController.get)
app.post('/medium',UserController.helper.upload.single('medium'),MediumController.post)
app.put('/medium',MediumController.update)

//============== End Of Medium Section  ============


app.get('/log',middleware.anyMember,LogController.get)

//============== End Of Log Section :D ============


app.get('/inbox',middleware.anyMember,InboxController.get)
app.post('/inbox',middleware.superUser,InboxController.post)
app.put('/inbox',middleware.anyMember,InboxController.update)

//============== End Of Inbox Section :D ============


app.listen(3000, () => console.log('Example app listening on port 3000!'))