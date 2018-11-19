/* ===
ml5 Example
Image Classification using Feature Extraction with MobileNet. Built with p5.js
This example uses a callback pattern to create the classifier
=== */

let featureExtractor;
let classifier;
let video;
let loss;
let dogImages = 0;
let catImages = 0;

function setup() {
  noCanvas();
  // Create a video element
  video = createCapture(VIDEO);
  // Append it to the videoContainer DOM element
  video.parent('videoContainer');
  // Extract the already learned features from MobileNet
  featureExtractor = ml5.featureExtractor('MobileNet', modelReady,{   
  version: 1,
  alpha: 1.0,
  topk: 3,
  learningRate: 0.0001,
  hiddenUnits: 400,
  epochs: 40,
  numClasses: 2,
  batchSize: 0.4,
});
  // Create a new classifier using those features and give the video we want to use
  classifier = featureExtractor.classification(video, videoReady);
  // Set up the UI buttons
  setupButtons();
}

// A function to be called when the model has been loaded
function modelReady() {
  select('#modelStatus').html('Base Model (MobileNet) Loaded!');
  classifier.load('./model/model.json', function() {
    select('#modelStatus').html('Custom Model Loaded!');
  });
}

// A function to be called when the video has loaded
function videoReady () {
  select('#videoStatus').html('Video ready!');
}

// Classify the current frame.
function classify() {
  classifier.classify(gotResults);
}

// A util function to create UI buttons
function setupButtons() {
  // When the Cat button is pressed, add the current frame
  // from the video with a label of "cat" to the classifier
  buttonA = select('#YogaAButton');
  buttonA.mousePressed(function() {
    classifier.addImage('YogaA');
    select('#amountOfYogaAImages').html(YogaAImages++);
  });

  // When the Dog button is pressed, add the current frame
  // from the video with a label of "dog" to the classifier
  buttonB = select('#YogaBButton');
  buttonB.mousePressed(function() {
    classifier.addImage('YogaB');
    select('#amountOfYogaBImages').html(YogaBImages++);
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

  // Save model
  saveBtn = select('#save');
  saveBtn.mousePressed(function() {
    classifier.save();
  });

  // Load model
  loadBtn = select('#load');
  loadBtn.changed(function() {
    classifier.load(loadBtn.elt.files, function(){
      select('#modelStatus').html('Custom Model Loaded!');
    });
  });
}

// Show the results
function gotResults(err, result) {
  // Display any error
  if (err) {
    console.error(err);
  }
  select('#result').html(result);
  classify();
}