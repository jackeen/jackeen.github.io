
function bookDOM2JSON(xml) {
    const room = {};
    const root = xml.childNodes[0];
    
    let books = [];
    Array.from(root.children).forEach((room, i) => {
        let book = {
            "isbooked": Boolean(room.getElementsByTagName("isbooked")[0].innerHTML),
            "capacity": Number(room.getElementsByTagName("capacity")[0].innerHTML),
            "price": Number(room.getElementsByTagName("price")[0].innerHTML),
            "image": room.getElementsByTagName("price")[0].innerHTML,
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

        //here 
        console.log(json);
    }).catch(error => {
        console.error("There is an error during loading data.");
        console.error(error.toString());
    });
}

loadData();
