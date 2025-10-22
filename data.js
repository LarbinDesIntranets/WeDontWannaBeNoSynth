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
var instruments=[];
var currentInstrument={};

instruments=load();
if(instruments.length!=0){
  currentInstrument=instruments[0];
}else{
  currentInstrument = new Synth();
  instruments.push(currentInstrument);
  instruments.push(new Synth());
}

var choixInstrument = document.getElementById("choixInstrument");
choixInstrument.innerHTML="";
for(let i=0;i<instruments.length;i++){
  var option = document.createElement("option");
  option.setAttribute("value",i);
  option.innerText=instruments[i].constructor.name;
  choixInstrument.appendChild(option);
}
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


function save(){

}
function load(){
  return [];
  }