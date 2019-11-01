const express = require('express');
const router = express.Router();
const Event = require('../models/events');
const User = require('../models/users');

// Events index
router.get('/', async (req,res)=>{
const currentUser = await User.findById(req.session.userID).populate('Events');
const userEvents = [];
for(let i = 0; i<currentUser.events.length;i++){
    userEvents.push(currentUser.events[i])
}

const events = [];
for(let i = 0; i<currentUser.events.length;i++){
    events.push(await Event.findById(userEvents[i]))
}
res.render('events/index.ejs',{
    events:events
})
})

router.get('/new',async (req,res)=>{
   
    if(req.session.logged){
        res.render('events/new.ejs',{
            host:req.session.userID
        })
    }else{
        res.send('must be logged in')
    }
    
})

router.get('/:id', (req,res)=>{
 Event.findById(req.params.id,(err,foundEvent)=>{
     if(err){
         res.send(err);
     }else{
         res.render('events/show.ejs',{
             event: foundEvent,
             host:req.session.userID
         })
     }
 })

});

router.get('/:id/edit',(req,res)=>{
    Event.findById(req.params.id,(err,foundEvent)=>{
        res.render('events/edit.ejs',{
            event:foundEvent
        })
    })
})

router.post('/', async (req,res)=>{
    try{
        const findUser = await User.findOne({email: req.session.email})
        const createEvent = Event.create(req.body);
        const member = {"username": req.body.username, "role": req.body.role}
        Event.findOneAndUpdate({title: req.body.title},{$push:{members: member}})
        createEvent.host = req.session.userID;
        
        console.log(req.body);
        
        const [foundUser, createdEvent] = await Promise.all([findUser,createEvent]);
        foundUser.events.push(createdEvent);
        await foundUser.save();
        res.redirect('/events');
    } catch(err){
        console.log('error')
        res.send(err)
    }
});

router.delete('/:id',async (req,res)=>{
    try{
        const deleteEvent = Event.findByIdAndRemove(req.params.id);
        const findUser = User.findOne({'events':req.params.id});

        const [deletedEventResponse, foundUser] = await Promise.all([deleteEvent,findUser]);
        foundUser.events.remove(req.params.id);
        await foundUser.save()
        res.redirect('/events')
    }catch(err){
        res.send(err);
    }
})

router.put("/:id/ready", async (req,res)=>{
    try{

        const findEvent = await Event.findById(req.params.id);
        findEvent.ready = !findEvent.ready;
        await findEvent.save();
        res.redirect('/events/'+ req.params.id)
    }catch(err){
        res.render(err);
    }
    
})



module.exports = router;