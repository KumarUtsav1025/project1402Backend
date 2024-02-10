const express = require("express");
const router = express.Router();
const Student = require('../models/students');
const Pair = require('../models/pairs');

router.get('/getStudent/:insta', async function(req, res){
  try {
      const users = await Student.findOne({insta:req.params.insta})
      res.status(200).json(users);
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


module.exports = router;