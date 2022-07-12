var nPlayers=-1,screenId=0; 
let bgCol=new Array(); 
const canvas=document.getElementById('ludoBoard'); 
const ctx=canvas.getContext('2d'); 

function createC(scale) {
    let sq=0; 
if (window.innerWidth<=window.innerHeight) {
    sq=0.95*window.innerWidth;
}
else
{
    sq=0.95*window.innerHeight; 
}
canvas.width=sq; 
canvas.height=sq; 
const side=sq/scale; 
return side; //returns the side length in pixels of each square inside the canvas
}
const side=createC(100);
ctx.scale(side,side); 
//canvas created with a scale of 100*100 square like pixels
canvas.onload=gamePlay(); 

canvas.addEventListener('click',(mE)=>{
    let mX=mE.offsetX/side; 
    let mY=mE.offsetY/side; 
    console.log(mX+"\n"+mY); 
    if (screenId==0 && (mX>=29 && mX<=71) && (mY>=53&&mY<=95)) {
        gameSettings(); 
        screenId=1; 
    }
    
}); 

window.addEventListener('resize',canvasResize);
function canvasResize(){
    clearScreen(); 
    let newSide=createC(100); 
    ctx.scale(newSide,newSide); 
    ctx.restore(); 
    if (screenId==0 && nPlayers==-1) {
        gamePlay(); 
    }
    else if (screenId==1) {
        gameSettings(); 
    }
    else if (screenId==2 && nPlayers!=-1) {
        gameBoard(nPlayers); 
    }
}

function welcomeScreen(){
    //draws screenId->0
    bgCol[0]='#fcf6f5ff'
    ctx.fillStyle=bgCol[0]; 
    ctx.strokeStyle='#caf250'; 
    ctx.fillStyle='black'; 
    //ctx.strokeRect(15,10,70,20); 
    
    let cont='Welcome'; 
    let cont2='To Ludo'; 
    let t=`${cont} ${cont2}`; 
    /*let wsFontface=new FontFace('Lobster Two',url('https://fonts.googleapis.com/css2?family=Bangers&family=Cinzel+Decorative&family=Edu+SA+Beginner&family=IM+Fell+English+SC&family=Lobster+Two&family=Rubik+Mono+One&display=swap'));
    document.fonts.add(wsFontface); */
    ctx.font=`9px Helvetica`; 
    ctx.fillText(t,14,23); 

    //code to do play button
    const homePlay=new Image(); 
    homePlay.onload=function() {
        ctx.drawImage(homePlay,26,50,48,48); 
    }
    homePlay.src='homePlayButton.png';
    ctx.save(); 

    
}

function gameSettings(){
    clearScreen(); 
    bgCol[1]='#f9dc5c';
    ctx.fillStyle=bgCol[1]; 
    ctx.fillRect(0,0,100,100); 
    ctx.fillStyle='#606060'; 
    /*let gsFontface=new FontFace('Edu SA Beginner',url('https://fonts.googleapis.com/css2?family=Bangers&family=Cinzel+Decorative&family=Edu+SA+Beginner&family=IM+Fell+English+SC&family=Lobster+Two&family=Rubik+Mono+One&display=swap')); 
    document.fonts.add(gsFontface); */
    ctx.font='6.5px Helvetica'; 
    ctx.fillText('Number of Players',6,8,88); 
    const opCards=new Array(3); 
    let xStart=[5,55,30]; 
    let yStart=[10,10,55];  
    let cardLen=40; 
    for (let i = 0; i < opCards.length; i++) {
        opCards[i]=new optionCard(2+i,xStart[i],yStart[i],cardLen,1); 
        opCards[i].drawCard(0); 
    }
    canvas.addEventListener('click',(mE)=>{
        let mX=mE.offsetX/side; 
        let mY=mE.offsetY/side; 
        console.log(mX+"\n"+mY); 
        if (screenId==1) {
            for (let index = 0; index < opCards.length; index++) {
                if (mX>=xStart[index] && mX<=(xStart[index]+cardLen) && mY>=yStart[index] && mY<=(yStart[index]+cardLen)) {
                    nPlayers=opCards[index].num; 
                    console.log("\n"+nPlayers);
                    screenId=2;  
                    gameBoard(nPlayers); 
                    break; 
                }
                
            } 
            
            
        }
        
    }); 
}

class optionCard{
    constructor(num,x,y,s,bgID){
        this.num=num; 
        this.x=x; 
        this.y=y;
        this.s=s;
        this.bgID=bgID; 
    }
    drawCard(startAt){
        const colChoices=['#669db3ff','#f0f6f7ff','#a89c94ff','#ff4f58ff']; 
        const backGrad=ctx.createConicGradient((Math.PI/180)*360,this.x+0.5*this.s,this.y+0.5*this.s);
        for(let i=0;i<this.num;i++)
        {
            backGrad.addColorStop(startAt+(i*(1/this.num)),colChoices[i]); 
        } 
        ctx.fillStyle=backGrad; 
        //ctx.fillRect(this.x,this.y,this.s,this.s); 
        roundRect(this.x,this.y,this.s,this.s,15,'#606060',backGrad,bgCol[this.bgID]); 
    }
}
function gameBoard(nP){
    clearScreen(); 
    ctx.fillStyle='#606060';; 
    ctx.font='6.5px Helvetica'; 
    ctx.fillText(`${nP} Players playing`,6,8); 

}

function clearScreen(){
    ctx.fillStyle='white'; 
    ctx.fillRect(0,0,100,100); 
}
function gamePlay(){
    welcomeScreen(); 
    ctx.save(); 
}
function roundRect(x,y,wid,high,pCent,strCol,fillCol,BGCol){
    let w1=(pCent/100)*Math.min(wid,high); 
    let stW=wid-(2*w1),stH=high-(2*w1); 
    let stX=[x+w1,x+wid,x+wid-w1,x,x+w1]; 
    let stY=[y,y+w1,y+high,y+high-w1,y]; 
    let xMov=[1,0,-1,0]; 
    let yMov=[0,1,0,-1]; 
    
    let mainPath = new Path2D(); 
    
    for (let i = 0; i < 4; i++) {
        mainPath.moveTo(stX[i],stY[i]); 
        mainPath.lineTo(stX[i]+(xMov[i]*stW),stY[i]+(yMov[i]*stH)); 
        mainPath.arcTo(stX[i]+(xMov[i]*(w1+stW)),stY[i]+(yMov[i]*(w1+stH)),stX[i+1],stY[i+1],w1); 
    }
    mainPath.moveTo(stX[4],stY[4]); //to return to starting pos to fix bugs
    mainPath.closePath(); 

    ctx.beginPath(); 
    ctx.fillStyle=fillCol; 
    ctx.fillRect(x,y,wid,high); 
    ctx.closePath(); 
    
    let transPath = new Path2D(); 
    for (let i = 0; i < 4; i++) {
        transPath.moveTo(stX[i]+(xMov[i]*stW),stY[i]+(yMov[i]*stH)); 
        transPath.arcTo(stX[i]+(xMov[i]*(w1+stW)),stY[i]+(yMov[i]*(w1+stH)),stX[i+1],stY[i+1],w1);
        transPath.moveTo(stX[i+1],stY[i+1]); 
        transPath.lineTo(stX[i]+(xMov[i]*(w1+stW)),stY[i]+(yMov[i]*(w1+stH))); 
        transPath.lineTo(stX[i]+(xMov[i]*stW),stY[i]+(yMov[i]*stH)); 
    }
    transPath.moveTo(stX[0]+(xMov[0]*stW),stY[0]+(yMov[0]*stH)); //to return to starting pos to fix bugs
    transPath.closePath(); 
    ctx.fillStyle=BGCol; 
    ctx.strokeStyle=BGCol; 
    ctx.stroke(transPath); 
    ctx.fill(transPath); 
    
    //dont distub below
    ctx.strokeStyle=strCol; 
    ctx.stroke(mainPath);
}
class Player{
    constructor(playerName,startPos,endPos,nTokens,tokenStat,tokenCol){
        this.playerName=playerName; 
        this.startPos=startPos; 
        this.endPos=endPos; 
        this.nTokens=nTokens; 
        this.tokenStat=tokenStat; 
        this.tokenCol=tokenCol; 
    }
    drawPlayerLocker(x,y,Wid,High)
    {
        roundRect(x,y,Wid,High,20,this.tokenCol,'#fof6f7ef'); 
    }
}

class token{
    constructor(playerInd,inLocker,onBoardPos){
        this.playerInd=playerInd; 
        this.onBoardPos=onBoardPos; 
        this.inLocker=inLocker; 
    }
    drawToken(){}
}

class onBoardSquare{
    constructor(addr,xSt,ySt,side)
    {
        this.addr=addr; 
        this.xSt=xSt; 
        this.ySt=ySt; 
        this.side=side; 
    }
    drawSq(x,y,side,){
        roundRect(x,y,side,side,5,)
    }
}