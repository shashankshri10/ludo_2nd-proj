var nPlayers,screenId=0; 

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
}

function welcomeScreen(){
    //draws screenId->0
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
    ctx.fillStyle='#f9dc5c'; 
    ctx.fillRect(0,0,100,100); 
    ctx.fillStyle='#606060'; 
    /*let gsFontface=new FontFace('Edu SA Beginner',url('https://fonts.googleapis.com/css2?family=Bangers&family=Cinzel+Decorative&family=Edu+SA+Beginner&family=IM+Fell+English+SC&family=Lobster+Two&family=Rubik+Mono+One&display=swap')); 
    document.fonts.add(gsFontface); */
    ctx.font='6.5px Helvetica'; 
    ctx.fillText('Number of Players',6,8); 
    const opCards=new Array(3); 
    let xStart=[5,55,30]; 
    let yStart=[10,10,55];  
    let cardLen=40; 
    for (let i = 0; i < opCards.length; i++) {
        opCards[i]=new optionCard(2+i,xStart[i],yStart[i],cardLen); 
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
    constructor(num,x,y,s){
        this.num=num; 
        this.x=x; 
        this.y=y;
        this.s=s;
    }
    drawCard(startAt){
        const colChoices=['red','blue','green','yellow']; 
        const backGrad=ctx.createConicGradient((Math.PI/180)*359,this.x+0.5*this.s,this.y+0.5*this.s);
        for(let i=0;i<this.num;i++)
        {
            backGrad.addColorStop(startAt+(i*(1/this.num)),colChoices[i]); 
        } 
        ctx.fillStyle=backGrad; 
        ctx.fillRect(this.x,this.y,this.s,this.s); 
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
