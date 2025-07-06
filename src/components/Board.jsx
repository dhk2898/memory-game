import {useState, useEffect} from "react";
import Card from "./Card";

// emojis to be used
const EMOJIS = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊"];
// async used for readability
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// shuffle function
function shuffle(array) {
    // copy and unpack the elements of the passed in array
    return [...array, ...array]
    // shuffle the array before mapping them into objects
    // each object has an id representing its place on the board and a boolean that checks if it has matched or not
        .sort(() => Math.random() - 0.5)
        .map((emoji, index) => ({
            id: index,
            emoji,
            isMatched: false,
        }));
}

export default function Board() {
  // lazy initialization used for card shuffle
  const [cards, setCards] = useState(()=>shuffle(EMOJIS));
  const [flipped, setFlipped] = useState([]);
  const [locked, setLocked] = useState(false);
  const [shakeCards, setShakeCards] = useState([]);
  const [hasEntered, setHasEntered] = useState(true);

  useEffect(() => {
    const totalBounceTime = cards.length * 100 + 1000
    const run = async() => {
      await sleep(totalBounceTime);
      setHasEntered(false)
    };
    run();
  }, [cards.length]);


  const handleClick = async (card) => {
    if (locked || flipped.includes(card) || card.isMatched) return;

    const newFlipped = [...flipped, card];
    setFlipped(newFlipped);

    // check pairs to see if they're a match
    if (newFlipped.length === 2) {
      setLocked(true);

      const [first, second] = newFlipped;

      // update cards from its previous state via map if it's a match
      if(first.emoji === second.emoji){

        await sleep(1000);
        setCards(prev => prev.map((c) => c.emoji === first.emoji ? {...c, isMatched: true} : c));
        setFlipped([]);
        setLocked(false);
      } 
      // else shake the cards for a bit
      else {
        await sleep(350); // wait for flip animation
        setShakeCards([first.id, second.id]);

        await sleep(500); // wait for shake to finish
        setShakeCards([]);
        setFlipped([]);
        setLocked(false);
      }
    }
  };

  

  return (
    <div className = "game-container">
      <div className="board">
        {cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onClick={() => handleClick(card)}
            isFlipped={flipped.includes(card)}
            isMatched={card.isMatched}
            style={hasEntered ? { animationDelay: `${card.id * 100}ms` } : {}}
            shouldBounce = {hasEntered} 
            shouldShake = {shakeCards.includes(card.id)}
          />
        ))}
      </div>
    </div>
  );
}
