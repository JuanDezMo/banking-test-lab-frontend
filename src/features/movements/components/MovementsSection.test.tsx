import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { jsonResponse, mockFetch, renderWithProviders } from '@/test/utils'
import { MovementsSection } from './MovementsSection'

const movement = (i: number) => ({
  id: `m${i}`,
  accountId: 'a1',
  movementType: 'recharge',
  amount: 1000 + i,
  details: { rechargeType: 'salary' },
  createdAt: '2026-11-10T14:35:00.000Z',
})
const page = (n: number, count: number) => ({
  page: n,
  pageSize: 20,
  items: Array.from({ length: count }, (_, i) => movement((n - 1) * 20 + i)),
})

// Envoltorio con estado de página, como lo haría la página real
function Harness() {
  const [current, setCurrent] = useState(1)
  return (
    <MovementsSection accountId="a1" page={current} onPageChange={setCurrent} lookup={new Map()} />
  )
}

describe('MovementsSection', () => {
  it('shows the empty state', async () => {
    mockFetch(jsonResponse(page(1, 0)))
    renderWithProviders(<Harness />)
    expect(await screen.findByText('No movements yet')).toBeInTheDocument()
    expect(screen.queryByRole('navigation', { name: 'Movements pages' })).not.toBeInTheDocument()
  })

  it('paginates while there are full pages', async () => {
    const fetchMock = mockFetch(jsonResponse(page(1, 20)), jsonResponse(page(2, 3)))
    renderWithProviders(<Harness />)
    const user = userEvent.setup()

    expect(await screen.findByTestId('movements-range')).toHaveTextContent('Showing 1–20')
    const pagination = screen.getByRole('navigation', { name: 'Movements pages' })
    expect(within(pagination).getByRole('button', { name: 'Previous' })).toBeDisabled()

    await user.click(within(pagination).getByRole('button', { name: 'Next' }))

    expect(await screen.findByText('Showing 21–23')).toBeInTheDocument()
    expect(fetchMock.mock.calls[1]![0]).toBe('/api/accounts/a1/movements?page=2')
    expect(within(pagination).getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('shows the API error', async () => {
    mockFetch(jsonResponse({ code: 'BAD_REQUEST', message: 'Invalid pagination' }, 400))
    renderWithProviders(<Harness />)
    expect(await screen.findByTestId('movements-error-alert')).toHaveTextContent(
      'Invalid pagination',
    )
  })
})
