import standardImage from '../assets/room-standard.jpg'
import deluxeImage from '../assets/room-deluxe.jpg'
import suiteImage from '../assets/room-suite.jpg'

type Room = {
  id: number
  name: string
  description: string
  price: number
  guests: number
  image: string
}

const rooms: Room[] = [
  {
    id: 1,
    name: 'Pokój Standard',
    description: 'Przytulny pokój idealny na krótki pobyt.',
    price: 220,
    guests: 2,
    image: standardImage,
  },
  {
    id: 2,
    name: 'Pokój Deluxe',
    description: 'Przestronny pokój z eleganckim wyposażeniem.',
    price: 350,
    guests: 2,
    image: deluxeImage,
  },
  {
    id: 3,
    name: 'Apartament',
    description: 'Luksusowy apartament zapewniający wyjątkowy komfort.',
    price: 550,
    guests: 4,
    image: suiteImage,
  },
]



function UserDashboard() {
  return (
   <section className="rooms-page">
      <div className="rooms-header">
        <span className="luxury-eyebrow">TWÓJ POBYT · THE FRAUD HOTEL</span>
        <h1>Przestrzeń dla Ciebie.</h1>
        <p>
          Wybierz pokój dopasowany do swoich potrzeb
          i zaplanuj niezapomniany pobyt.
        </p>
      </div>

      <div className="rooms-grid">
        {rooms.map((room) => (
          <article className="room-card" key={room.id}>
            <img src={room.image} alt={room.name} loading="lazy" width="900" height="675" />

            <div className="room-details">
              <h2>{room.name}</h2>
              <p>{room.description}</p>

              <div className="room-info">
                <span>Do {room.guests} osób </span>
                <strong>{room.price} zł / noc</strong>
              </div>

              <button className="room-button" disabled>
                Rezerwacja wkrótce
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default UserDashboard
