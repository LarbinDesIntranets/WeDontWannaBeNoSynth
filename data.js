  /**
   * Global variables
   */
  var isPlaying=false;
  var tempo=75;
  var beat=1;
  var volume=1;
  var currentMeseare=0;
  var intervalLecture;
  var isMetronomeActivated=true;

  var currentInstrument={};
  currentInstrument = new Synth();

  const cellWidth = 50;
const cellHeigth = 20
var canvas = document.getElementById("myCanvas");
var width = canvas.width;
var max_height = canvas.height;
var ctx = canvas.getContext("2d");
var defaultLength=currentInstrument.getSampleLength();
console.log(defaultLength);
var ac = new AudioContext();
var piste = currentInstrument.sequence;
var height=piste.length*cellHeigth;
currentInstrument.generatePanel(document.getElementById("effectControlZone"));


const oscilloscope = document.getElementById("oscilloscope");
var oscilloscope_ctx = oscilloscope.getContext("2d");

var analyser = new AnalyserNode(
    ac,{smoothingTimeConstant:1,fftSize:2048}
  );
  var dataArray=new Uint8Array(analyser.frequencyBinCount);
