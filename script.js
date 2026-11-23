const API_BASE_URL = 'http://localhost:5000';

function logDebug(title, data) 
{
    const consoleBox = document.getElementById('debugConsole');
    const timestamp = new Date().toLocaleTimeString();
    const formatted = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
    consoleBox.innerText = `[${timestamp}]\n${title}\n${formatted}\n\n` + consoleBox.innerText;
}

function logDebugUsers(title, data) 
{
    const consoleBox = document.getElementById('debugConsoleUsers');
    const timestamp = new Date().toLocaleTimeString();
    const formatted = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
    consoleBox.innerText = `[${timestamp}]\n${title}\n${formatted}\n\n` + consoleBox.innerText;
}

async function sendRequest() 
{
    const name = document.getElementById('nameInput').value;
    const url = `${API_BASE_URL}/api/test?name=${encodeURIComponent(name)}`;
    
    try 
    {
        const response = await fetch(url);
        const data = await response.json();
        
        document.getElementById('output').innerText = 
            `Code: ${response.status} | Status: ${data.status} | Message: ${data.message}`;

        logDebug(`GET ${url} [${response.status}]`, data);
    } 
    catch (error) 
    {
        document.getElementById('output').innerText = 'Failed to connect with the API server.';
        logDebug(`GET ${url} [FAILED]`, error.message);
    }
}

async function fetchAllReservations() 
{
    const url = `${API_BASE_URL}/api/reservations`;
    
    try 
    {
        const response = await fetch(url);
        const data = await response.json();
        logDebug(`GET ${url} [${response.status}]`, data);
    } 
    catch (error) 
    {
        logDebug(`GET ${url} [FAILED]`, error.message);
    }
}

async function addReservation() 
{
    const roomNumber = document.getElementById('addRoomNumber').value;
    const guestName  = document.getElementById('addGuestName').value;
    const checkIn    = document.getElementById('addCheckIn').value;
    const checkOut   = document.getElementById('addCheckOut').value;
    
    const url = `${API_BASE_URL}/api/reservation-create`;

    if (!roomNumber || !guestName || !checkIn || !checkOut) 
    {
        alert('Please provide room number, guest name, check-in, and check-out');
        return;
    }

    try 
    {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                room_number: parseInt(roomNumber, 10),
                guest_name: guestName,
                check_in: checkIn,
                check_out: checkOut
            })
        });
        
        const data = await response.json();
        logDebug(`POST ${url} [${response.status}]`, data);
    } 
    catch (error) 
    {
        logDebug(`POST ${url} [FAILED]`, error.message);
    }
}

async function deleteReservation() 
{
    const reservationId = document.getElementById('delReservationId').value;
    const url = `${API_BASE_URL}/api/reservation-destroy`;

    if (!reservationId) 
    {
        alert('Please enter a reservation ID to delete');
        return;
    }

    try 
    {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: parseInt(reservationId, 10)
            })
        });
        
        const data = await response.json();
        logDebug(`POST ${url} [${response.status}]`, data);
    } 
    catch (error) 
    {
        logDebug(`POST ${url} [FAILED]`, error.message);
    }
}

async function deleteReservationByRoom() 
{
    const roomNumber = document.getElementById('delRoomNumber').value;
    const url = `${API_BASE_URL}/api/reservation-destroy`;

    if (!roomNumber) 
    {
        alert('Please enter a room number to delete');
        return;
    }

    try 
    {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                room_number: parseInt(roomNumber, 10)
            })
        });
        
        const data = await response.json();
        logDebug(`POST ${url} [${response.status}]`, data);
    } 
    catch (error) 
    {
        logDebug(`POST ${url} [FAILED]`, error.message);
    }
}

async function fetchAllAccounts() 
{
    const url = `${API_BASE_URL}/api/users`;

    try 
    {
        const response = await fetch(url);
        const data = await response.json();
        logDebugUsers(`GET ${url} [${response.status}]`, data);
    } 
    catch (error) 
    {
        logDebugUsers(`GET ${url} [FAILED]`, error.message);
    }
}

async function addAccount() 
{
    const _id = document.getElementById('addId').value;
    const _login = document.getElementById('addLogin').value;
    const _password = document.getElementById('addPassword').value;

    const url = `${API_BASE_URL}/api/user-create`;

    if (!_id || !_login || !_password) 
    {
        alert('Please provide id, login and password');
        return;
    }

    try 
    {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: parseInt(_id, 10),
                acc_login: _login,
                acc_password: _password
            })
        });
        const data = await response.json();
        logDebugUsers(`POST ${url} [${response.status}]`, data);
    } 
    catch (error) 
    {
        logDebugUsers(`POST ${url} [FAILED]`, error.message);
    }
}

async function deleteAccount() 
{
    const _id = document.getElementById('delId').value;
    const url = `${API_BASE_URL}/api/user-destroy`;

    if (!_id) 
    {
        alert('Please provide id');
        return;
    }

    try 
    {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: parseInt(_id, 10)
            })
        });

        const data = await response.json();
        logDebugUsers(`POST ${url} [${response.status}]`, data);
    } 
    catch (error) 
    {
        logDebugUsers(`POST ${url} [FAILED]`, error.message);
    }
}

async function loginAccount() 
{
    const _login = document.getElementById('loginName').value;
    const _password = document.getElementById('loginPassword').value;

    const url = `${API_BASE_URL}/api/user-login`;

    if (!_login || !_password) 
    {
        alert('Please provide login and password');
        return;
    }

    try 
    {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                acc_login: _login,
                acc_password: _password
            })
        });
        const data = await response.json();
        logDebugUsers(`POST ${url} [${response.status}]`, data);

        if (data.status === "success") 
        {
            document.getElementById('currentUser').innerText = _login;
        }
    } 
    catch (error) 
    {
        logDebugUsers(`POST ${url} [FAILED]`, error.message);
    }
}

async function logoutAccount() 
{
    const url = `${API_BASE_URL}/api/user-logout`;

    try 
    {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        logDebugUsers(`POST ${url} [${response.status}]`, data);

        if (data.status === "success") 
        {
            document.getElementById('currentUser').innerText = "None";
            document.getElementById('loginName').value = "";
            document.getElementById('loginPassword').value = "";
        }
    } 
    catch (error) 
    {
        logDebugUsers(`POST ${url} [FAILED]`, error.message);
    }
}
