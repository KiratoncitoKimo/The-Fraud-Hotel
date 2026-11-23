import { useEffect, useState } from 'react'

const API_BASE_URL = 'http://localhost:5000'

interface ApiReservation {
  room_number: number
  guest_name: string
}

interface DashboardReservation {
  id: number
  guest: string
  room: string
  dates: string
  status: string
}

function AdminDashboard() {
  const [reservations, setReservations] = useState<DashboardReservation[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/reservations`)
        if (!response.ok) {
          throw new Error(`Błąd serwera: ${response.status}`)
        }

        const result = await response.json()

        if (result.status === 'success' && Array.isArray(result.data)) {
          const mapped: DashboardReservation[] = result.data.map(
            (item: ApiReservation) => ({
              id: item.room_number,
              guest: item.guest_name,
              room: `Pokój ${item.room_number}`,
              dates: 'Brak danych w bazie',
              status: 'Potwierdzona',
            })
          )
          setReservations(mapped)
        } else {
          setError(result.message || 'Nie udało się pobrać rezerwacji.')
        }
      } catch (err) {
        setError('Brak połączenia z serwerem API.')
      } finally {
        setLoading(false)
      }
    }

    fetchReservations()
  }, [])

  const TOTAL_ROOMS = 10
  const activeReservationsCount = reservations.length

  return (
    <section className="admin-page">
      <div className="admin-header">
        <span className="luxury-eyebrow">THE FRAUD HOTEL · ADMINISTRACJA</span>
        <h1>Wszystko pod kontrolą.</h1>
        <p>Zarządzanie hotelem The Fraud Hotel</p>
      </div>

      <div className="admin-stats">
        <article className="stat-card">
          <span>Liczba pokoi</span>
          <strong>{TOTAL_ROOMS}</strong>
        </article>

        <article className="stat-card">
          <span>Wszystkie rezerwacje</span>
          <strong>{activeReservationsCount}</strong>
        </article>

        <article className="stat-card">
          <span>Wolne pokoje</span>
          <strong>{Math.max(0, TOTAL_ROOMS - activeReservationsCount)}</strong>
        </article>
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Ostatnie rezerwacje</h2>
          <span>
            {loading
              ? 'Ładowanie danych...'
              : error
              ? 'Błąd połączenia'
              : 'Połączono z API'}
          </span>
        </div>

        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div
            className="table-wrapper"
            tabIndex={0}
            role="region"
            aria-label="Ostatnie rezerwacje — tabela"
          >
            <table className="reservations-table">
              <thead>
                <tr>
                  <th scope="col">Nr pokoju</th>
                  <th scope="col">Gość</th>
                  <th scope="col">Pokój</th>
                  <th scope="col">Termin pobytu</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>

              <tbody>
                {!loading && reservations.length === 0 ? (
                  <tr>
                    <td colSpan={5}>Brak aktywnych rezerwacji w bazie danych.</td>
                  </tr>
                ) : (
                  reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>#{reservation.id}</td>
                      <td>{reservation.guest}</td>
                      <td>{reservation.room}</td>
                      <td>{reservation.dates}</td>
                      <td>
                        <span
                          className={
                            reservation.status === 'Potwierdzona'
                              ? 'status status-confirmed'
                              : 'status status-pending'
                          }
                        >
                          {reservation.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminDashboard
