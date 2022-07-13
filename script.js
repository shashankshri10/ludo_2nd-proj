var nPlayers=-1,screenId=0; 
let bgCol=new Array(); 
let gameArr=new Array(6); 
for (let c=0;c<6;c++){gameArr[c]=new Array(6);}
let playerArr=new Array(); 

const belowBoard=document.getElementById('secondScreen'); 

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
    //ctx.restore(); 
    if (screenId==0 && nPlayers==-1) {
        gamePlay(); 
    }
    else if (screenId==1 || screenId==1.5) {
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

    //insert code to make below board invisible
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
                    let rot=2; 
                    let ani=window.setInterval(function(nPlayers){
                        console.log("Exe"); 
                        opCards[index].drawCard(1+rot); 
                        rot+=2; 
                    },75); 
                    let clearAni=window.setTimeout(function(){
                        window.clearInterval(ani); 
                        ani=null;
                        belowBoard.className=null; 
                    },10000); 
                    screenId=1.5; 
                    playerInfoGet(nPlayers); 
                     
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
            backGrad.addColorStop(((startAt%241)/1000)+(i*(1/this.num)),colChoices[i]); 
        } 
        ctx.fillStyle=backGrad; 
        //ctx.fillRect(this.x,this.y,this.s,this.s); 
        roundRect(this.x,this.y,this.s,this.s,15,1,'#606060',backGrad,bgCol[this.bgID]); 
        ctx.font='20px Stencil'; 
        ctx.fillStyle='black'; 
        ctx.textAlign='center'; 
        ctx.textBaseline='middle';
        ctx.fillText(this.num,this.x+0.5*this.s,this.y-3.5+0.5*this.s);
    }
}
function playerInfoGet(num){
    console.log(num); 
    let inptID=new Array(4); 
    let playerDeetsHTML=`<p align="center">Enter Player Details</p>`; 
    for (let i=0;i<4;i++)
    {
        inptID[i]=`pl${i+1}Name`; 
        playerDeetsHTML+=`<br><div class="inF"><input type="text" placeholder="PLayer ${i+1} name" id="${inptID[i]}" class="nmBox">`; 
        playerDeetsHTML+=`<label for="${inptID[i]}" id="lbl${i+1}"></label></div><br>`; 
    }
    playerDeetsHTML+=`<br><div class="inF"><button id="stGameButt">Start Game</button></div>`; 
    belowBoard.innerHTML=playerDeetsHTML; 
    let inputEl=document.querySelectorAll('.nmBox'); //generate static nodelist of all text input elements
    let startArr=[gameArr[0][0],gameArr[0][5],gameArr[5][5],gameArr[5][0]]; 
    let tcArr=['#ed254eff','#f9dc5cff','#a13941ff','#011936ff'];
    for(let i=0;i<num;i++)
    {
        let newPl=new Player(null,startArr[i],2,tcArr[i],false);
        newPl.createPlayerTokens(); 
        let size=playerArr.push(newPl);  
    }
    inputEl[0].addEventListener('keypress',(ev)=>{
        if (0>=num) {
            ev.preventDefault(); 
            console.log(0>=num); 
        }
    });
    inputEl[1].addEventListener('keypress',(ev)=>{
        if (1>=num) {
            ev.preventDefault(); 
            console.log(1>=num);
        }
    });
    inputEl[2].addEventListener('keypress',(ev)=>{
        if (2>=num) {
            ev.preventDefault(); 
            console.log(2>=num);
            displWarn(`Only ${num} Players allowed`,3);
        }
    });
    inputEl[3].addEventListener('keypress',(ev)=>{
        if (3>=num) {
            ev.preventDefault(); 
            console.log(3>=num);
            displWarn(`Only ${num} Players allowed`,4);
        }
    });
    function displWarn(msg,lblNo){
        if (lblNo===3) {
            let lbl3=document.getElementById("lbl3"); 
            lbl3.innerHTML=msg; 
            let wTT=window.setTimeout(function(){lbl3.innerHTML="";},2500); 
        }
        else if (lblNo===4) {
            let lbl4=document.getElementById("lbl4"); 
            lbl4.innerHTML=msg; 
            let wTT=window.setTimeout(function(){lbl4.innerHTML="";},2500);
        }
    }
    
    inputEl[0].addEventListener('change',(ev)=>{
        playerArr[0].playerName=ev.target.value; 
    });
    inputEl[1].addEventListener('change',(ev)=>{
        playerArr[1].playerName=ev.target.value;
    });
    inputEl[2].addEventListener('change',(ev)=>{
        playerArr[2].playerName=ev.target.value;
    });
    inputEl[3].addEventListener('change',(ev)=>{
        playerArr[3].playerName=ev.target.value;
    });
    //write function to display warning label
    const stGameB=document.getElementById("stGameButt"); 
    stGameB.addEventListener('click',(buttonEv)=>{
        console.log(buttonEv.cancelable);
        playerDeetsHTML+=`<br><p>`;
        let noClick=false; 
        for (let i=0;i<num;i++){
            if (playerArr[i].playerName===null)
            {
                noClick=true;
            }
            
            playerDeetsHTML+=`${playerArr[i].playerName} is playing.<br>`; 
        }
        playerDeetsHTML+=`</p>`;
        if (noClick==true) {
            buttonEv.preventDefault();
        }
        belowBoard.innerHTML=playerDeetsHTML;
        screenId=2;  
        game();
        
    }); 
}
function gameBoard(nP){
    clearScreen(); 
    bgCol[2]='#efefe8ff'; 
    ctx.fillStyle=bgCol[2]; 
    ctx.fillRect(0,0,100,100); 
    //ctx.fillStyle='#606060';; 
    //ctx.font='6.5px Helvetica'; 
    //ctx.fillText(`${nP} Players playing`,3,6); 

    //Draw game board 
    

    let bSS=16,gridSx=1,nR=6,nC=6,gridSy=1,gap=0.4; 
     for (let i = 0; i < nC; i++) {
        
        for (let j = 0; j < nR; j++) {
            let coord=new xAndy(gridSx+(bSS+gap)*i,gridSy+(bSS+gap)*j,
            gridSx+((bSS+gap)*i)+bSS,gridSy+((bSS+gap)*j)+bSS); 
            gameArr[j][i]=new onBoardSquare(`${j}${i}`,coord.X,coord.Y,coord.Xend,coord.Yend,bSS); 
            gameArr[j][i].drawSq(); 
            /* for diagnostic purpose only
            ctx.font='3px serif'; 
            ctx.fillStyle='black'; 
            ctx.textAlign='center'; 
            ctx.textBaseline='middle'; 
            ctx.fillText(gameArr[j][i].addr,(coord.X+coord.Xend)/2,(coord.Y+coord.Yend)/2); 
            */
        }
        
    }
    //const sq=new onBoardSquare("ab",gridSx,gridSy,17,17,16); 
    //sq.drawSq(); 
}

function clearScreen(){
    ctx.fillStyle='white'; 
    ctx.fillRect(0,0,100,100); 
}
function gamePlay(){
    welcomeScreen(); 
    ctx.save(); 
}
function roundRect(x,y,wid,high,pCent,lW,strCol,fillCol,BGCol){
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
    ctx.lineWidth=lW; 
    ctx.fillStyle=BGCol; 
    ctx.strokeStyle=BGCol; 
    ctx.stroke(transPath); 
    ctx.fill(transPath); 
    
    //dont distub below
    ctx.strokeStyle=strCol; 
    ctx.stroke(mainPath);
    
}
function game(){
    clearScreen(); 
    gameBoard(nPlayers); 
    createForGame(); 
}
function createForGame(){
    let Bbinhtm=''; 
    belowBoard.innerHTML=''; 
    Bbinhtm+=`<p>Player Lockers</p><br><br><div class="Lockers">`; 
    for (let i=0;i<nPlayers;i++){
        Bbinhtm+=`<div class="PlyrLocker">`; 
        Bbinhtm+=`<h1>${playerArr[i].playerName}'s Locker</h1><br>`;
        Bbinhtm+=`<p>${playerArr[i].checkTokenInLocker()} in locker.<br>
        2 Tokens in total</p><br>`;
        Bbinhtm+=`<div id="tknhr${i}"></div></div><br>`;
        let tknhr=document.getElementById(`tknhr${i}`); 
        console.log(playerArr[i].tokenCol); 
        //tknhr.style.backgroundColor=`${playerArr[i].tokenCol}`; 
    }
    Bbinhtm+=`</div>`; 
    belowBoard.innerHTML=Bbinhtm; 
}
class Player{
    constructor(playerName,startPos,nTokens,tokenCol,winStat){
        this.playerName=playerName; 
        this.startPos=startPos; //will take onBoardSquare() object
        this.endPos=playerPathGen(startPos)[playerPathGen(startPos).length-1];   //will take onBoardSquare() object
        this.Tokens=new Array(nTokens); 
        this.tokenCol=tokenCol; 
        this.winStat=winStat; 
    }
    drawPlayerLocker(x,y,Wid,High)
    {
        roundRect(x,y,Wid,High,20,1,this.tokenCol,'#fof6f7ef',bgCol[2]); 
    }
   
    createPlayerTokens() //creates n Tokens for "playerName"
    {
        for (let i = 0; i < this.Tokens.length; i++) {
            this.Tokens[i]=new token(this.playerName,true,null,this.tokenCol);
        }
    }
    bringOneTokenOnBoard(){
        let count=0; 
        for (let i = 0; i < this.Tokens.length; i++) {
            if (count==0 && this.Tokens[i].inLocker===true) {
                this.Tokens[i].inLocker=false; 
                this.Tokens[i].onBoardPos=this.startPos; 
                this.Tokens[i].drawToken(); 
                count=1; 
                break; 
            }
        }
    }
    checkTokenInLocker(){ //check how many tokens in locker
        let res=0; 
        for (let i = 0; i < this.Tokens.length; i++) {
            if (this.Tokens[i].inLocker===true) {
                res+=1; 
            }
        }
        return res; 
    }
    checkWin(){
        let win=true; 
        this.Tokens.forEach(Tkn => {
            if (Tkn.onBoardPos.addr!==this.endPos.addr) {
                win=false; 
            }
        });
        this.winStat=win; 
    }
}

class token{
    constructor(playerInd,inLocker,onBoardPos,tCol){
        this.playerInd=playerInd; //takes Player name
        this.inLocker=inLocker; 
        this.onBoardPos=onBoardPos; //will take onBoardSquare() object
        this.tCol=tCol; 
    }
    drawToken(){
        if (this.inLocker===false) {
            let cen=new xAndy((this.onBoardPos.xSt+this.onBoardPos.xEd)/2,
            (this.onBoardPos.ySt+this.onBoardPos.yEd)/2,null,null);
            let rad=0.75*this.onBoardPos.dim; 

            let tC1=new Path2D(); 
            tC.beginPath(); 
            tC.arc(cen.X,cen.Y,rad,0,Math.PI*2,true); 
            tC1.closePath(); 
            let tC2=new Path2D(); 
            tC.beginPath(); 
            tC.arc(cen.X,cen.Y,0.1*rad,0,Math.PI*2,true); 
            tC.closePath(); 

            ctx.fillStyle=this.tCol; 
            ctx.fill(tC1);
            ctx.strokeStyle='black'; 
            ctx.lineWidth=0.3; 
            ctx.stroke(tC1); 
            ctx.fillStyle='#f95700ff'; 
            ctx.fill(tC2);  
        }
    }
    eraseToken(){
        let str=new String(this.onBoardPos.addr); 
        let r=Number(str.charAt(0)); 
        let c=Number(str.charAt(1)); 
        gameArr[r][c].drawSq(); 
    }
    moveTokenOnBoard(stPos,units){ //moves token and returns true if moving to a position before end of path
        //does nothing and returns false if new position is after eop
        let tknPath=playerPathGen(stPos); 
        currPos = elmnt => {elmnt===this.onBoardPos.addr}; 
        let currI=tknPath.findIndex(currPos); 
        if (currI+units<tknPath.length) {
            this.eraseToken();
            this.onBoardPos=gameArr[Number(tknPath[currI+units].charAt(0))][Number(tknPath[currI+units].charAt(1))]; 
            this.drawToken(); 
            return true; 
        }
        else {
            return false; 
        }
    }
}

function playerPathGen(startAt){
    let resultArr=new Array(); 
    if (startAt==='00') {
        resultArr=['00','01','02','03','04','05','15','25','35','45','55','54','53','52','51','50','40','30','20','10','11','12','13','14','24','34','44','43','42','41','31','21','22','23','33','32']; 
        //list was generated by a different javascript which was slowing down loading time hence just copy pasted it
    }
    else if (startAt==='05') {
        resultArr=['05','15','25','35','45','55','54','53','52','51','50','40','30','20','10','00','01','02','03','04','14','24','34','44','43','42','41','31','21','11','12','13','23','33','32','22']; 
    }
    else if (startAt==='55') {
        resultArr=['55','54','53','52','51','50','40','30','20','10','00','01','02','03','04','05','15','25','35','45','44','43','42','41','31','21','11','12','13','14','24','34','33','32','22','23']; 
    }
    else if (startAt==='50') {
        resultArr=['50','40','30','20','10','00','01','02','03','04','05','15','25','35','45','55','54','53','52','51','41','31','21','11','12','13','14','24','34','44','43','42','32','22','23','33']; 
    }
    else {
        return false; 
    }
    return resultArr; 
}

class onBoardSquare{
    constructor(addr,xSt,ySt,xEd,yEd,dim)
    {
        this.addr=addr; 
        this.xSt=xSt; 
        this.ySt=ySt; 
        this.xEd=xEd; 
        this.yEd=yEd; 
        this.dim=dim; 
    }
    drawSq(){
        roundRect(this.xSt,this.ySt,this.dim,this.dim,5,0.5,'#0a5e2aff','#6dac4fff',bgCol[2]); 
    }
    
}
class xAndy{
    constructor(X,Y,Xend,Yend)
    {
        this.X=X; 
        this.Y=Y; 
        this.Xend=Xend; 
        this.Yend=Yend; 
    }
}
