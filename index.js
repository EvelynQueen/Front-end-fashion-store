"use strict";

// ------------------ADD + CLEAR EVENT-----------------------------
document.querySelector(".btn_col").addEventListener("click", (event) => {
    if (event.target.id === "add_btn"){
        // Query all input values
        let name = document.querySelector("#name").value;
        let price = document.querySelector("#price").value;
        let amount = document.querySelector("#amount").value;
        let image = document.querySelector("#img").value;
        let desc = document.querySelector("#desc").value;
        // Create item object
        if (!name || !price || !amount || isNaN(price) || isNaN(amount) || !image || !desc) {
            // Show an alert if any field is empty
            alert("Please fill out all fields with valid values before submitting!");
            // clear input fields
            clearItemInfor();
            return; // Stop the function here 
        };

        const item = {
            id: new Date().toISOString(), // Use time as unique id
            name: name.trim(),
            price: price.trim(),
            image: image.trim(),
            amount: amount.trim(), // Corrected the amount line
            desc: desc.trim(),
        };

        addItemToUI(item);
        addItemToLS(item); 
    } else if (event.target.id === "clr_btn"){
        clearItemInfor();
    }
});

// Function to add the object to the UI
const addItemToUI = (item) => {
    const { id, name, price, amount, image, desc } = item; // Destructure all item properties
    const newCard = document.createElement("button");
    newCard.setAttribute("data-id", id); // Add the item's id to the button as data-id
    newCard.className = "item border border-none rounded-4 m-3";
    newCard.innerHTML = `
        <img src=${image} alt=${name} class="item_img rounded-top-4 h-75 ">
        <div class="item_info mx-4 h-25">
            <p class="item_name mb-1">${name}</p>
            <div class="item_price d-flex justify-content-between">
                <p>${price}$</p>
                <del>${price*2}$</del>
            </div>
            <p class="d-none">${desc}</p>
        </div>
    `;

    // Append the new card to the container
    document.querySelector(".item_container").appendChild(newCard);
};
// function to get list from LocalStorage
const getList = () =>{
    return JSON.parse(localStorage.getItem("list")) || [];
    // if have string => parse into object | not []
}
// Function to add the object to the LS
const addItemToLS = ((item) => {
    const list = getList(); //get List from local storage
    list.push(item); //push new item into list object
    localStorage.setItem("list", JSON.stringify(list)); //stringtofy item object to json string and push onto LS)
});

// render all item from Ls to UI once we load website
const init = () => {
    const list = getList();//take list item from LS
    list.forEach((item) => {
        addItemToUI(item); //render each item to UI
    });
};

init();

//// ------------------SHOW INFORMATION + DELETE + CLEAR EVENT-----------------------------
// function to show item infor
const showItemInfor = (item) => {
    // Display values in the input fields
    document.querySelector("#name").value = item.name;
    document.querySelector("#price").value = item.price;
    document.querySelector("#amount").value = item.amount;
    document.querySelector("#img").value = item.image;
    document.querySelector("#desc").value = item.desc;
};
// function to clear item infor
const clearItemInfor = () =>{
    document.querySelector("#name").value = '';
    document.querySelector("#price").value = '';
    document.querySelector("#amount").value = '';
    document.querySelector("#img").value = '';
    document.querySelector("#desc").value = '';
}
// function to remove item from LS
const removeItemFromLS = (idRemove) => {
    let list = getList(); //lấy danh sách item về
    list = list.filter((item) => item.id != idRemove); //lọc những thằng khác id cần xóa
    localStorage.setItem("list", JSON.stringify(list)); //lưu lên lại 
};

// Add event listener to the whole item_container to capture clicks
document.querySelector(".item_container").addEventListener("click", (event) => {
    // Check if the clicked element have "item" class as parent
    const clickedItem = event.target.closest(".item");
    // Show infor if an item was clicked
    if (clickedItem) {
        const id = clickedItem.getAttribute("data-id"); // Get the id from the clicked item
        const list = JSON.parse(localStorage.getItem("list")) || []; // Retrieve the list from LocalStorage
        const selectedItem = list.find(item => item.id === id); // Find the item by ID
        showItemInfor(selectedItem); // Display the item info in the input fields

        // Adding event listener for delete button within the item itself
        document.querySelector(".btn_col").addEventListener("click", (event) => {
            if (event.target.id === "del_btn") {
                clickedItem.remove(); // Remove the clicked items element
                clearItemInfor(); // Clear  input fields
                removeItemFromLS(id); // Remove item from LS
            } else if (event.target.id === "clr_btn"){
                clearItemInfor();
            };
        });
    };
});



// ------------------SEARCHING FUNCTION-----------------------------
document.querySelector(".search_field").addEventListener("keyup", (event) =>{
    //take input information from input field
    let inputValue = event.target.value.toLowerCase(); 
    //Show items if the search_btn is clicked
    document.querySelector(".search_btn").addEventListener("click", (event) =>{
        let list = getList();
        list = list.filter((item) => item.name.toLowerCase().includes(inputValue));
        //xóa các item cũ trong list
        document.querySelector(".item_container").innerHTML = ""; //clear item in container
        list.forEach((item) =>{
            addItemToUI(item);
        });
    });
});

// -----------------PREVENT null---------------------------------
