import sqlite3
import hashlib


class RoomReservation:
    def __init__(
        self,
        room_number: int,
        guest_name: str,
        check_in: str,
        check_out: str,
        id: int | None = None,
    ):
        self.id = id
        self.room_number = room_number
        self.guest_name = guest_name
        self.check_in = check_in
        self.check_out = check_out

    def to_dict(self):
        return {
            "id": self.id,
            "room_number": self.room_number,
            "guest_name": self.guest_name,
            "check_in": self.check_in,
            "check_out": self.check_out,
        }

    def __repr__(self):
        return (
            f"RoomReservation(id={self.id}, number={self.room_number}, "
            f"guest='{self.guest_name}', check_in='{self.check_in}', check_out='{self.check_out}')"
        )


class Account:
    def __init__(self, id: int, login: str, password: str, is_admin: bool = False):
        self.id = id
        self.login = login
        self.password = password
        self.is_admin = bool(is_admin)

    def to_dict(self):
        return {"id": self.id, "login": self.login, "is_admin": self.is_admin}

    def __repr__(self):
        return f"Account(id={self.id}, login='{self.login}', password='{self.password}', is_admin={self.is_admin})"

class Database:
    def __init__(self, path: str = "database.db"):
        self.path = path
        self._init_db()

    def _get_connection(self):
        conn = sqlite3.connect(self.path)
        conn.row_factory = sqlite3.Row

        return conn

    def _init_db(self):
        with self._get_connection() as conn:
            columns = [
                row["name"]
                for row in conn.execute("PRAGMA table_info(reservations)").fetchall()
            ]

            if columns and "id" not in columns:
                conn.execute("ALTER TABLE reservations RENAME TO reservations_legacy")
                conn.execute("""
                    CREATE TABLE reservations (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        room_number INTEGER NOT NULL,
                        guest_name TEXT NOT NULL,
                        check_in TEXT NOT NULL,
                        check_out TEXT NOT NULL
                    )
                """)
                conn.execute("""
                    INSERT INTO reservations (room_number, guest_name, check_in, check_out)
                    SELECT room_number, guest_name, '', '' FROM reservations_legacy
                """)
                conn.execute("DROP TABLE reservations_legacy")

            else:
                conn.execute("""
                    CREATE TABLE IF NOT EXISTS reservations (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        room_number INTEGER NOT NULL,
                        guest_name TEXT NOT NULL,
                        check_in TEXT NOT NULL,
                        check_out TEXT NOT NULL
                    )
                """)

            conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY,
                    login TEXT NOT NULL,
                    password TEXT NOT NULL,
                    is_admin INTEGER NOT NULL DEFAULT 0
                )""")

    @classmethod
    def connect(cls, path: str = "database.db"):
        return cls(path)

    def is_room_available(self, room_number: int, check_in: str, check_out: str) -> bool:
        with self._get_connection() as conn:
            cursor = conn.execute(
                """
                SELECT 1 FROM reservations
                WHERE room_number = ?
                  AND check_in < ?
                  AND check_out > ?
                LIMIT 1
                """,
                (room_number, check_out, check_in),
            )
            return cursor.fetchone() is None

    def add_reservation(
        self, room_number: int, guest_name: str, check_in: str, check_out: str
    ) -> RoomReservation:
        with self._get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO reservations (room_number, guest_name, check_in, check_out)
                VALUES (?, ?, ?, ?)
                """,
                (room_number, guest_name, check_in, check_out),
            )
            return RoomReservation(
                room_number=room_number,
                guest_name=guest_name,
                check_in=check_in,
                check_out=check_out,
                id=cursor.lastrowid,
            )

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

    def add_account(self, id: int, acc_login: str, acc_password: str, is_admin: bool = False):
        with self._get_connection() as conn:
            password_hash = hashlib.md5(acc_password.encode()).hexdigest()
            admin_flag = 1 if is_admin else 0
            conn.execute(
                "INSERT OR REPLACE INTO users (id, login, password, is_admin) VALUES (?, ?, ?, ?)",
                (id, acc_login, password_hash, admin_flag),
            )
            return Account(id, acc_login, acc_password, is_admin = bool(is_admin))

    def delete_account(self, id: int) -> bool:
        with self._get_connection() as conn:
            cursor = conn.execute("DELETE FROM users WHERE id = ?", (id,))
            return cursor.rowcount > 0

    def get_accounts(self) -> list[Account]:
        with self._get_connection() as conn:
            cursor = conn.execute("SELECT id, login FROM users")
            rows = cursor.fetchall()
            return [Account(id = row["id"], login = row["login"], password="", is_admin = bool(row["is_admin"])) for row in rows]

    def authentification(self, acc_login: str, acc_password: str) -> Account | None:
        with self._get_connection() as conn:
            hashed_password = hashlib.md5(acc_password.encode()).hexdigest()
            cursor = conn.execute(
                "SELECT id, login, password, is_admin FROM users WHERE login = ? AND password = ?",
                (acc_login, hashed_password)
            )
            row = cursor.fetchone()

            if row:
                return Account(id=row["id"], login = row["login"], password = row["password"], is_admin = bool(row["is_admin"]))

            return None
