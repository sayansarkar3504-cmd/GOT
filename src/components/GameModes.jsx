import { useEffect, useRef, useState } from 'react'
import { HOUSES } from '../data/houses'

const CHARACTER_CLUES = [
  { name: 'Jon Snow', house: 'House Stark', difficulty: 'easy', clue: 'Raised at Winterfell, I took an oath to guard the Wall. I learned that my true parentage was not what I had been told.' },
  { name: 'Arya Stark', house: 'House Stark', difficulty: 'easy', clue: 'I trained far from home and carried a small sword named Needle. A list of names helped guide my path.' },
  { name: 'Tyrion Lannister', house: 'House Lannister', difficulty: 'easy', clue: 'I belong to a wealthy western house. Books, wit, and a talent for surviving court have served me well.' },
  { name: 'Daenerys Targaryen', house: 'House Targaryen', difficulty: 'easy', clue: 'I crossed the sea in exile and became known for three dragons and a claim to the throne.' },
  { name: 'Sansa Stark', house: 'House Stark', difficulty: 'medium', clue: 'I learned the dangers of court politics and eventually returned north to lead my people.' },
  { name: 'Brienne of Tarth', house: 'House Tarth', difficulty: 'medium', clue: 'I chose the path of a knight and pledged my sword to protect those I serve.' },
  { name: 'Samwell Tarly', house: 'House Tarly', difficulty: 'medium', clue: 'I left my family’s home for the Night’s Watch, where books and careful study proved as useful as a blade.' },
  { name: 'Davos Seaworth', house: 'House Baratheon', difficulty: 'hard', clue: 'Once a smuggler, I rose through service and became a trusted adviser despite my humble beginnings.' },
  { name: 'Olenna Tyrell', house: 'House Tyrell', difficulty: 'hard', clue: 'Known for sharp words and sharper political instincts, I defended my family from the gardens of Highgarden.' },
  { name: 'Yara Greyjoy', house: 'House Greyjoy', difficulty: 'hard', clue: 'A captain of the Iron Islands, I commanded ships and challenged expectations about who could rule.' },
]

const PERSONALITY_QUESTIONS = [
  {
    prompt: 'A difficult winter is coming. What do you secure first?',
    answers: [
      { text: 'Warm halls and a loyal community.', house: 'stark' },
      { text: 'A strong treasury and careful plans.', house: 'lannister' },
      { text: 'The knowledge to begin again.', house: 'targaryen' },
      { text: 'A dependable force to protect home.', house: 'baratheon' },
      { text: 'Ships and a route to opportunity.', house: 'greyjoy' },
      { text: 'Food enough to keep everyone thriving.', house: 'tyrell' },
    ],
  },
  {
    prompt: 'When a plan begins to fail, you are most likely to…',
    answers: [
      { text: 'Stand by the people who trusted you.', house: 'stark' },
      { text: 'Find the overlooked advantage.', house: 'lannister' },
      { text: 'Change the game entirely.', house: 'targaryen' },
      { text: 'Meet the challenge head-on.', house: 'baratheon' },
      { text: 'Take a different route.', house: 'greyjoy' },
      { text: 'Build a better coalition.', house: 'tyrell' },
    ],
  },
  {
    prompt: 'Which quality would your allies praise most?',
    answers: [
      { text: 'Steadfastness.', house: 'stark' },
      { text: 'Resourcefulness.', house: 'lannister' },
      { text: 'Bold vision.', house: 'targaryen' },
      { text: 'Resolve.', house: 'baratheon' },
      { text: 'Independence.', house: 'greyjoy' },
      { text: 'Diplomacy.', house: 'tyrell' },
    ],
  },
  {
    prompt: 'Choose a seat from which to shape the realm.',
    answers: [
      { text: 'A hearth in Winterfell.', house: 'stark' },
      { text: 'A council chamber above the city.', house: 'lannister' },
      { text: 'A sea-cliff fortress.', house: 'targaryen' },
      { text: 'A storm-battered stronghold.', house: 'baratheon' },
      { text: 'A ship crossing open water.', house: 'greyjoy' },
      { text: 'A garden alive with conversation.', house: 'tyrell' },
    ],
  },
]

const BATTLE_UNITS = [
  { id: 'archers', name: 'Archers', cost: 0, damage: 15, guard: 4, note: 'Steady ranged volleys' },
  { id: 'infantry', name: 'Infantry', cost: 0, damage: 19, guard: 8, note: 'Balanced line fighters' },
  { id: 'cavalry', name: 'Cavalry', cost: 1, damage: 25, guard: 2, note: 'Heavy charge; costs 1 supply' },
]

function randomize(items) {
  const shuffled = [...items]
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]]
  }
  return shuffled
}

function GameTopline({ onBack, children }) {
  return (
    <div className="game-panel__topline">
      <button className="game-back" type="button" onClick={onBack}>← All games</button>
      {children}
    </div>
  )
}

function drawKingdomEvent(events) {
  const index = Math.floor(Math.random() * events.length)
  return events[index]
}

function HouseStrategy({ onBack, onSaveScore }) {
  const [houseId, setHouseId] = useState('')
  const [round, setRound] = useState(1)
  const [resources, setResources] = useState({ gold: 55, army: 55, food: 55, renown: 50 })
  const [history, setHistory] = useState([])
  const [result, setResult] = useState('')
  const selectedHouse = HOUSES.find((house) => house.id === houseId)

  const choices = [
    { name: 'Open the granaries', costs: { gold: 12 }, gains: { food: 22, renown: 3 }, report: 'The smallfolk remember a ruler who feeds them.' },
    { name: 'Call the banners', costs: { gold: 15, food: 8 }, gains: { army: 22 }, report: 'Fresh banners gather beneath your standard.' },
    { name: 'Host a great council', costs: { gold: 10 }, gains: { renown: 14, food: 3 }, report: 'A patient alliance lends weight to your claim.' },
  ]

  const takeTurn = (choice) => {
    const updated = { ...resources }
    Object.entries(choice.costs).forEach(([key, amount]) => { updated[key] -= amount })
    Object.entries(choice.gains).forEach(([key, amount]) => { updated[key] += amount })
    const event = drawKingdomEvent([
      { text: 'A prosperous harvest fills the storehouses.', change: { food: 9 } },
      { text: 'A border raid tests the garrison.', change: { army: -8 } },
      { text: 'A merchant fleet reaches your shores.', change: { gold: 8 } },
      { text: 'A public oath strengthens your standing.', change: { renown: 7 } },
      { text: 'A harsh season strains the realm.', change: { food: -7 } },
    ])
    Object.entries(event.change).forEach(([key, amount]) => { updated[key] = Math.max(0, Math.min(100, updated[key] + amount)) })
    const logEntry = `${choice.report} ${event.text}`
    setResources(updated)
    setHistory((items) => [logEntry, ...items].slice(0, 5))

    if (Object.values(updated).some((amount) => amount <= 0)) {
      setResult('fallen')
    } else if (round === 5) {
      setResult(updated.renown >= 65 && updated.army >= 50 && updated.food >= 25 ? 'crowned' : 'survived')
    } else {
      setRound((current) => current + 1)
    }
  }

  const restart = () => {
    setHouseId('')
    setRound(1)
    setResources({ gold: 55, army: 55, food: 55, renown: 50 })
    setHistory([])
    setResult('')
  }

  if (!selectedHouse) {
    return (
      <div className="game-panel">
        <GameTopline onBack={onBack}><span>Five turns · one realm</span></GameTopline>
        <p className="eyebrow">The Iron Throne · Kingdom Strategy</p>
        <h3 className="game-panel__question">Choose a banner to lead.</h3>
        <div className="strategy-houses">
          {HOUSES.map((house) => (
            <button className="strategy-house" key={house.id} type="button" onClick={() => setHouseId(house.id)} style={{ '--house-accent': house.accent }}>
              <img src={house.image} alt="" loading="lazy" />
              <span>House {house.name}</span>
            </button>
          ))}
        </div>
        <p className="game-note">Balance gold, army, food, and renown across five turns. Claim the throne with 65 renown, 50 army, and 25 food remaining.</p>
      </div>
    )
  }

  if (result) {
    return (
      <div className="game-panel game-panel--result" aria-live="polite">
        <p className="eyebrow">The realm has decided</p>
        <span className="game-result__mark" aria-hidden="true">{result === 'crowned' ? '✦' : '✧'}</span>
        <h3>{result === 'crowned' ? `House ${selectedHouse.name} claims the throne.` : result === 'fallen' ? `The realm of House ${selectedHouse.name} has fallen.` : 'The realm survives, but the crown remains contested.'}</h3>
        <div className="strategy-stats">{Object.entries(resources).map(([key, value]) => <span key={key}>{key}: <strong>{value}</strong></span>)}</div>
        {onSaveScore && <button className="button button--outline" type="button" onClick={() => onSaveScore('iron-throne', Object.values(resources).reduce((total, value) => total + value, 0))}>Save score</button>}
        <button className="button button--gold" type="button" onClick={restart}>Play again</button>
      </div>
    )
  }

  return (
    <div className="game-panel">
      <GameTopline onBack={onBack}><span>Turn {round} of 5 · House {selectedHouse.name}</span></GameTopline>
      <div className="strategy-stats">
        {Object.entries(resources).map(([key, value]) => <span key={key}>{key}<strong>{value}</strong></span>)}
      </div>
      <p className="eyebrow">Choose one decree</p>
      <div className="strategy-choices">
        {choices.map((choice) => (
          <button className="strategy-choice" type="button" key={choice.name} onClick={() => takeTurn(choice)}>
            <strong>{choice.name}</strong>
            <span>{choice.report}</span>
          </button>
        ))}
      </div>
      {history.length > 0 && <div className="strategy-log" aria-live="polite"><strong>Latest dispatch</strong><p>{history[0]}</p></div>}
    </div>
  )
}

function DragonFlight({ onBack, onSaveScore }) {
  const canvasRef = useRef(null)
  const keysRef = useRef({ up: false, down: false })
  const statusRef = useRef('ready')
  const scoreRef = useRef(0)
  const [status, setStatus] = useState('ready')
  const [score, setScore] = useState(0)
  const [flightId, setFlightId] = useState(0)
  const [best] = useState(() => {
    try { return Number(window.localStorage.getItem('westeros-dragon-best')) || 0 } catch { return 0 }
  })

  useEffect(() => { statusRef.current = status }, [status])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    const width = canvas.width
    const height = canvas.height
    let frame = 0
    let previousTime = 0
    let spawnTime = 0
    let elapsed = 0
    let dragonY = height / 2
    let obstacles = []
    let collected = 0
    let lastPublishedScore = 0

    const draw = (timestamp) => {
      frame = window.requestAnimationFrame(draw)
      const delta = Math.min((timestamp - (previousTime || timestamp)) / 1000, .04)
      previousTime = timestamp
      if (statusRef.current === 'playing') {
        elapsed += delta
        spawnTime += delta
        const speed = 180 + Math.min(elapsed * 8, 200)
        if (keysRef.current.up) dragonY -= 220 * delta
        if (keysRef.current.down) dragonY += 220 * delta
        dragonY = Math.max(24, Math.min(height - 24, dragonY))

        if (spawnTime > Math.max(.62, 1.3 - elapsed * .015)) {
          spawnTime = 0
          const gapY = 44 + Math.random() * (height - 88)
          obstacles.push({ x: width + 15, y: gapY, gap: Math.max(74, 112 - elapsed * .6), collected: false })
        }

        obstacles = obstacles.filter((obstacle) => obstacle.x > -30)
        obstacles.forEach((obstacle) => {
          obstacle.x -= speed * delta
          const dx = obstacle.x - 42
          const dy = obstacle.y - dragonY
          if (!obstacle.collected && Math.abs(dx) < 14 && Math.abs(dy) < obstacle.gap / 2) {
            obstacle.collected = true
            collected += 10
            const currentScore = lastPublishedScore + collected
            scoreRef.current = currentScore
            setScore(currentScore)
          }
          if (Math.abs(dx) < 17 && Math.abs(dy) >= obstacle.gap / 2 - 12) {
            const currentScore = lastPublishedScore + collected
            scoreRef.current = currentScore
            setScore(currentScore)
            setStatus('over')
          }
        })
        if (Math.floor(elapsed * 2) > lastPublishedScore) {
          lastPublishedScore = Math.floor(elapsed * 2)
          const currentScore = lastPublishedScore + collected
          scoreRef.current = currentScore
          setScore(currentScore)
        }
      }

      context.clearRect(0, 0, width, height)
      const sky = context.createLinearGradient(0, 0, 0, height)
      sky.addColorStop(0, '#131613')
      sky.addColorStop(1, '#080909')
      context.fillStyle = sky
      context.fillRect(0, 0, width, height)
      context.fillStyle = 'rgba(201, 168, 76, .13)'
      for (let index = 0; index < 32; index += 1) {
        const x = (index * 97 - elapsed * 16) % width
        const y = (index * 47) % height
        context.fillRect((x + width) % width, y, 2, 2)
      }
      obstacles.forEach((obstacle) => {
        context.fillStyle = 'rgba(169, 57, 43, .75)'
        context.beginPath()
        context.ellipse(obstacle.x, obstacle.y - obstacle.gap / 2 - 35, 18, 35, 0, 0, Math.PI * 2)
        context.ellipse(obstacle.x, obstacle.y + obstacle.gap / 2 + 35, 18, 35, 0, 0, Math.PI * 2)
        context.fill()
        if (!obstacle.collected) {
          context.fillStyle = '#e8c97a'
          context.beginPath()
          context.arc(obstacle.x, obstacle.y, 6, 0, Math.PI * 2)
          context.fill()
        }
      })
      context.save()
      context.translate(42, dragonY)
      context.fillStyle = '#c9a84c'
      context.beginPath()
      context.moveTo(-17, 0)
      context.lineTo(1, -8)
      context.lineTo(20, 0)
      context.lineTo(2, 8)
      context.closePath()
      context.fill()
      context.fillStyle = '#e8c97a'
      context.beginPath()
      context.moveTo(-2, -4)
      context.lineTo(-10, -20)
      context.lineTo(9, -6)
      context.lineTo(5, 0)
      context.closePath()
      context.fill()
      context.restore()

      if (statusRef.current === 'paused') {
        context.fillStyle = 'rgba(5, 6, 6, .68)'
        context.fillRect(0, 0, width, height)
        context.fillStyle = '#f5e6c8'
        context.font = '22px Georgia'
        context.textAlign = 'center'
        context.fillText('Flight paused', width / 2, height / 2)
      }
    }

    frame = window.requestAnimationFrame(draw)
    return () => window.cancelAnimationFrame(frame)
  }, [flightId])

  useEffect(() => {
    if (status !== 'over' || score <= best) return
    try { window.localStorage.setItem('westeros-dragon-best', String(score)) } catch { /* Optional personal best. */ }
  }, [best, score, status])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') event.preventDefault()
      if (event.key === 'ArrowUp') keysRef.current.up = event.type === 'keydown'
      if (event.key === 'ArrowDown') keysRef.current.down = event.type === 'keydown'
      if (event.code === 'Space' && event.type === 'keydown') {
        event.preventDefault()
        setStatus((current) => current === 'playing' ? 'paused' : current === 'paused' ? 'playing' : current)
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('keyup', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('keyup', onKey)
      keysRef.current = { up: false, down: false }
    }
  }, [])

  const start = () => {
    scoreRef.current = 0
    setScore(0)
    setFlightId((current) => current + 1)
    setStatus('playing')
  }

  return (
    <div className="game-panel">
      <GameTopline onBack={onBack}><span>Score {score} · Best {Math.max(best, status === 'over' ? score : best)}</span></GameTopline>
      <p className="eyebrow">Dragon Rider</p>
      <h3 className="game-panel__question">Thread the mountain pass.</h3>
      <canvas className="dragon-canvas" ref={canvasRef} width="720" height="300" aria-label="Dragon flight game. Use the up and down arrow keys to fly between the red cliffs and collect gold points." />
      <p className="game-note">Use ↑ and ↓ or the flight controls. Space pauses the flight.</p>
      <div className="dragon-controls">
        <button className="button button--outline" type="button" aria-label="Fly upward" onPointerDown={() => { keysRef.current.up = true }} onPointerUp={() => { keysRef.current.up = false }} onPointerLeave={() => { keysRef.current.up = false }}>Fly up ↑</button>
        <button className="button button--outline" type="button" aria-label="Fly downward" onPointerDown={() => { keysRef.current.down = true }} onPointerUp={() => { keysRef.current.down = false }} onPointerLeave={() => { keysRef.current.down = false }}>Fly down ↓</button>
        {status === 'ready' || status === 'over'
          ? <button className="button button--gold" type="button" onClick={start}>{status === 'over' ? 'Fly again' : 'Begin flight'}</button>
          : <button className="button button--gold" type="button" onClick={() => setStatus((current) => current === 'playing' ? 'paused' : 'playing')}>{status === 'playing' ? 'Pause' : 'Resume'}</button>}
      </div>
      {status === 'over' && (
        <div className="dragon-result" aria-live="polite">
          <p className="game-note">The pass has claimed your flight. Final score: {score}.</p>
          {onSaveScore && <button className="button button--outline" type="button" onClick={() => onSaveScore('dragon-rider', score)}>Save score</button>}
        </div>
      )}
    </div>
  )
}

function CharacterGuess({ onBack, onSaveScore }) {
  const [difficulty, setDifficulty] = useState('easy')
  const [timed, setTimed] = useState(false)
  const [phase, setPhase] = useState('setup')
  const [questions, setQuestions] = useState([])
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [remaining, setRemaining] = useState(20)
  const question = questions[questionIndex]

  useEffect(() => {
    if (phase !== 'playing' || !timed || selected !== null) return undefined
    const timer = window.setInterval(() => {
      setRemaining((time) => {
        if (time <= 1) {
          window.clearInterval(timer)
          setSelected(-1)
          return 0
        }
        return time - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [phase, questionIndex, selected, timed])

  const start = () => {
    const pool = randomize(CHARACTER_CLUES.filter((item) => item.difficulty === difficulty))
    setQuestions(pool.slice(0, 4).map((item) => ({
      ...item,
      options: randomize([item.name, ...randomize(CHARACTER_CLUES.filter((entry) => entry.name !== item.name)).slice(0, 3).map((entry) => entry.name)]),
    })))
    setQuestionIndex(0)
    setSelected(null)
    setScore(0)
    setRemaining(20)
    setPhase('playing')
  }

  const advance = () => {
    if (questionIndex === questions.length - 1) setPhase('result')
    else {
      setQuestionIndex((index) => index + 1)
      setSelected(null)
      setRemaining(20)
    }
  }

  if (phase === 'setup') {
    return (
      <div className="game-panel">
        <GameTopline onBack={onBack}><span>Character deduction</span></GameTopline>
        <p className="eyebrow">Who am I?</p>
        <h3 className="game-panel__question">Choose a difficulty.</h3>
        <div className="difficulty-options" role="group" aria-label="Character quiz difficulty">
          {['easy', 'medium', 'hard'].map((level) => <button className={`difficulty-option${difficulty === level ? ' difficulty-option--active' : ''}`} key={level} type="button" aria-pressed={difficulty === level} onClick={() => setDifficulty(level)}>{level}</button>)}
        </div>
        <label className="timer-toggle"><input type="checkbox" checked={timed} onChange={(event) => setTimed(event.target.checked)} /> Add a 20-second timer</label>
        <button className="button button--gold" type="button" onClick={start}>Begin the clues</button>
      </div>
    )
  }

  if (phase === 'result') {
    return (
      <div className="game-panel game-panel--result" aria-live="polite">
        <p className="eyebrow">The names revealed</p>
        <h3>{score >= 3 ? 'You know the faces of the realm.' : 'The chronicles hold more clues.'}</h3>
        <p>You identified <strong>{score} of {questions.length}</strong> characters.</p>
        <div className="character-review">{questions.map((item) => <p key={item.name}><strong>{item.name}</strong><span>{item.clue}</span></p>)}</div>
        <div className="game-panel__actions">{onSaveScore && <button className="button button--outline" type="button" onClick={() => onSaveScore('who-am-i', score, { quizId: 'who-am-i', score, total: questions.length })}>Save result</button>}<button className="button button--gold" type="button" onClick={start}>Play again</button><button className="game-back" type="button" onClick={onBack}>Return to games</button></div>
      </div>
    )
  }

  const answerOptions = question.options
  const isCorrect = selected !== null && selected >= 0 && answerOptions[selected] === question?.name

  return (
    <div className="game-panel">
      <GameTopline onBack={onBack}><span>{timed ? `${remaining}s · ` : ''}Clue {questionIndex + 1} of {questions.length}</span></GameTopline>
      <div className="quiz-progress">{questions.map((item, index) => <span className={`quiz-progress__step${index <= questionIndex ? ' quiz-progress__step--active' : ''}`} key={item.name} />)}</div>
      <p className="eyebrow">Who am I? · {difficulty}</p>
      <h3 className="game-panel__question">{question.clue}</h3>
      <div className="quiz-options" role="group" aria-label="Character answer choices">
        {answerOptions.map((name, index) => <button className={`quiz-option${selected !== null && name === question.name ? ' quiz-option--correct' : ''}${selected === index && !isCorrect ? ' quiz-option--incorrect' : ''}`} key={name} type="button" disabled={selected !== null} onClick={() => { setSelected(index); if (name === question.name) setScore((value) => value + 1) }}><span className="quiz-option__letter">{String.fromCharCode(65 + index)}</span>{name}</button>)}
      </div>
      {selected !== null && <div className="quiz-feedback" aria-live="polite"><p>{selected === -1 ? `Time is up. The answer was ${question.name}.` : isCorrect ? 'Well deduced.' : `The answer was ${question.name}.`}</p><button className="button button--gold" type="button" onClick={advance}>{questionIndex === questions.length - 1 ? 'Review answers' : 'Next clue'}</button></div>}
    </div>
  )
}

function HousePersonality({ onBack }) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [scores, setScores] = useState({})
  const [resultHouse, setResultHouse] = useState('')
  const [shareMessage, setShareMessage] = useState('')
  const house = HOUSES.find((item) => item.id === resultHouse)

  if (house) {
    const share = async () => {
      const text = `My house in The Chronicles of Westeros is House ${house.name} — “${house.words}”.`
      try {
        if (navigator.share) await navigator.share({ title: 'My Westeros house', text })
        else if (navigator.clipboard) {
          await navigator.clipboard.writeText(text)
          setShareMessage('Result copied to clipboard.')
        } else {
          setShareMessage(text)
        }
      } catch (error) {
        if (error.name !== 'AbortError') setShareMessage('Sharing is unavailable here. You can copy the result above.')
      }
    }
    return (
      <div className="game-panel game-panel--result" aria-live="polite">
        <p className="eyebrow">Your banner awaits</p>
        <img className="house-result__sigil" src={house.image} alt={`${house.name} house sigil`} />
        <h3>House {house.name}</h3>
        <p><strong>“{house.words}”</strong><br />{house.description}</p>
        {shareMessage && <p className="game-note" role="status">{shareMessage}</p>}
        <div className="game-panel__actions"><button className="button button--gold" type="button" onClick={share}>Share result</button><button className="game-back" type="button" onClick={() => { setResultHouse(''); setQuestionIndex(0); setScores({}); setShareMessage('') }}>Discover again</button><button className="game-back" type="button" onClick={onBack}>Return to games</button></div>
      </div>
    )
  }

  const question = PERSONALITY_QUESTIONS[questionIndex]
  return (
    <div className="game-panel">
      <GameTopline onBack={onBack}><span>Question {questionIndex + 1} of {PERSONALITY_QUESTIONS.length}</span></GameTopline>
      <div className="quiz-progress">{PERSONALITY_QUESTIONS.map((item, index) => <span className={`quiz-progress__step${index <= questionIndex ? ' quiz-progress__step--active' : ''}`} key={item.prompt} />)}</div>
      <p className="eyebrow">House quiz</p>
      <h3 className="game-panel__question">{question.prompt}</h3>
      <div className="quiz-options" role="group" aria-label="Personality answers">
        {question.answers.map((answer) => <button className="quiz-option" key={answer.house} type="button" onClick={() => {
          const nextScores = { ...scores, [answer.house]: (scores[answer.house] || 0) + 1 }
          setScores(nextScores)
          if (questionIndex === PERSONALITY_QUESTIONS.length - 1) {
            const houseId = Object.entries(nextScores).sort((a, b) => b[1] - a[1])[0][0]
            setResultHouse(houseId)
          } else setQuestionIndex((index) => index + 1)
        }}><span className="quiz-option__letter">✦</span>{answer.text}</button>)}
      </div>
    </div>
  )
}

function TacticalBattle({ onBack, onSaveScore }) {
  const [army, setArmy] = useState('')
  const [enemy, setEnemy] = useState('House Lannister')
  const [health, setHealth] = useState(100)
  const [enemyHealth, setEnemyHealth] = useState(100)
  const [supplies, setSupplies] = useState(4)
  const [round, setRound] = useState(1)
  const [selectedUnit, setSelectedUnit] = useState('infantry')
  const [guarding, setGuarding] = useState(false)
  const [result, setResult] = useState('')
  const [report, setReport] = useState('Choose a unit and an order to begin.')

  const begin = (houseName) => {
    setArmy(houseName)
    setEnemy(houseName === 'House Stark' ? 'House Lannister' : 'House Stark')
    setHealth(100)
    setEnemyHealth(100)
    setSupplies(4)
    setRound(1)
    setResult('')
    setReport('The lines are formed. Choose your first order.')
  }

  const resolveTurn = (order) => {
    const unit = BATTLE_UNITS.find((item) => item.id === selectedUnit)
    if (!unit || (unit.cost > supplies && order === 'attack')) return
    const damageToEnemy = order === 'attack' ? unit.damage : 0
    const enemyDamage = Math.max(5, 18 - (order === 'defend' ? 13 : unit.guard))
    const nextEnemyHealth = Math.max(0, enemyHealth - damageToEnemy)
    const nextHealth = Math.max(0, health - (nextEnemyHealth === 0 ? 0 : enemyDamage))
    const nextSupplies = Math.min(6, supplies - (order === 'attack' ? unit.cost : 0) + (order === 'defend' ? 1 : 0))
    setEnemyHealth(nextEnemyHealth)
    setHealth(nextHealth)
    setSupplies(nextSupplies)
    setRound((value) => value + 1)
    setGuarding(order === 'defend')
    setReport(order === 'attack' ? `${unit.name} dealt ${damageToEnemy} damage. The opposing line returned ${nextEnemyHealth === 0 ? 'no blow' : `${enemyDamage} damage`}.` : `Your line held; ${enemyDamage} damage was absorbed and one supply was recovered.`)
    if (nextEnemyHealth <= 0) setResult('victory')
    else if (nextHealth <= 0) setResult('defeat')
  }

  if (!army) {
    return (
      <div className="game-panel">
        <GameTopline onBack={onBack}><span>Turn-based battle</span></GameTopline>
        <p className="eyebrow">Battle of Westeros</p>
        <h3 className="game-panel__question">Choose your army.</h3>
        <div className="strategy-houses">{['House Stark', 'House Lannister', 'House Targaryen'].map((name) => <button className="strategy-house" key={name} type="button" onClick={() => begin(name)}><span aria-hidden="true">⚔</span><span>{name}</span></button>)}</div>
        <p className="game-note">Each army begins with 100 health and four supplies. Defend to reduce incoming damage and recover supplies.</p>
      </div>
    )
  }

  if (result) {
    return <div className="game-panel game-panel--result" aria-live="polite"><p className="eyebrow">After the final order</p><h3>{result === 'victory' ? `${army} holds the field.` : `${enemy} has prevailed.`}</h3><p>Battle concluded in round {round}. {result === 'victory' ? 'Your strategy carried the day.' : 'Gather your strength and return.'}</p><div className="game-panel__actions">{onSaveScore && <button className="button button--outline" type="button" onClick={() => onSaveScore('battle-of-westeros', result === 'victory' ? health * 10 + Math.max(0, 100 - round) : 0)}>Save score</button>}<button className="button button--gold" type="button" onClick={() => begin(army)}>Fight again</button><button className="game-back" type="button" onClick={onBack}>Return to games</button></div></div>
  }

  return (
    <div className="game-panel">
      <GameTopline onBack={onBack}><span>Round {round} · Supplies {supplies}</span></GameTopline>
      <p className="eyebrow">{army} against {enemy}</p>
      <div className="battle-health"><label>{army}<progress value={health} max="100" /><span>{health} health</span></label><label>{enemy}<progress value={enemyHealth} max="100" /><span>{enemyHealth} health</span></label></div>
      <p className="eyebrow">Select your unit</p>
      <div className="unit-options" role="group" aria-label="Choose a battle unit">{BATTLE_UNITS.map((unit) => <button className={`unit-option${selectedUnit === unit.id ? ' unit-option--active' : ''}`} key={unit.id} type="button" aria-pressed={selectedUnit === unit.id} onClick={() => setSelectedUnit(unit.id)}><strong>{unit.name}</strong><span>{unit.note}</span><small>{unit.damage} attack · {unit.cost} supply</small></button>)}</div>
      <div className="battle-orders"><button className="button button--gold" type="button" disabled={selectedUnit === 'cavalry' && supplies < 1} onClick={() => resolveTurn('attack')}>Attack</button><button className="button button--outline" type="button" onClick={() => resolveTurn('defend')}>Defend &amp; resupply</button></div>
      <p className="game-note" aria-live="polite">{report}{guarding ? ' Your guard stance has ended.' : ''}</p>
    </div>
  )
}

export { CharacterGuess, DragonFlight, HousePersonality, HouseStrategy, TacticalBattle }
