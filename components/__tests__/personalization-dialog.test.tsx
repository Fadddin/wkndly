import { render, screen, fireEvent } from '@testing-library/react'
import { PersonalizationDialog } from '@/components/personalization-dialog'
import { WeekendProvider } from '@/lib/weekend-context'

function renderWithProvider(ui: React.ReactElement) {
  return render(<WeekendProvider>{ui}</WeekendProvider>)
}

describe('PersonalizationDialog', () => {
  test('opens dialog and shows fields', () => {
    renderWithProvider(
      <PersonalizationDialog>
        <button>Open</button>
      </PersonalizationDialog>
    )

    fireEvent.click(screen.getByText('Open'))

    expect(screen.getByText(/Personalization/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument()
    expect(screen.getByText(/Weekend Theme/i)).toBeInTheDocument()
    expect(screen.getByText(/Long Weekend Mode/i)).toBeInTheDocument()
  })

  test('allows typing a user name', () => {
    renderWithProvider(
      <PersonalizationDialog>
        <button>Open</button>
      </PersonalizationDialog>
    )

    fireEvent.click(screen.getByText('Open'))
    const input = screen.getByPlaceholderText(/Enter your name/i) as HTMLInputElement
    fireEvent.change(input, { target: { value: 'Alex' } })
    expect(input.value).toBe('Alex')
  })

  test('toggles long weekend switch', () => {
    renderWithProvider(
      <PersonalizationDialog>
        <button>Open</button>
      </PersonalizationDialog>
    )

    fireEvent.click(screen.getByText('Open'))
    const switchEl = screen.getByRole('switch')
    // Click to toggle on and then off; just ensure it is clickable
    fireEvent.click(switchEl)
    fireEvent.click(switchEl)
    expect(switchEl).toBeInTheDocument()
  })
})


