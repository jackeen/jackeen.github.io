var selectedRoom =''; 
var people='';
var dated='';
document.addEventListener('DOMContentLoaded', function() {
    setMinDateTime();
    setInterval(setMinDateTime, 60000);  // Update minimum time every minute to keep it current
    loadData();
});

let rooms = {
    // will get data from other functions   
};


// for (let i = 0; i <= 9; i++) {
//     let room = document.getElementById(`room${i}`);
//     let image = $(`#image${i}`);
//     image.src = `${i}.PNG`
    
//     room.addEventListener('mouseover', function() {
//         image.css('display', 'block');
//         var number=rooms.Room[i]['capacity'];
//         document.getElementById('showcapacity').innerText = "This room's capacity is:"+number;
//         document.getElementById('showprice').innerText = "This room's price is :"+rooms.Room[i]['price']+"$";
//     });

//     room.addEventListener('mouseout', function() {
//         image.css('display', 'none');
//         if(selectedRoom!=i){
        
//         document.getElementById('showcapacity').innerText = "";   
//         document.getElementById('showprice').innerText = "";}  
//     });
    
    
// }
function calculateDays(checkIn, checkOut) {
    const date1 = new Date(checkIn);
    const date2 = new Date(checkOut);
    const difference = date2 - date1;  // Difference in milliseconds
    const days = difference / (1000 * 3600 * 24);  // Convert milliseconds to days
    return Math.ceil(days);  // Use Math.ceil to ensure that any part of a day counts as a full day
}

function mouseout() { for (let i = 0; i <= 9; i++) {
    let room = document.getElementById(`room${i}`);
    let image = $(`#image${i}`);
    image.attr('src',rooms.Room[i]['image']);
    
    room.addEventListener('mouseover', function() {
        image.css('display', 'block');
        let checkInDate = document.getElementById('checkIn').value;
        let checkOutDate = document.getElementById('checkOut').value;
        let days = calculateDays(checkInDate, checkOutDate);

        var number=rooms.Room[i]['capacity'];
        document.getElementById('showcapacity').innerText = "This room's capacity is:"+number;
        document.getElementById('showprice').innerText = "This room's price is :"+rooms.Room[i]['price']+"$ Per day."+ "\nYour total cost is:"+rooms.Room[i]['price']*days+"$";
        showDescription(i);
    });

    room.addEventListener('mouseout', function() {
        image.css('display', 'none');
        if(selectedRoom!=i){
        
        document.getElementById('showcapacity').innerText = "";   
        document.getElementById('showprice').innerText = "";}  
    });
    
    
} }

button.addEventListener('click', function(){
    let checkInDate = document.getElementById('checkIn').value;
    let checkOutDate = document.getElementById('checkOut').value;
    if (selectedRoom !== ''&& dated !='') {
        let roomIndex = parseInt(selectedRoom);  // Ensure selectedRoom is an integer
        let room = rooms.Room[roomIndex];  // Access the selected room data

        if (room['isbooked'] === 'true') {
            alert('This room is already booked.');
        } else {
            room['isbooked'] = 'true';  // Update the booking status
            updateRoomStyles();  // Call to update the visual style of rooms
            let days = calculateDays(checkInDate, checkOutDate);
            let totalPeople = parseInt(people);  // Ensure people is an integer
            let totalCost = room['price']*days;  // Assuming price is already defined in room data
            checkInDate = new Date(checkInDate);
            checkOutDate = new Date(checkOutDate);
            alert('You have booked room ' + (roomIndex + 1) + ' for ' + totalPeople + ' person(s).' + 
                  '\nThe price per day is:'+room['price']+'\nThe total price from '+checkInDate.toLocaleDateString()+' '+checkInDate.toLocaleTimeString()+' to '+ checkOutDate.toLocaleDateString()+' '+checkOutDate.toLocaleTimeString() +' is: $' + totalCost);
        }
    } else {
        alert("Please select a room or time to book");
    }
});


document.querySelectorAll('.room').forEach(room => {


    room.addEventListener('click', function() {
        const roomId = this.id.replace('room', '');
        
        
        selectRoom(roomId);
    });
});


    function updateRoomStyles() {
        for (let i = 0; i < 10; i++) {
           
           var booked = rooms.Room[i]['isbooked']=== 'true'; 
            const roomElement = document.getElementById(`room${i}`);
            roomElement.style.outline = booked ? '3px solid red' : '3px solid green';
            
        }
    }


function getMinDateTime() {
    var now = new Date();
    var dateString = now.toISOString().substring(0, 16); // Gets the current date and time in YYYY-MM-DDTHH:MM format
    console.log("Current DateTime: ", now);
    console.log("ISO String Format: ", dateString);
    return dateString;
}

function setMinDateTime() {
    var dateString = getMinDateTime();
    var checkInInput = document.getElementById('checkIn');
    var checkOutInput = document.getElementById('checkOut');

    if (!checkInInput.value || new Date(checkInInput.value) < new Date()) {
        checkInInput.value = '';
        checkInInput.min = dateString;
    }

    if (!checkOutInput.value || new Date(checkOutInput.value) < new Date()) {
        checkOutInput.value = '';
        checkOutInput.min = dateString;
    }
}
//createContent(roomid) is not used any more
function createContent(roomid) {
    console.log("Creating content for room:", roomid); // Check if function is called
    // Create a container for the rectangle
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.border = '2px solid black'; // Style for the rectangle
    container.style.padding = '10px';
    container.style.display = 'inline-block';
    container.style.backgroundColor = 'white'; // Add background color for visibility
    container.style.zIndex = '1000'; // Ensure it's on top

    const image = document.createElement('img');
    image.src = roomid+'.PNG';
    image.alt = 'Display Image';
    image.style.width = '100px'; // Adjust the size as needed
    image.style.height = '100px';
    // Create the image element
    var descriptions = {
        1: "Room 1: A single room with beautiful views of the garden.",
        2: "Room 2: Perfect for couples, features a double bed.",
        3: "Room 3: Spacious room suitable for up to three people.",
        4: "Room 4: Family room with four beds and a private balcony.",
        5: "Room 5: Penthouse suite with top amenities for luxury stays.",
        6: "Room 6: Penthouse suite with top amenities for luxury stays."
    };

    // Create the text element
    const text = document.createElement('p');
    text.textContent =descriptions[roomid] ;
    text.style.position = 'absolute';
    text.style.bottom = '5px';
    text.style.width = '100%';
    text.style.textAlign = 'center';

    // Append the image and text to the rectangle
    container.appendChild(image);
    container.appendChild(text);

    // Append the rectangle to the body or a specific element
    document.body.appendChild(container);
    console.log("Creating content for room:", roomid); // Check if function is called
}

function showDescription(roomNumber) {
    var descriptions = {
        0: "Room 1: A single room with beautiful views of the garden.",
        1: "Room 2: Perfect for couples, features a double bed.",
        2: "Room 3: Spacious room suitable for up to two people.",
        3: "Room 4: Perfect for couples, features a double bed.",
        4: "Room 5: Perfect for couples, features a double bed.",
        5: "Room 6: Family room with four beds and a private balcony",
        6: 'Room 7: Family room with four beds and a private balcony',
        7: 'Room 8: Penthouse suite with top amenities for luxury stays.',
        8: 'Room 9: Penthouse suite with top amenities for luxury stays.',
        9: 'Room 10: A very big house with beautiful views and big garden."',
    };
    document.getElementById('roomDescription').innerText = descriptions[roomNumber];
    
}
function selectRoom(roomNumber) {
    
    let numberOfPeople = parseInt(document.getElementById('capacity').value);
    let room = rooms.Room[roomNumber]['isbooked'];
    let capacity = rooms.Room[roomNumber]['capacity'];
    let number = parseInt(roomNumber)+1;
    if (room=='true') {
        alert('Room ' + number + ' is already booked.');
    } else if (numberOfPeople > capacity) {
        alert('Room ' + number + ' cannot accommodate ' + numberOfPeople + ' people.');
    } else {
        alert('Room ' + number + ' selected for ' + numberOfPeople + ' people!');
        selectedRoom = roomNumber; // Store the selected room number
        people = numberOfPeople;
    
    }
}

document.getElementById('checkIn').addEventListener('change', validateDateTime());
document.getElementById('checkOut').addEventListener('change', validateDateTime());
document.getElementById('checkOut').addEventListener('click', function(){
    try {
    var checkInInput = document.getElementById('checkIn');
    var checkOutInput = document.getElementById('checkOut');
    var checkInDate = new Date(checkInInput.value);
    var minCheckOutDate = new Date(checkInDate.getTime() + (24 * 60 * 60 * 1000));
    checkOutInput.min = minCheckOutDate.toISOString().substring(0, 16);
    } catch (error) {
        
    }
    
});

function validateDateTime() {
    var input = this;
    dated = '';
    const dateValue = new Date(input.value);
    const now = new Date();
    if (dateValue < now) {
        console.log("Selected date is in the past: ", dateValue < now);
        alert('You cannot select a past date or time.');
        input.value = "";  // Reset time
    }
    if (input.id === 'checkIn' || input.id === 'checkOut') {
        var checkInInput = document.getElementById('checkIn');
        var checkOutInput = document.getElementById('checkOut');
        if (checkInInput.value && checkOutInput.value) {
            var checkInDate = new Date(checkInInput.value);
            var checkOutDate = new Date(checkOutInput.value);
            var timeDiff = checkOutDate - checkInDate;

            // Ensure check-out is after check-in
            var minCheckOutDate = new Date(checkInDate.getTime() + (24 * 60 * 60 * 1000));
            checkOutInput.min = minCheckOutDate.toISOString().substring(0, 16);

            if (checkOutDate < minCheckOutDate) {
                checkOutInput.value = "";
                alert('The check out time must be later than check in time. \n Hint: Booking less than one day will be counted as one full day of charges ');  
            
            }
             // Check if the check-out time is less than 24 hours after check-in
            else if (timeDiff < 24 * 60 * 60 * 1000) {
                alert('Check-out time is less than 24 hours from check-in. This will be counted as one full day of charges.')
            }
            else{
                dated = 'true';
            }
            
        }
       
    }
     dated = 'true';
}
/*
async function fetchAndParseXML(path) {
    try {
        const response = await fetch(path);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.text();
        return parseRoomDetails(data);  // This assumes parseRoomDetails is correctly set up as shown earlier
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        return {};  // Return an empty object on error to simplify error handling downstream
    }
}
*/


function parseRoomDetails(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "application/xml");
    const rooms = xmlDoc.querySelectorAll("Room > *");
    const roomDetails = {};

    rooms.forEach(room => {
        const roomNumber = room.tagName;
        roomDetails[roomNumber] = {
            isBooked: room.querySelector("isbooked").textContent === 'true',
            capacity: parseInt(room.querySelector("capacity").textContent, 10),
            price: parseFloat(room.querySelector("price").textContent),
            image: room.querySelector("image").textContent
        };
    });

    return roomDetails;
}



function bookDOM2JSON(xml) {
    const room = {};
    const root = xml.childNodes[0];
    
    let books = [];
    Array.from(root.children).forEach((room, i) => {
        let book = {
            "isbooked": (room.getElementsByTagName("isbooked")[0].innerHTML),
            "capacity": Number(room.getElementsByTagName("capacity")[0].innerHTML),
            "price": Number(room.getElementsByTagName("price")[0].innerHTML),
            "image": room.getElementsByTagName("image")[0].innerHTML,
        };
        books.push(book);
    });

    room["Room"] = books;
    return room;
}

function loadData() {
    fetch("./rooms.xml").then((res) => {
        return res.text();
    }).then((res) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(res, "text/xml");
        return xml;

    }).then((xml) => {
        return bookDOM2JSON(xml);

    }).then((json) => {
        rooms = json;
        updateRoomStyles();
        mouseout();
        //here 
        console.log(json);
    }).catch(error => {
        console.error("There is an error during loading data.");
        console.error(error.toString());
    });
}

function getData(value,data) {
    fetch("./rooms.xml").then((res) => {
        return res.text();
    }).then((res) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(res, "text/xml");
        return xml;

    }).then((xml) => {
        return bookDOM2JSON(xml);

    }).then((json) => {
        rooms = json;
        function getDatas(value, data) {

            const roomData = rooms.Room[value][data];
            
            console.log(roomData);
                return roomData;
        
        }
        return getDatas(value, data) ;

    }).catch(error => {
        console.error("There is an error during loading data.");
        console.error(error.toString());
    });
}

// function loadData() {
//     fetch("./rooms.xml").then((res) => {
//         return res.text();
//     }).then((res) => {
//         const parser = new DOMParser();
//         const xml = parser.parseFromString(res, "text/xml");
//         return xml;

//     }).then((xml) => {
//         return bookDOM2JSON(xml);

//     }).then((json) => {
//         rooms = json;
//         //here 
//         console.log(rooms);
//         console.log(getData(2,'isbooked'))

//     }).catch(error => {
//         console.error("There is an error during loading data.");
//         console.error(error.toString());
//     });
// }

// function getData(room, data) {
//     if (rooms && rooms.Room && rooms.Room.length > room) {
//         const roomData = rooms.Room[room];
//         if (rooms.hasOwnProperty(data)) {
//             return rooms[data];
//         } else {
//             console.error("Invalid data key. Available keys are 'isbooked', 'capacity', 'price', 'image'.");
//             return undefined;
//         }
//     } else {
//         console.error("Invalid room index or data not loaded yet.");
//         return undefined;
//     }
// }
// function getData(room, data) {

//     const roomData = rooms.Room[room][data];
//         return roomData;

// }


