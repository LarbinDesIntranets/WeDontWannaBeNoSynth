/**
 * Handling playing buttons
 */
function play(){
  //console.log(isPlaying);
  isPlaying=true;
  intervalLecture=setInterval(loop,getTimeInterval());//time in milliseconds

  //console.log("play");
}
function pause(){
  //console.log(isPlaying);
  isPlaying=false;
  clearInterval(intervalLecture);
  //console.log("pause");
}
function stop(){
  //console.log(isPlaying);
  isPlaying=false;
  cleanCurrentMeasure(currentMeseare);
  currentMeseare=0;
  clearInterval(intervalLecture);
  //console.log("stop");
}
function updateVolume(){
  volume = document.getElementById("volume").value/100;
}
function updateTempo(){
  tempo = document.getElementById("bpm").value;
  beat = document.getElementById("beat").value;
  if(isPlaying){
    clearInterval(intervalLecture);
    intervalLecture=setInterval(loop,getTimeInterval());//time in milliseconds
  }
}
function getTimeInterval(){
  /**
   * 1000 => 1 secondees
   * 60000 => 1 minutes
   *
   * Si 120 bpm => 2 fois/secondes donc 500
   * Si 60 bpm => toutes les secondes donc 1000
   * Si 30 bpm => toutes les 2 secondes donc 2000
   *
   * Donc 60000/bpm le résultat lui-même divisé par le nombre de note par mesure
   */
  return (60000/tempo)/beat;
}
function loop(){
  console.log('loop ' + currentMeseare);
  updateCanvas();
  if(!isMetronomeActivated){
    if(currentMeseare%beat==0){
      //play big metronome sound
      test();
      console.log('bip');
    }else{
      //play little metronome sound
      test(true);
    }
  }
    //frequency=[130.81,138.59,146.83,155.56,164.81,174.61,185,196,207.65,220,233.08,246.96];
    instruments.forEach(i => {
      i.loop(currentMeseare);
    });
    //currentInstrument.loop(currentMeseare);

    //Do the rest of the playabbledelidou
  currentMeseare++;
}
function oscillate(frequency){
  //var audioContext = new AudioContext();
  const kickOscillator = ac.createOscillator();
  kickOscillator.type = 'sine'; // Sine wave for a low-frequency sound
  kickOscillator.frequency.setValueAtTime(frequency*1.5, ac.currentTime); // Starting frequency
  // For the kick drum
  const kickGain = ac.createGain();
  kickGain.gain.value = volume; // Start at full volume
  kickGain.gain.linearRampToValueAtTime(0.001, ac.currentTime + (getTimeInterval()/1000)); // Decay over 0.5 seconds
  kickOscillator.connect(kickGain).connect(analyser).connect(ac.destination);
  kickOscillator.start(ac.currentTime);
  kickOscillator.stop(ac.currentTime + (getTimeInterval()/1000)); // Stop after the decay
}
function test(alternate=false){
  // Example for a kick drum oscillator
  var audioContext = new AudioContext();
const kickOscillator = audioContext.createOscillator();
kickOscillator.type = 'sine'; // Sine wave for a low-frequency sound
kickOscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Starting frequency

// Example for a snare drum oscillator and noise
const snareOscillator = audioContext.createOscillator();
snareOscillator.type = 'sine'; // A carrier oscillator
snareOscillator.frequency.setValueAtTime(600, audioContext.currentTime); // High frequency

const noiseBuffer =  audioContext.createBuffer(
  2,
  audioContext.sampleRate * 2.0,
  audioContext.sampleRate,
);
const noiseSource = audioContext.createBufferSource();
noiseSource.buffer = noiseBuffer;
/*square => très 8 bit
sawtooth => très 8 bit
triangle => comme sine ?
custom => pas comme ça visiblement
*/
// High-pass filter for the noise
const noiseFilter = audioContext.createBiquadFilter();
noiseFilter.type = 'highpass';
noiseFilter.frequency.setValueAtTime(2000, audioContext.currentTime); // High pass frequency

// For the kick drum
const kickGain = audioContext.createGain();
kickGain.gain.value = volume; // Start at full volume
kickGain.gain.linearRampToValueAtTime(0.001, audioContext.currentTime + 0.5); // Decay over 0.5 seconds

// For the snare drum
const snareGain = audioContext.createGain();
snareGain.gain.value = volume; // Start at full volume
snareGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3); // Decay quickly

// For the kick drum
kickOscillator.connect(kickGain).connect(audioContext.destination);
//kickGain.connect(audioContext.destination);

// For the snare drum
snareOscillator.connect(snareGain).connect(audioContext.destination);;
noiseSource.connect(noiseFilter);
noiseFilter.connect(snareGain); // Add noise to the main gain for snare effect
//snareGain.connect(audioContext.destination);
if(!alternate){
  kickOscillator.start(audioContext.currentTime);
  kickOscillator.stop(audioContext.currentTime + 0.6); // Stop after the decay
}else{
  //noiseSource.start(audioContext.currentTime);
  //noiseSource.stop(audioContext.currentTime + 0.6); // Stop the noise too
  snareOscillator.start(audioContext.currentTime);
  snareOscillator.stop(audioContext.currentTime + 0.6);
}

}