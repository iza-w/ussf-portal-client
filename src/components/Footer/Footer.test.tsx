/**
 * @jest-environment jsdom
 */

import { act, render, screen } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'
import Footer from './Footer'

describe('Footer component', () => {
  it('renders the USSF portal header', () => {
    render(<Footer />)

    expect(
      screen.getByRole('img', { name: 'United States Space Force Logo' })
    ).toHaveAttribute('alt', 'United States Space Force Logo')
    expect(screen.getAllByRole('link')).toHaveLength(9)
  })

  it('has no a11y violations', async () => {
    // Bug with NextJS Link + axe :(
    // https://github.com/nickcolley/jest-axe/issues/95#issuecomment-758921334
    await act(async () => {
      const { container } = render(<Footer />)
      expect(await axe(container)).toHaveNoViolations()
    })
  })
})
