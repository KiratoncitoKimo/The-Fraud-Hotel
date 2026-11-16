import sqlite3
import hashlib

class RoomReservation:
    def __init__(self, room_number: int, guest_name: str):
        self.room_number = room_number
        self.guest_name = guest_name

    def to_dict(self):
        return {"room_number": self.room_number, "guest_name": self.guest_name}

    def __repr__(self):
        return f"RoomReservation(number={self.room_number}, guest='{self.guest_name}')"

class Account:
    def __init__(self, id: int, login: str, password: str):
        self.id = id
        self.login = login
        self.password = password

    def to_dict(self):
        return {"id": self.id, "login": self.login}

    def __repr__(self):
        return f"Account(id={self.id}, login='{self.login}', password='{self.password}')"
        

class Database:
    def __init__(self, path: str = "api/database.db"):
        self.path = path
        self._init_db()

    def _get_connection(self):
        conn = sqlite3.connect(self.path)
        conn.row_factory = sqlite3.Row

        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS reservations (
                    room_number INTEGER PRIMARY KEY,
                    guest_name TEXT NOT NULL
                )""")
            conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    login TEXT NOT NULL,
                    password TEXT NOT NULL
                )""")

    @classmethod
    def connect(cls, path: str = "database.db"):
        return cls(path)

    def add_reservation(self, room_number: int, guest_name: str):
        with self._get_connection() as conn:
            conn.execute(
                "INSERT OR REPLACE INTO reservations (room_number, guest_name) VALUES (?, ?)",
                (room_number, guest_name)
            )

        return RoomReservation(room_number, guest_name)

    def delete_reservation(self, room_number: int) -> bool:
        with self._get_connection() as conn:
            cursor = conn.execute(
                "DELETE FROM reservations WHERE room_number = ?",
                (room_number,)
            )
            return cursor.rowcount > 0

    def find_reservation(self, room_number: int = None, guest_name: str = "") -> list[RoomReservation]:
        query = "SELECT room_number, guest_name FROM reservations WHERE 1=1"
        params = []

        if room_number is not None:
            query += " AND room_number = ?"
            params.append(room_number)

        if guest_name:
            query += " AND guest_name LIKE ?"
            params.append(f"%{guest_name}%")

        with self._get_connection() as conn:
            cursor = conn.execute(query, params)
            rows = cursor.fetchall()
            return [RoomReservation(row["room_number"], row["guest_name"]) for row in rows]

    def add_account(self, id: int,acc_login: str, acc_password: str):
        with self._get_connection() as conn:
            password_hash = hashlib.md5(acc_password.encode()).hexdigest()
            conn.execute(
                "INSERT OR REPLACE INTO users (id, login, password) VALUES (?, ?, ?)",
                (id, acc_login, password_hash)
            )
            return Account(id,acc_login,acc_password)

    def delete_account(self, id: int) -> bool: 
        with self._get_connection() as conn:
            cursor = conn.execute(
                "DELETE FROM users WHERE id = ?",
                (id,)
            )
            return cursor.rowcount > 0

    def get_accounts(self) -> list[Account]:
        with self._get_connection() as conn:
            cursor = conn.execute("SELECT id, login FROM users")
            rows = cursor.fetchall()
            return [Account(id = row["id"], login = row["login"], password="") for row in rows]

    def authentification(self, acc_login: str, acc_password: str) -> Account | None:
        with self._get_connection() as conn:
            hashed_password = hashlib.md5(acc_password.encode()).hexdigest()
            cursor = conn.execute(
                "SELECT id, login, password FROM users WHERE login = ? AND password = ?",
                (acc_login, hashed_password)
            )
            row = cursor.fetchone()

            if row:
                return Account(id=row["id"], login = row["login"], password = row["password"])

            return None
