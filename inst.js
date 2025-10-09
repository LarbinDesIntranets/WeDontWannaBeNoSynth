
const SequenceModification = Object.freeze({ADDED:0,REMOVED:1,NONE:2});
class Instrument{
  constructor(){
    this.muted=false;
  }
  sequenceToggle(iSequence,time){}
  loop(currentMeasure){}
  oscillate(frequency){}
  getPisteLength(){}
  getSampleLength(){}
  generatePanel(root){}
}
class Synth extends Instrument{
  constructor(){
    super();
    this.length=16;
    this.frequency=[130.81,138.59,146.83,155.56,164.81,174.61,185,196,207.65,220,233.08,246.96];
    this.sequence = new Array(this.frequency.length);
    this.type="sine";
    for(let i=0;i<this.sequence.length;i++){
      this.sequence[i]=new Set();
    }
  }
  getPisteLength(){
    return this.frequency.length;
  }
  getSampleLength(){
    return this.length;
  }
  sequenceToggle(iSequence,time){
    if(this.sequence[iSequence].has(time)){
      this.sequence[iSequence].delete(time);
      return SequenceModification.REMOVED;
    }else if(time < this.length){
      sequence[iSequence].add(time);
      return SequenceModification.ADDED;
    }
    return SequenceModification.NONE;
  }

  loop(currentMeasure){
    if(!this.muted){
      for(let i =0;i<this.frequency.length;i++){
        if(this.sequence[i].has(currentMeasure%this.length)){
          console.log("oscillate !");
          this.oscillate(this.frequency[i]);
        }
      }
    }
  }

  oscillate(frequency){
    var audioContext = new AudioContext();
    const kickOscillator = audioContext.createOscillator();
    kickOscillator.type = this.type; // Sine wave for a low-frequency sound
    console.log(this.type);
    kickOscillator.frequency.setValueAtTime(frequency, audioContext.currentTime); // Starting frequency
    // For the kick drum
    const kickGain = audioContext.createGain();
    kickGain.gain.value = volume; // Start at full volume
    kickGain.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + (getTimeInterval()/1000)); // Decay over 0.5 seconds
    kickOscillator.connect(kickGain).connect(audioContext.destination);
    kickOscillator.start(audioContext.currentTime);
    kickOscillator.stop(audioContext.currentTime + (getTimeInterval()/1000)); // Stop after the decay
  }
  generatePanel(root){

    //config form
    var f = document.createElement("form");
    f.innerHTML="";
    //muted
    var i = document.createElement("input"); //input element, text
    i.setAttribute('type',"checkbox");
    i.setAttribute('name',"username");
    f.appendChild(i);
    f.appendChild(document.createElement("br"));
    //length
    i = document.createElement("input"); //input element, text
    i.setAttribute('type',"number");
    i.setAttribute('name',"username");
    i.setAttribute('min',"0");
    i.setAttribute('max',"16");
    f.appendChild(i);
    f.appendChild(document.createElement("br"));
    //freq type => select
    i = document.createElement("select"); //input element, text
    i.setAttribute("id","waveType");
    ["sine","square","sawtooth","triangle"].forEach(element => {
      let choice = document.createElement("option");
      choice.value=element;
      choice.innerText=element;
      i.appendChild(choice);
    });
    i.onchange = function(){
      currentInstrument.type=document.getElementById("waveType").value;
      console.log(document.getElementById("waveType").value);
      console.log(currentInstrument.type);
    }

    //i.setAttribute('type',"text");
    //i.setAttribute('name',"username");
    f.appendChild(i);
    f.appendChild(document.createElement("br"));
    //vol ? => range
    i = document.createElement("input"); //input element, text
    i.setAttribute('type',"text");
    i.setAttribute('name',"username");
    f.appendChild(i);
    f.appendChild(document.createElement("br"));
    //Hertz Range => iterate
    i = document.createElement("input"); //input element, text
    i.setAttribute('type',"text");
    i.setAttribute('name',"username");
    f.appendChild(i);
    f.appendChild(document.createElement("br"));
    //number of line
    i = document.createElement("input"); //input element, text
    i.setAttribute('type',"text");
    i.setAttribute('name',"username");
    f.appendChild(i);
    f.appendChild(document.createElement("br"));

    root.innerHTML="";
    root.appendChild(f);


    //

  }
}