import { useEffect, useState } from 'react'

const API_BASE_URL = 'http://localhost:5000'

interface ApiReservation {
  id: number
  room_number: number
  guest_name: string
  check_in: string
  check_out: string
}

interface DashboardReservation {
  id: number
  guest: string
  room: string
  roomNumber: number
  checkInRaw: string
  checkOutRaw: string
  checkInFormatted: string
  checkOutFormatted: string
  status: string
}

function formatDateTimePL(isoString: string): string {
  if (!isoString) return 'Brak danych'
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return isoString

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}`
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
              id: item.id,
              guest: item.guest_name,
              room: `Pokój ${item.room_number}`,
              roomNumber: item.room_number,
              checkInRaw: item.check_in,
              checkOutRaw: item.check_out,
              checkInFormatted: formatDateTimePL(item.check_in),
              checkOutFormatted: formatDateTimePL(item.check_out),
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
  const now = new Date()

  const currentlyOccupiedRooms = new Set(
    reservations
      .filter((r) => {
        const start = new Date(r.checkInRaw)
        const end = new Date(r.checkOutRaw)
        return (
          !Number.isNaN(start.getTime()) &&
          !Number.isNaN(end.getTime()) &&
          start <= now &&
          now < end
        )
      })
      .map((r) => r.roomNumber)
  ).size

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
          <strong>{reservations.length}</strong>
        </article>

        <article className="stat-card">
          <span>Wolne pokoje</span>
          <strong>{Math.max(0, TOTAL_ROOMS - currentlyOccupiedRooms)}</strong>
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
                  <th scope="col">ID</th>
                  <th scope="col">Gość</th>
                  <th scope="col">Pokój</th>
                  <th scope="col">Zameldowanie</th>
                  <th scope="col">Wymeldowanie</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>

              <tbody>
                {!loading && reservations.length === 0 ? (
                  <tr>
                    <td colSpan={6}>Brak aktywnych rezerwacji w bazie danych.</td>
                  </tr>
                ) : (
                  reservations.map((reservation) => (
                    <tr key={reservation.id}>
                      <td>#{reservation.id}</td>
                      <td>{reservation.guest}</td>
                      <td>{reservation.room}</td>
                      <td>{reservation.checkInFormatted}</td>
                      <td>{reservation.checkOutFormatted}</td>
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
