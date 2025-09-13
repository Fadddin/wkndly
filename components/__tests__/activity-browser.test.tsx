import { render, screen, fireEvent } from '@testing-library/react'
import { ActivityBrowser } from '@/components/activity-browser'
import { WeekendProvider } from '@/lib/weekend-context'

function renderWithProvider(ui: React.ReactElement) {
  return render(<WeekendProvider>{ui}</WeekendProvider>)
}

describe('ActivityBrowser', () => {
  test('renders header and search input', () => {
    renderWithProvider(<ActivityBrowser />)

    expect(screen.getByText(/Browse Activities/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search activities/i)).toBeInTheDocument()
  })

  test('shows category tabs', () => {
    renderWithProvider(<ActivityBrowser />)

    expect(screen.getByRole('tab', { name: /All/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Outdoor/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Food/i })).toBeInTheDocument()
  })

})


