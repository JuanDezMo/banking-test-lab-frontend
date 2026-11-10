import { render, screen } from '@testing-library/react'
import { createMemoryRouter, RouterProvider } from 'react-router'
import { RouteErrorPage } from './RouteErrorPage'

function Broken(): never {
  throw new Error('Boom while rendering')
}

describe('RouteErrorPage', () => {
  it('replaces a crashed page with a friendly error screen', () => {
    // React registra el error en consola; se silencia para no ensuciar la salida
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const router = createMemoryRouter([
      { path: '/', element: <Broken />, errorElement: <RouteErrorPage /> },
    ])
    render(<RouterProvider router={router} />)

    expect(screen.getByRole('heading', { name: 'Something went wrong' })).toBeInTheDocument()
    expect(screen.getByTestId('route-error-detail')).toHaveTextContent('Boom while rendering')
    expect(screen.getByRole('button', { name: 'Reload page' })).toBeInTheDocument()
  })
})
