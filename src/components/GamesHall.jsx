import { useEffect, useState } from 'react'
import { CharacterGuess, DragonFlight, HousePersonality, HouseStrategy, TacticalBattle } from './GameModes'
import AccountPanel from './AccountPanel'
import { api } from '../services/api'
import './GamesHall.css'

const QUIZ_QUESTIONS = [
  {
    prompt: 'Which house is seated at Winterfell?',
    options: ['House Stark', 'House Greyjoy', 'House Tyrell', 'House Baratheon'],
    answer: 0,
    note: 'Winterfell is the ancient seat of House Stark in the North.',
  },
  {
    prompt: 'What are the words of House Lannister?',
    options: ['Fire and Blood', 'Winter Is Coming', 'Hear Me Roar', 'Growing Strong'],
    answer: 2,
    note: 'The Lannister words are “Hear Me Roar.”',
  },
  {
    prompt: 'Which island stronghold is associated with House Targaryen?',
    options: ['Pyke', 'Dragonstone', 'The Eyrie', 'Highgarden'],
    answer: 1,
    note: 'Dragonstone is the ancestral island seat associated with House Targaryen.',
  },
  {
    prompt: 'Which house rules the Iron Islands?',
    options: ['House Tyrell', 'House Stark', 'House Greyjoy', 'House Lannister'],
    answer: 2,
    note: 'House Greyjoy rules from Pyke in the Iron Islands.',
  },
  {
    prompt: 'What is the name of the ancient threat from the cold North?',
    options: ['The Golden Company', 'The Others', 'The Kingsguard', 'The Faceless Men'],
    answer: 1,
    note: 'The Others are the mysterious beings of ice from the oldest tales.',
  },
]

const MEMORY_PAIRS = [
  { id: 'stark', name: 'Stark', sigil: '🐺' },
  { id: 'lannister', name: 'Lannister', sigil: '🦁' },
  { id: 'targaryen', name: 'Targaryen', sigil: '🐉' },
  { id: 'baratheon', name: 'Baratheon', sigil: '🦌' },
  { id: 'greyjoy', name: 'Greyjoy', sigil: '🌊' },
  { id: 'tyrell', name: 'Tyrell', sigil: '🌹' },
]

function makeDeck() {
  const deck = MEMORY_PAIRS.flatMap((pair) => [
    { ...pair, uid: `${pair.id}-a` },
    { ...pair, uid: `${pair.id}-b` },
  ])

  for (let index = deck.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[deck[index], deck[swapIndex]] = [deck[swapIndex], deck[index]]
  }
  return deck
}

function readBestMoves() {
  try {
    const stored = Number(window.localStorage.getItem('westeros-memory-best'))
    return Number.isFinite(stored) && stored > 0 ? stored : null
  } catch {
    return null
  }
}

function GameLibrary({ onPlay }) {
  const games = [
    { id: 'strategy', number: 'I', symbol: '♛', type: 'Five turns · kingdom management', title: 'The Iron Throne', description: 'Balance gold, food, army, and renown as you negotiate the road to rule.', action: 'Rule the realm' },
    { id: 'dragon', number: 'II', symbol: '✧', type: 'Canvas flight · keyboard & touch', title: 'Dragon Rider', description: 'Guide a dragon through a mountain pass, evade danger, and gather points.', action: 'Take flight' },
    { id: 'character', number: 'III', symbol: '❖', type: 'Clues · three difficulty levels', title: 'Who Am I?', description: 'Identify a character from original clues, with an optional countdown.', action: 'Read the clues' },
    { id: 'house', number: 'IV', symbol: '✦', type: 'Four questions · house result', title: 'House Quiz', description: 'Choose how you would meet the realm’s trials and discover your banner.', action: 'Find your house' },
    { id: 'battle', number: 'V', symbol: '⚔', type: 'Turn-based · unit tactics', title: 'Battle of Westeros', description: 'Choose an army, manage supplies, and alternate attack and defense.', action: 'Form your ranks' },
    { id: 'quiz', number: 'VI', symbol: '✉', type: 'Five questions · lore quiz', title: 'The Maester’s Challenge', description: 'Test your knowledge of the houses, their seats, and the old stories.', action: 'Enter the quiz' },
    { id: 'memory', number: 'VII', symbol: '♜', type: 'Twelve cards · six pairs', title: 'Sigil Match', description: 'Find each matching house sigil in as few turns as you can.', action: 'Deal the cards' },
  ]

  return (
    <div className="game-library">
      {games.map((game) => (
        <button className={`game-card game-card--${game.id}`} type="button" onClick={() => onPlay(game.id)} key={game.id}>
          <span className="game-card__number">{game.number}</span>
          <span className="game-card__sigil" aria-hidden="true">{game.symbol}</span>
          <span className="game-card__type">{game.type}</span>
          <strong>{game.title}</strong>
          <span className="game-card__description">{game.description}</span>
          <span className="game-card__action">{game.action} <span aria-hidden="true">→</span></span>
        </button>
      ))}
    </div>
  )
}

function LoreQuiz({ onBack, onSaveScore }) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [complete, setComplete] = useState(false)
  const question = QUIZ_QUESTIONS[questionIndex]

  const restart = () => {
    setQuestionIndex(0)
    setSelected(null)
    setScore(0)
    setComplete(false)
  }

  if (complete) {
    return (
      <div className="game-panel game-panel--result" aria-live="polite">
        <p className="eyebrow">The raven has returned</p>
        <span className="game-result__mark" aria-hidden="true">{score === QUIZ_QUESTIONS.length ? '✦' : '✧'}</span>
        <h3>{score === QUIZ_QUESTIONS.length ? 'A true maester.' : 'The realm holds more secrets.'}</h3>
        <p>You answered <strong>{score} of {QUIZ_QUESTIONS.length}</strong> questions correctly.</p>
        <div className="game-panel__actions">
          {onSaveScore && <button className="button button--outline" type="button" onClick={() => onSaveScore('maesters-challenge', score, { quizId: 'maesters-challenge', score, total: QUIZ_QUESTIONS.length })}>Save result</button>}
          <button className="button button--gold" type="button" onClick={restart}>Play again</button>
          <button className="game-back" type="button" onClick={onBack}>Return to games</button>
        </div>
      </div>
    )
  }

  return (
    <div className="game-panel">
      <div className="game-panel__topline">
        <button className="game-back" type="button" onClick={onBack}>← All games</button>
        <span>Question {questionIndex + 1} <span aria-hidden="true">/</span> {QUIZ_QUESTIONS.length}</span>
      </div>
      <div className="quiz-progress" aria-label={`Question ${questionIndex + 1} of ${QUIZ_QUESTIONS.length}`}>
        {QUIZ_QUESTIONS.map((item, index) => (
          <span className={index <= questionIndex ? 'quiz-progress__step quiz-progress__step--active' : 'quiz-progress__step'} key={item.prompt} />
        ))}
      </div>
      <p className="eyebrow">The Maester’s Challenge</p>
      <h3 className="game-panel__question">{question.prompt}</h3>
      <div className="quiz-options" role="group" aria-label="Answer choices">
        {question.options.map((option, index) => {
          const answered = selected !== null
          const isCorrect = index === question.answer
          const isSelected = index === selected
          const statusClass = answered && isCorrect
            ? ' quiz-option--correct'
            : answered && isSelected
              ? ' quiz-option--incorrect'
              : ''
          return (
            <button
              className={`quiz-option${statusClass}`}
              key={option}
              type="button"
              onClick={() => {
                if (selected !== null) return
                setSelected(index)
                if (isCorrect) setScore((current) => current + 1)
              }}
              disabled={answered}
            >
              <span className="quiz-option__letter">{String.fromCharCode(65 + index)}</span>
              <span>{option}</span>
              {answered && isCorrect && <span className="quiz-option__mark" aria-label="Correct">✓</span>}
              {answered && isSelected && !isCorrect && <span className="quiz-option__mark" aria-label="Incorrect">×</span>}
            </button>
          )
        })}
      </div>
      {selected !== null && (
        <div className="quiz-feedback" aria-live="polite">
          <p>{selected === question.answer ? 'Well answered.' : 'Not quite.'} {question.note}</p>
          <button
            className="button button--gold"
            type="button"
            onClick={() => {
              if (questionIndex === QUIZ_QUESTIONS.length - 1) setComplete(true)
              else {
                setQuestionIndex((current) => current + 1)
                setSelected(null)
              }
            }}
          >
            {questionIndex === QUIZ_QUESTIONS.length - 1 ? 'See your result' : 'Next question'}
          </button>
        </div>
      )}
    </div>
  )
}

function SigilMatch({ onBack, onSaveScore }) {
  const [cards, setCards] = useState(makeDeck)
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [bestMoves] = useState(readBestMoves)
  const complete = matched.length === cards.length
  const isNewBest = complete && moves > 0 && (bestMoves === null || moves < bestMoves)
  const displayedBest = isNewBest ? moves : bestMoves

  useEffect(() => {
    if (flipped.length !== 2) return undefined

    const timer = window.setTimeout(() => {
      const [first, second] = flipped
      const firstCard = cards.find((card) => card.uid === first)
      const secondCard = cards.find((card) => card.uid === second)
      if (firstCard?.id === secondCard?.id) setMatched((current) => [...current, first, second])
      setFlipped([])
    }, 650)

    return () => window.clearTimeout(timer)
  }, [flipped, cards])

  useEffect(() => {
    if (!isNewBest) return

    try {
      window.localStorage.setItem('westeros-memory-best', String(moves))
    } catch {
      // The game remains playable when browser storage is unavailable.
    }
  }, [isNewBest, moves])

  const restart = () => {
    setCards(makeDeck())
    setFlipped([])
    setMatched([])
    setMoves(0)
  }

  return (
    <div className={`game-panel game-panel--memory${complete ? ' game-panel--memory-complete' : ''}`}>
      <div className="game-panel__topline">
        <button className="game-back" type="button" onClick={onBack}>← All games</button>
        <span>Turns <strong>{moves}</strong><span className="game-stat-divider">·</span>Best <strong>{displayedBest ?? '—'}</strong></span>
      </div>
      <div className="memory-heading">
        <div>
          <p className="eyebrow">Sigil Match</p>
          <h3>{complete ? 'Every house found.' : 'Remember the banners.'}</h3>
        </div>
        {complete && (
          <div className="memory-heading__actions">
            {onSaveScore && <button className="button button--outline" type="button" onClick={() => onSaveScore('sigil-match', Math.max(0, 1000 - moves * 40))}>Save score</button>}
            <button className="button button--gold" type="button" onClick={restart}>Deal again</button>
          </div>
        )}
      </div>
      <div className="memory-grid" role="group" aria-label="House sigil matching cards">
        {cards.map((card) => {
          const isVisible = flipped.includes(card.uid) || matched.includes(card.uid)
          return (
            <button
              className={`memory-card${isVisible ? ' memory-card--revealed' : ''}${matched.includes(card.uid) ? ' memory-card--matched' : ''}`}
              key={card.uid}
              type="button"
              aria-label={isVisible ? `${card.name} sigil${matched.includes(card.uid) ? ', matched' : ''}` : 'Hidden house sigil'}
              aria-pressed={isVisible}
              disabled={isVisible || flipped.length === 2 || complete}
              onClick={() => {
                setFlipped((current) => [...current, card.uid])
                if (flipped.length === 1) setMoves((current) => current + 1)
              }}
            >
              <span className="memory-card__back" aria-hidden="true">✦</span>
              <span className="memory-card__face" aria-hidden="true">{card.sigil}</span>
              <span className="memory-card__name">{card.name}</span>
            </button>
          )
        })}
      </div>
      <p className="memory-hint" aria-live="polite">
        {complete ? `Solved in ${moves} turns${isNewBest ? ' — a new personal best.' : '.'}` : 'Turn over two cards at a time to find each matching pair.'}
      </p>
    </div>
  )
}

function GamesHall() {
  const [activeGame, setActiveGame] = useState(null)
  const [user, setUser] = useState(null)
  const [scoreStatus, setScoreStatus] = useState('')

  const play = (game) => setActiveGame(game)
  const backToGames = () => setActiveGame(null)
  const saveScore = async (gameId, score, quizResult) => {
    setScoreStatus('')
    try {
      await api.submitScore({ gameId, score })
      if (quizResult) {
        try {
          await api.submitQuizResult(quizResult)
        } catch (error) {
          setScoreStatus(`Score saved, but quiz history could not be saved: ${error.message}`)
          return
        }
      }
      setScoreStatus('Your result has been saved to your account.')
    } catch (error) {
      setScoreStatus(`Could not save result: ${error.message}`)
    }
  }

  return (
    <section className="games-section section-shell" id="games" aria-labelledby="games-title">
      <div className="section-heading reveal">
        <p className="eyebrow">A little wager for the realm</p>
        <span className="ornament" aria-hidden="true">✦</span>
        <h2 className="section-title" id="games-title">Take your <em>place.</em></h2>
        <p className="section-intro">Rule, remember, reason, and take flight. Each game is playable right here in the hall.</p>
      </div>
      <AccountPanel onUserChange={setUser} />
      {scoreStatus && <p className="game-note game-save-status" role="status">{scoreStatus}</p>}
      {activeGame === null && <GameLibrary onPlay={play} />}
      {activeGame === 'strategy' && <HouseStrategy onBack={backToGames} onSaveScore={user ? saveScore : null} />}
      {activeGame === 'dragon' && <DragonFlight onBack={backToGames} onSaveScore={user ? saveScore : null} />}
      {activeGame === 'character' && <CharacterGuess onBack={backToGames} onSaveScore={user ? saveScore : null} />}
      {activeGame === 'house' && <HousePersonality onBack={backToGames} />}
      {activeGame === 'battle' && <TacticalBattle onBack={backToGames} onSaveScore={user ? saveScore : null} />}
      {activeGame === 'quiz' && <LoreQuiz onBack={backToGames} onSaveScore={user ? saveScore : null} />}
      {activeGame === 'memory' && <SigilMatch onBack={backToGames} onSaveScore={user ? saveScore : null} />}
    </section>
  )
}

export default GamesHall
