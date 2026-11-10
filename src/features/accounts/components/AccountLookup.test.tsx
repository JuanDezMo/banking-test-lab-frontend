import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AccountLookup } from './AccountLookup'

describe('AccountLookup', () => {
  it('requires an id', async () => {
    const onSearch = vi.fn()
    render(<AccountLookup onSearch={onSearch} />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Search' }))

    expect(screen.getByText('Enter an account id')).toBeInTheDocument()
    expect(onSearch).not.toHaveBeenCalled()
  })

  it('searches the trimmed id', async () => {
    const onSearch = vi.fn()
    render(<AccountLookup onSearch={onSearch} />)
    const user = userEvent.setup()
    await user.type(screen.getByRole('searchbox', { name: 'Account id' }), '  abc-123  ')
    await user.click(screen.getByRole('button', { name: 'Search' }))

    expect(onSearch).toHaveBeenCalledWith('abc-123')
  })
})
