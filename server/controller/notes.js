const Notes = require('../models/Notes')
const { createError } = require('../utils/error')
const jwt = require('jsonwebtoken')

//fetch particular user's notes

exports.fetchNote = async (req, res, next) => {
    try {
        
            const token = req.headers.authorization.split(" ")[1];
            let decodedData = jwt.verify(token, process.env.JWT);
            const userId = decodedData?.id;
        
        //     const notes = await Notes.find(
        //         {userid:userId}
        // );
        
        const page = parseInt(req.query.page) || 1;
        const pageSize = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * pageSize;
        const total =await Notes.find(
            {userid:userId}
    ).countDocuments();
        const pages = Math.ceil(total / pageSize);

        let query = await Notes.find(
            {userid:userId}
    ).skip(skip).limit(pageSize);

        const result = await query;

       

        res.status(200).json({
            page,
            pages,
            count: result.length,
            data: result
            });
       

        
        
    }
    catch (err)
    {
        next(createError(400,err));
    }
}

//create notes

exports.createNote = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        let decodedData = jwt.verify(token, process.env.JWT);
        const userId = decodedData?.id;

        const newNote = new Notes({
            title: req.body.title,
            description: req.body.description,
            userid:userId
        })
        const savedNote = await newNote.save()
        res.status(200).json(savedNote);
    }
    catch (err)
    {
        next(createError(400, err));
    }
}

// delete note

exports.deleteNote = async (req, res, next) => {
    try {
        await Notes.findByIdAndDelete(req.params.id);
        res.status(200).json("User suceesfully deleted");
    }
    catch (err)
    {
        next(createError(400, err));
    }
}

// update note

exports.updatenote = async (req, res, next) => {
    try {
        const updateNote = await Notes.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.status(200).json(updateNote);
    }
    catch (err)
    {
        next(createError(400, err));
    }
}

// get one note

exports.getNote = async (req, res, next) => {
    try {
        const note = await Notes.findById(
            req.params.id
        );
        res.status(200).json(note);
    }
    catch (err)
    {
        next("fetch one error");
    }
}