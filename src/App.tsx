import { useEffect, useRef, useState } from 'react'
import './App.less'
import mouse from './assets/audio/mouse.mp3'

interface Block {
  top: string
  left: string
  letter: string
  opacity: number
}

function App() {
  const settingData = {
    shapes: ['square', 'circle'],
    numOfBlocks: [10, 20, 30, 40, 50],
  }

  const randomBlocks = [] as object[]
  const letterList = 'abcdefghijklnmopqrstuvwxyz0123456789'.split('')
  const [isStart, setIsStart] = useState(false)
  const [shapesIndex, setShapesIndex] = useState(0)
  const [numOfBlocksIndex, setNumOfBlocksIndex] = useState(0)
  const [isCircle, setIsCircle] = useState(false)
  const blocks = useRef<Block[]>([])
  const blocksDelete = useRef(0)
  const [spentTime, setSpentTime] = useState('')
  const [wrong, setWrong] = useState(0)
  const [success, setSuccess] = useState(0)
  const time = useRef(0)

  function changeShape(index = 0, shape = settingData.shapes[0]) {
    setShapesIndex(() => index)
    if (shape === settingData.shapes[1]) {
      setIsCircle(() => true)
    } else {
      setIsCircle(() => false)
    }
  }

  function changeNumOfBlocks(index = 0, numOfBlocks = 10) {
    setNumOfBlocksIndex(() => index)
    for (let i = 0; i < numOfBlocks; i++) {
      const top = (Math.random() * (500 - 10) + 10).toFixed(0) + 'px'
      const left = (Math.random() * (1100 - 10) + 10).toFixed(0) + 'px'
      const randomIndex = Math.floor(Math.random() * (letterList.length - 1))
      const letter = letterList[randomIndex]
      randomBlocks[i] = {
        top,
        left,
        letter,
        opacity: 1,
      }
    }

    blocks.current = [...randomBlocks] as Block[] 
    blocksDelete.current = randomBlocks.length
  }

  function startGame() {
    setIsStart(() => true)
    setSpentTime(() => '0s')
    const startInterval = setInterval(() => {
      if (blocksDelete.current === 0) {
        clearInterval(startInterval)
        return
      }
      setSpentTime(() => time.current + 's')
      time.current = time.current + 1
    }, 1000)

    document.addEventListener('keyup', (e) => {
      const key = e.key
      const lastBlocksDelete = blocksDelete.current
      console.log(key)
      console.log(blocks)
      for (let i = 0; i < blocks.current.length; i++) {
        const block = blocks.current[i]
        
        if (block.letter === key && block.opacity !== 0) {
          const audio = new Audio(mouse)
          audio.play()
          block.opacity = 0
          blocksDelete.current = blocksDelete.current - 1
          setSuccess((pre) => pre + 1)

          blocks.current[i] = block
        }

        if (blocksDelete.current === lastBlocksDelete) {
          setWrong((pre) => pre + 1)
        }
      }
    })
  }

  function spaceToStart(e: KeyboardEvent) {
    if (e.key === ' ') {
      startGame()
      document.removeEventListener('keyup', spaceToStart)
    }
  }

  function restart() {
    location.reload()
  }
  useEffect(() => {
    changeShape()
    changeNumOfBlocks()
    document.addEventListener('keyup', spaceToStart)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // useEffect(() => {
  //   console.log(blocks)
  // }, [blocks])

  return (
    <>
      <div className='my-header'>
        <div></div>
        <div className='tips'>Just press your keyboard!</div>
      </div>
      <div className='my-content'>
        {isStart ? (
          <div className='blocks'>
            {blocks.current.map((block, index) => {
              return (
                <div
                  key={index}
                  className={['block', isCircle ? 'circle' : null].join(' ')}
                  style={{
                    top: block.top,
                    left: block.left,
                    opacity: block.opacity,
                  }}
                >
                  {block.letter}
                </div>
              )
            })}
          </div>
        ) : (
          <div className='start'>PRESS THE SPACE TO ENTER GAME!</div>
        )}
        <div className='time-table'>
          <div className='row'>
            <span>success:</span>
            <span>{success}</span>
          </div>
          <div className='row'>
            <span>wrong:</span>
            <span>{wrong}</span>
          </div>
          <div className='row'>
            <span>spent:</span>
            <span>{spentTime}</span>
          </div>
          {isStart ? (
            <div className='restart' onClick={restart}>
              restart
            </div>
          ) : null}
        </div>
        {isStart ? null : (
          <div className='setting'>
            <div className='setting-row'>
              <div
                className='setting-title'
                style={{ color: 'rgb(254, 165, 179)', fontSize: '40px' }}
              >
                SETTING
              </div>
            </div>
            <div className='setting-row'>
              <span className='setting-title'>block shape:</span>
              <div className='radio'>
                {settingData.shapes.map((shape, index) => {
                  return (
                    <span
                      key={index}
                      className={[
                        shapesIndex === index ? 'actived' : null,
                      ].join(' ')}
                      onClick={() => changeShape(index, shape)}
                    >
                      {shape}
                    </span>
                  )
                })}
              </div>
            </div>
            <div className='setting-row'>
              <span className='setting-title'>number of blocks:</span>
              <div className='radio'>
                {settingData.numOfBlocks.map((numOfBlocks, index) => {
                  return (
                    <span
                      key={index}
                      className={[
                        numOfBlocksIndex === index ? 'actived' : null,
                      ].join(' ')}
                      onClick={() => changeNumOfBlocks(index, numOfBlocks)}
                    >
                      {numOfBlocks}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
