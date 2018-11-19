// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
Image Classification using Feature Extraction with MobileNet. Built with p5.js
=== */

let featureExtractor;
let classifier;
let video;
let loss;
let attentiveImages = 0;
let distractedImages = 0;
let sleepingImages=0;

function setup() {
  noCanvas();
  // Create a video element
  video = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');
  // Extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet'
  , modelReady);
  featureExtractor.numClasses=3
  // Create a new classifier using those features and give the video we want to use
  classifier = featureExtractor.classification(video);
  // Create the UI buttons
  createButtons();
}

// A function to be called when the model has been loaded
function modelReady() {
  select('#loading').html('Base Model (MobileNet) loaded!');
}

// Add the current frame from the video to the classifier
function addImage(label) {
  classifier.addImage(label);
}

// Classify the current frame.
function classify() {
  classifier.classify(gotResults);
}

// A util function to create UI buttons
function createButtons() {
  // When the Attentive button is pressed, add the current frame
  // from the video with a label of "attentive" to the classifier
  buttonA = select('#attentiveButton');
  buttonA.mousePressed(function() {
    addImage('attentive');
    select('#amountOfAttentiveImages').html(attentiveImages++);
  });

  // When the Dog button is pressed, add the current frame
  // from the video with a label of "distracted" to the classifier
  buttonB = select('#distractedButton');
  buttonB.mousePressed(function() {
    addImage('distracted');
    select('#amountOfDistractedImages').html(distractedImages++);
  });


  buttonC = select('#sleepingButton');
  buttonC.mousePressed(function() {
    addImage('sleeping');
    select('#amountOfSleepingImages').html(sleepingImages++);
  });


  // Train Button
  train = select('#train');
  train.mousePressed(function() {
    classifier.train(function(lossValue) {
      if (lossValue) {
        loss = lossValue;
        select('#loss').html('Loss: ' + loss);
      } else {
        select('#loss').html('Done Training! Final Loss: ' + loss);
      }
    });
  });

  // Predict Button
  buttonPredict = select('#buttonPredict');
  buttonPredict.mousePressed(classify);
}

// Show the results
function gotResults(result) {
  select('#result').html(result);
  classify();
}