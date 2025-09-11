import { render, screen, fireEvent } from '@testing-library/react'
import { SavedPlansDialog } from '@/components/saved-plans-dialog'
import { WeekendProvider } from '@/lib/weekend-context'

function renderWithProvider(ui: React.ReactElement) {
  return render(<WeekendProvider>{ui}</WeekendProvider>)
}

beforeEach(() => {
  localStorage.clear()
})

describe('SavedPlansDialog', () => {
  test('shows empty state when there are no saved plans', () => {
    renderWithProvider(
      <SavedPlansDialog>
        <button>Open</button>
      </SavedPlansDialog>
    )

    fireEvent.click(screen.getByText('Open'))
    expect(screen.getByRole('heading', { name: /Saved Plans/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByText(/No saved plans yet/i)).toBeInTheDocument()
  })

  test('can save a plan when there are selected activities', () => {
    localStorage.setItem('weekendly-selected-activity-ids', JSON.stringify([1]))

    renderWithProvider(
      <SavedPlansDialog>
        <button>Open</button>
      </SavedPlansDialog>
    )

    fireEvent.click(screen.getByText('Open'))

    // Save Current Plan section should be visible
    const nameInput = screen.getByPlaceholderText(/Enter plan name/i)
    fireEvent.change(nameInput, { target: { value: 'My Weekend Plan' } })
    fireEvent.click(screen.getByText('Save Plan'))

    expect(screen.getByText(/Your Saved Plans \(1\)/i)).toBeInTheDocument()
    expect(screen.getByText('My Weekend Plan')).toBeInTheDocument()
  })

  test('clicking Load closes the dialog', () => {
    localStorage.setItem('weekendly-selected-activity-ids', JSON.stringify([1]))

    renderWithProvider(
      <SavedPlansDialog>
        <button>Open</button>
      </SavedPlansDialog>
    )

    fireEvent.click(screen.getByText('Open'))
    const nameInput = screen.getByPlaceholderText(/Enter plan name/i)
    fireEvent.change(nameInput, { target: { value: 'Plan A' } })
    fireEvent.click(screen.getByText('Save Plan'))

    const loadButton = screen.getByRole('button', { name: /Load/i })
    fireEvent.click(loadButton)

    // Dialog should close, so the title is no longer present
    expect(screen.queryByText(/Saved Plans/i)).not.toBeInTheDocument()
  })
})


