const reservations = [
  {
    id: 1,
    guest: 'Jan Kowalski',
    room: 'Pokój Standard',
    dates: '10.11.2026 – 13.11.2026',
    status: 'Potwierdzona',
  },
  {
    id: 2,
    guest: 'Anna Nowak',
    room: 'Pokój Deluxe',
    dates: '15.11.2026 – 18.11.2026',
    status: 'Oczekująca',
  },
  {
    id: 3,
    guest: 'Piotr Wiśniewski',
    room: 'Apartament',
    dates: '20.11.2026 – 23.11.2026',
    status: 'Potwierdzona',
  },
]


function AdminDashboard() {
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
          <strong>3</strong>
        </article>

        <article className="stat-card">
          <span>Wszystkie rezerwacje</span>
          <strong>3</strong>
        </article>

        <article className="stat-card">
          <span>Oczekujące rezerwacje</span>
          <strong>1</strong>
        </article>
      </div>

      <div className="admin-section">
        <div className="admin-section-header">
          <h2>Ostatnie rezerwacje</h2>
          <span>Dane demonstracyjne</span>
        </div>

        <div className="table-wrapper" tabIndex={0} role="region" aria-label="Ostatnie rezerwacje — tabela">
          <table className="reservations-table">
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Gość</th>
                <th scope="col">Pokój</th>
                <th scope="col">Termin pobytu</th>
                <th scope="col">Status</th>
              </tr>
            </thead>

            <tbody>
              {reservations.map((reservation) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboard
