import { render, screen } from '@testing-library/react'
import { WeekendSchedule } from '@/components/weekend-schedule'
import { WeekendProvider } from '@/lib/weekend-context'

function renderWithProvider(ui: React.ReactElement) {
  return render(<WeekendProvider>{ui}</WeekendProvider>)
}

beforeEach(() => {
  localStorage.clear()
})

describe('WeekendSchedule', () => {
  test('renders header', () => {
    renderWithProvider(<WeekendSchedule />)
    expect(screen.getByText(/Weekend Schedule/i)).toBeInTheDocument()
  })

  test('renders base weekend days (Saturday, Sunday)', () => {
    renderWithProvider(<WeekendSchedule />)
    expect(screen.getByText(/Saturday/i)).toBeInTheDocument()
    expect(screen.getByText(/Sunday/i)).toBeInTheDocument()
  })

  test('renders long weekend days when enabled', () => {
    localStorage.setItem('weekendly-long-weekend', JSON.stringify(true))
    renderWithProvider(<WeekendSchedule />)

    expect(screen.getByText(/Friday/i)).toBeInTheDocument()
    expect(screen.getByText(/Monday/i)).toBeInTheDocument()
  })
})


