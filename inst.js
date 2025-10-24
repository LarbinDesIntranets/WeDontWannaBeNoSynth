const SequenceModification = Object.freeze({ADDED:0,REMOVED:1,NONE:2,MODIFIED:3});
const NoteFrequencies= [
  A0=>1235.45,
];
class Instrument{
  constructor(){
    this.muted=false;
  }
  sequenceToggle(iSequence,start,time){}
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
      this.sequence[i]=new Array();
    }
  }
  getPisteLength(){
    return this.frequency.length;
  }
  getSampleLength(){
    return this.length;
  }
  sequenceToggle(iSequence,start, time,bouton){
    if(start >= this.length){
      console.log("this.length trop petit " + start+" "+this.length);
      return SequenceModification.NONE;
    }

    let sequence = this.sequence[iSequence];
    for(let i=0;i<sequence.length;i++){
      console.log("check : "+sequence[i][0]+" "+sequence[i][1]+" "+start+" "+time);
      //if remove, return
        console.log('=>'+bouton);
      if((sequence[i][0]<=start && sequence[i][0]+sequence[i][1]>start)){
        console.log("delete");
        if(bouton == Clic.RIGHT){
          this.sequence[iSequence] = this.sequence[iSequence].filter(item => item !== sequence[i]) ;
          return SequenceModification.REMOVED;
        }else{
          if(i<(sequence.length-1) && sequence[i][0]+sequence[i][1]>=sequence[i+1][0]){
            console.log('sibling reject');
            return SequenceModification.NONE;
          }else if((sequence[i][0]+sequence[i][1]+1)>this.length){
            console.log('length reject');
            return SequenceModification.NONE;
          }
            sequence[i][1] = sequence[i][1]+1;
            return SequenceModification.MODIFIED;
        }
      }else if((!(sequence[i][0]<start && sequence[i][0]+sequence[i][1]<=start))
        && (!(sequence[i][0]>=(start+time) && sequence[i][0]+sequence[i][1]>(start+time)))){
          //Do not fit
          return SequenceModification.NONE;
      }
    }
    //add
      console.log("add");
    this.sequence[iSequence].push(new Array(start,time));
    //On remet dans l'ordre
    this.sequence[iSequence].sort(function(a,b){return a[0]-b[0]})
    return SequenceModification.ADDED;
  }
  loop(currentMeasure){
    if(!this.muted){
      for(let i =0;i<this.frequency.length;i++){
        let timeToSend = this.shouldStart(this.sequence[i],currentMeasure%this.length);
        if(null!=timeToSend){
          //console.log("oscillate !");
          this.oscillate(this.frequency[i],timeToSend[0],timeToSend[1]);
        }
      }
    }
  }
  shouldStart(times,tempo){
    for(let i=0;i<times.length && times[i][0]<=tempo;i++){
      let time = times[i];
      if(time[0]==tempo){
        return time;
      }
    }
    return null;
  }
  oscillate(frequency,start,stop){
    //var audioContext = new AudioContext();
    const kickOscillator = ac.createOscillator();
    kickOscillator.type = this.type; // Sine wave for a low-frequency sound
    console.log(this.type);
    kickOscillator.frequency.setValueAtTime(frequency, ac.currentTime); // Starting frequency
    // For the kick drum
    const kickGain = ac.createGain();
    kickGain.gain.value = volume; // Start at full volume
    kickGain.gain.linearRampToValueAtTime(0.001, ac.currentTime + (getTimeInterval()/1000)*stop); // Decay over 0.5 seconds

    kickOscillator.connect(kickGain).connect(ac.destination);
    kickOscillator.start(ac.currentTime);
    //kickOscillator.stop(audioContext.currentTime + (getTimeInterval()/1000)); // Stop after the decay
    console.log("stop at "+ac.currentTime +" "+(ac.currentTime + ((getTimeInterval()/1000)*stop)) + " "+getTimeInterval());
    kickOscillator.stop((ac.currentTime) + ((getTimeInterval()/1000)*stop));
  }
  generatePanel(root){

    //config form
    var f = document.createElement("form");
    f.innerHTML="";
    //muted
    var i = document.createElement("input"); //input element, text
    i.setAttribute('type',"checkbox");
    i.setAttribute("id","instrumentMute");
    i.setAttribute('name',"mute");
    if(this.muted){
      i.setAttribute('checked',"true");
    }
    i.onchange = function(){
      currentInstrument.muted=document.getElementById("instrumentMute").checked;
      console.log(document.getElementById("instrumentMute").checked);
      console.log(currentInstrument.muted);
    }
    f.appendChild(i);
    f.appendChild(document.createElement("br"));
    //length
    i = document.createElement("input"); //input element, text
    i.setAttribute('type',"number");
    i.setAttribute('name',"instLength");
    i.setAttribute("id","instrumentLength");
    i.setAttribute('min',"0");
    i.setAttribute('max',"24");
    i.value=this.length;
    i.onchange = function(){
      let previous = currentInstrument.length;
      currentInstrument.length=document.getElementById("instrumentLength").value;
      //console.log(document.getElementById("instrumentLength").value);
      //console.log(currentInstrument.length);
      while(previous>=currentInstrument.length){
        currentInstrument.sequence.forEach(line => {
          //TODO : A refaire, ne fonctionne pas en foreach je pense
        });
        //console.log(previous+" "+currentInstrument.length);
        previous--;
      }
      redrawSequencer();
    }
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
    i.value=this.type;
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
    i.setAttribute('type',"number");
    i.setAttribute('name',"pistes");
    i.value=this.getPisteLength();
    f.appendChild(i);
    f.appendChild(document.createElement("br"));

    root.innerHTML="";
    root.appendChild(f);


    //

  }
}