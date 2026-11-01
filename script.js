const API_BASE_URL = 'http://localhost:5000';

function logDebug(title, data) 
{
    const consoleBox = document.getElementById('debugConsole');
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
	
    const url = `${API_BASE_URL}/api/reservation-create`;

    if (!roomNumber || !guestName) 
	{
        alert('Please provide both room number and guest name');
        return;
    }

    try 
	{
        const response = await fetch
		(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                room_number: parseInt(roomNumber, 10),
                guest_name: guestName
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
    const roomNumber = document.getElementById('delRoomNumber').value;
	
    const url = `${API_BASE_URL}/api/reservation-destroy`;

    if (!roomNumber) 
	{
        alert('Please enter a room number to delete');
        return;
    }

    try 
	{
        const response = await fetch
		(url, {
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