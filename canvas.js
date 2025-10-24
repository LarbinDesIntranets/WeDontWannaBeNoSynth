const Clic = Object.freeze({RIGHT:1,LEFT:2});

function drawCanvas(){
  canvas.height=currentInstrument.getPisteLength()*cellHeigth;
  canvas.width=currentInstrument.getSampleLength()*cellWidth;
  timeArrow.height=canvas.height;
  timeArrow.width=canvas.width;

  arrow_ctx.beginPath();
  arrow_ctx.moveTo(0,0);
  arrow_ctx.strokeStyle="purple";
  arrow_ctx.lineWidth =3;
  arrow_ctx.lineTo(0,timeArrow.height);
  arrow_ctx.stroke();
  console.log("=>"+canvas.height+" "+canvas.width);
  var x=0;
  ctx.beginPath();
  while(x<=currentInstrument.getSampleLength()*cellWidth){
    ctx.moveTo(x,0);
    ctx.lineTo(x,canvas.height);
    x+=cellWidth;
  }
  var y=0;
  while(y<=canvas.height){
    ctx.moveTo(0,y);
    ctx.lineTo(canvas.width,y);
    y+=cellHeigth;
  }
  //ctx.fillRect(100,50, 50,50);
  ctx.stroke();
  //Coloriage
  for(let i=0;i<currentInstrument.sequence.length;i++){
    if(currentInstrument.sequence[i].length>0){
      cUpdateLine(i);
    }
  }
}
drawCanvas();
setupOscillator();
function cleanCurrentMeasure(currentMeasure){
  //draw activated column
  drawColumn(currentMeseare%currentInstrument.getSampleLength()==0?currentInstrument.getSampleLength()-1:currentMeseare%currentInstrument.getSampleLength()-1,"white","black","dodgerblue");

  //drawColumn(currentMeasure%currentInstrument.getSampleLength(),"green","black","dodgerblue");
}
function setupOscillator(){
  oscilloscope.width=window.innerWidth/2;
  oscilloscope.height=window.innerHeight/2;

  let pixelRatio = window.devicePixelRatio;
  oscilloscope.style.width = oscilloscope.width/pixelRatio+"px";
  oscilloscope.style.height = oscilloscope.height/pixelRatio+"px";
  oscilloscope_ctx.fillStyle="#181818";
  console.log(oscilloscope.width+" "+oscilloscope.height);
  oscilloscope_ctx.fillRect(0,0,oscilloscope.width,oscilloscope.height);
  oscilloscope_ctx.strokeStyle="#33ee55";
  oscilloscope_ctx.beginPath();

  let segmentWidth = oscilloscope.width / analyser.frequencyBinCount;


  oscilloscope_ctx.moveTo(0,oscilloscope.height/2);

  oscilloscope_ctx.lineTo(oscilloscope.width,oscilloscope.height/2);
  oscilloscope_ctx.stroke();

}
function updateCanvas(){
  //reset previous activated column
  drawColumn(currentMeseare%currentInstrument.getSampleLength()==0?currentInstrument.getSampleLength()-1:currentMeseare%currentInstrument.getSampleLength()-1,"#F9E6CF","black","#DA498D");
  //draw activated column
  drawColumn(currentMeseare%currentInstrument.getSampleLength(),"#FAC67A","black","#69247C");
}
function drawColumn(iColumn, backColor, borderColor, activatedColor){
  //color back
  ctx.fillStyle = backColor;
  ctx.fillRect((iColumn*cellWidth)+1,1, cellWidth-2,cellHeigth*piste.length-2);
  //color active cells
  ctx.fillStyle =  activatedColor;
  for(let i=0;i<piste.length;i++){
    if(piste[i].has(iColumn)){
      ctx.fillRect((iColumn*cellWidth)+1,(i*cellHeigth)+1, cellWidth-2,cellHeigth-2);
      //add sound to play
    }
  }
  //vertical lines
  ctx.beginPath();
  ctx.moveTo(iColumn*cellWidth,0);
  ctx.lineTo(iColumn*cellWidth,cellHeigth*piste.length);
  ctx.moveTo(iColumn*cellWidth+cellWidth,0);
  ctx.lineTo(iColumn*cellWidth+cellWidth,cellHeigth*piste.length);
  //horizontal lines
  var y=0;
  while(y<height && cellHeigth*piste.length>=y){
    ctx.moveTo(iColumn*cellWidth,y);
    ctx.lineTo(iColumn*cellWidth+cellWidth,y);
    y+=cellHeigth;
  }
  ctx.stroke();
}
function getCursorPosition(canvas, event) {
  console.log(event);
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  var bouton = event.buttons; //1=>gauche ; 2=> droit
  //console.log("x: " + x + " y: " + y);
  var iPiste =Math.floor(y/cellHeigth);
  //console.log(iPiste);
  if(iPiste<piste.length){
    var timing = Math.floor(x/cellWidth);
    if(SequenceModification.NONE!=currentInstrument.sequenceToggle(iPiste,timing,Math.floor(Math.random()*2)+1)){
      cUpdateLine(iPiste);
    }
    //drawCanvas();
    /*if(piste[iPiste].has(timing)){
      piste[iPiste].delete(timing);
      ctx.fillStyle = '#F9E6CF';
      ctx.fillRect((timing*cellWidth)+1,(iPiste*cellHeigth)+1, cellWidth-2,cellHeigth-2);
    }else if(timing < currentInstrument.getSampleLength()){
      piste[iPiste].add(timing);
      ctx.fillStyle = "#DA498D";
      ctx.fillRect((timing*cellWidth)+1,(iPiste*cellHeigth)+1, cellWidth-2,cellHeigth-2);
    }*/
  }
}
function cUpdateLine(iPiste){
  console.log("drawing?");
  //fill background color
  ctx.fillStyle = '#F9E6CF';
  ctx.fillRect(1,(iPiste*cellHeigth)+1, (currentInstrument.getSampleLength()*cellWidth)-2,cellHeigth-2);
  //draw vertical lines
  var x=0;
  ctx.beginPath();
  while(x<=currentInstrument.getSampleLength()*cellWidth){
    ctx.moveTo(x,iPiste*cellHeigth);
    ctx.lineTo(x,(iPiste+1)*cellHeigth);
    //console.log("Line to : "+x+' '+(iPiste*cellHeigth)+' '+((iPiste+1)*cellHeigth));
    x+=cellWidth;
  }
  ctx.stroke();
  //draw activated zone
  ctx.fillStyle = "dodgerblue";
  for(let i=0;i<currentInstrument.sequence[iPiste].length;i++){
    let note = currentInstrument.sequence[iPiste][i];
    ctx.fillRect((note[0]*cellWidth)+1,(iPiste*cellHeigth)+1, (note[1]*cellWidth)-2,cellHeigth-2);
  }
  console.log("drawed");
}
function activateCell(x,y){
  ctx.fillStyle = "dodgerblue";
  ctx.fillRect((x*cellWidth)+1,(y*cellHeigth)+1, cellWidth-2,cellHeigth-2);
}
canvas.addEventListener('mousedown', function(e) {
    getCursorPosition(canvas, e)
});
/*canvas.addEventListener('onclick', function(e) {
    getCursorPosition(canvas, e)
})*/

const drawOscilloscope = () => {
	analyser.getByteTimeDomainData(dataArray);
	segmentWidth = oscilloscope.width / analyser.frequencyBinCount;
	oscilloscope_ctx.fillRect(0, 0, oscilloscope.width, oscilloscope.height);
	oscilloscope_ctx.beginPath();
	oscilloscope_ctx.moveTo(-100, oscilloscope.height / 2);
	if (isPlaying) {
		for (let i = 1; i < analyser.frequencyBinCount; i += 1) {
			let x = i * segmentWidth;
			let v = dataArray[i] / 128.0;
			let y = (v * oscilloscope.height) / 2;
			oscilloscope_ctx.lineTo(x, y);
		}
	}
	oscilloscope_ctx.lineTo(oscilloscope.width + 100, oscilloscope.height / 2);
	oscilloscope_ctx.stroke();
	requestAnimationFrame(drawOscilloscope);
};
drawOscilloscope();
function changeInstrument(){
  //get new instrument
  var choix = document.getElementById("choixInstrument").value;
  currentInstrument = instruments[choix];
  redrawSequencer();
  //??µ
  defaultLength=currentInstrument.getSampleLength();
  piste = currentInstrument.sequence;
  height=piste.length*cellHeigth;
  currentInstrument.generatePanel(document.getElementById("effectControlZone"));
}
function cMoveArrow(){
  arrow_ctx.clearRect(0, 0, timeArrow.width, timeArrow.height);
  arrow_ctx.beginPath();
  arrow_ctx.moveTo(arrowPos,0);
  arrow_ctx.strokeStyle="purple";
  arrow_ctx.lineWidth =3;
  arrow_ctx.lineTo(arrowPos,timeArrow.height);
  arrow_ctx.stroke();
  arrowPos+=arrowDelta;
  arrowPos=arrowPos%timeArrow.width;
}
function redrawSequencer(){
  //cleanRect
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  //drawCanvas
  drawCanvas();
}