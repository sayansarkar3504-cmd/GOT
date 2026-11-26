// Runtime validation coverage for playable game flows.
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import GamesHall from './GamesHall'

afterEach(cleanup)

describe('Games Hall', () => {
  it('lets a ruler choose a house and advance a strategy turn', () => {
    render(<GamesHall />)
    fireEvent.click(screen.getByRole('button', { name: /The Iron Throne/ }))
    fireEvent.click(screen.getByRole('button', { name: /House Stark/ }))

    expect(screen.getByText(/Turn 1 of 5/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: /Open the granaries/ }))
    expect(screen.getByText(/Turn 2 of 5/)).toBeTruthy()
  })

  it('reveals quiz feedback and accepts the next answer', () => {
    render(<GamesHall />)
    fireEvent.click(screen.getByRole('button', { name: /Maester’s Challenge/ }))
    fireEvent.click(screen.getByRole('button', { name: /House Stark$/ }))

    expect(screen.getByText(/Winterfell is the ancient seat/)).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Next question' }))
    expect(screen.getByText(/Question 2/)).toBeTruthy()
  })

  it('shows a house result after answering the personality questions', () => {
    render(<GamesHall />)
    fireEvent.click(screen.getByRole('button', { name: /House Quiz/ }))
    fireEvent.click(screen.getByRole('button', { name: /Warm halls and a loyal community/ }))
    fireEvent.click(screen.getByRole('button', { name: /Stand by the people who trusted you/ }))
    fireEvent.click(screen.getByRole('button', { name: /Steadfastness/ }))
    fireEvent.click(screen.getByRole('button', { name: /A hearth in Winterfell/ }))

    expect(screen.getByRole('heading', { name: 'House Stark' })).toBeTruthy()
  })

  it('resolves a tactical battle after a player chooses an army', () => {
    render(<GamesHall />)
    fireEvent.click(screen.getByRole('button', { name: /Battle of Westeros/ }))
    fireEvent.click(screen.getByRole('button', { name: 'House Stark' }))
    fireEvent.click(screen.getByRole('button', { name: /Cavalry/ }))
    fireEvent.click(screen.getByRole('button', { name: 'Attack' }))

    expect(screen.getByText(/Round 2/)).toBeTruthy()
    expect(screen.getByText(/Supplies 3/)).toBeTruthy()
  })
})
