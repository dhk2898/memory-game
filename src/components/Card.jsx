export default function Card({card, onClick, isFlipped, isMatched, shouldShake, shouldBounce, style}){
    const classes = (`card ${isFlipped || isMatched ? "flipped" : ""} ${shouldShake? "shake":""} ${shouldBounce ? "bounce-in-top" : ""} `);

    return(
        <div 
        className = {classes}
        onClick={onClick}
        style={style}
        >
            <div className = "card-inner">
                <div className = "card-front"> ? </div>
                <div className = "card-back">{card.emoji}</div>
            </div>
        </div>
    );
}