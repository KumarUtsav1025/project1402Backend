const express = require("express");
const router = express.Router();
const Student = require('../models/students');
const Pair = require('../models/pairs');

router.get('/getPair/insta/:insta', async function(req, res){
  try {
      let pair =[];
      const users = await Student.findOne({insta:req.params.insta});
      if(users.gender == 'Male'){
        pair = await Pair.findOne({male: users.id});
      }
      if(users.gender == 'Female'){
        pair = await Pair.findOne({female: users.id});
      }

      const male = await Student.findById(pair.male);
      const female = await Student.findById(pair.female);
      res.status(200).json({ male, female });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/getPair/name/:name', async function(req, res){
  try {
    const pairedIndividuals = [];
    const users = await Student.find({ name: { $regex: new RegExp(req.params.name, "i") } });
    for(const user of users){
      if(user.gender == 'Male'){
        const pair = await Pair.findOne({male: user.id});
        const male = user;
        const female = await Student.findById(pair.female);
        pairedIndividuals.push({ male, female });
      }
      if(user.gender == 'Female'){
        const pair = await Pair.findOne({female: user.id});
        const male = await Student.findById(pair.male);
        const female = user;
        pairedIndividuals.push({ male, female });
      }
    }
    res.status(200).json(pairedIndividuals);

  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.get('/getStudent', async function(req, res){
    try {
        const users = await Student.find();
        res.status(200).json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

router.post('/postStudent', async function(req, res){
    try {
        const {name, insta, age, year, gender, response} = req.body;
        const newStudent = new Student({name, insta, age, year, gender, response});
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

router.post('/postResults', async function(req, res){
    try {
        const {male, female} = req.body;
        const newPair = new Pair({male, female});
        const savedPair = await newPair.save();
        res.status(201).json(savedPair);
      } catch (error) {
        console.error('Error creating pair:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
});

router.get('/getResults', async function(req, res){
    try {
        const pairs = await Pair.find();
        
        // Array to store pairs with corresponding individuals
        const pairedIndividuals = [];
        
        // Iterate through each pair
        for (const pair of pairs) {
            // Find the male and female individuals using their IDs
            const male = await Student.findById(pair.male);
            const female = await Student.findById(pair.female);

            // Add the pair with corresponding individuals to the array
            pairedIndividuals.push({ male, female });
        }

        res.status(200).json(pairedIndividuals);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/getPairs', async function(req, res){
  try {
      const pairs = await Pair.find();

      res.status(200).json(pairs);
  } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;