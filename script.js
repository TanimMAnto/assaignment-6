const cateList = document.getElementById("cate-list")
const cardContainer = document.getElementById("card-container")
const cartList = document.getElementById("cart-list")
const totalPrice = document.getElementById("total-price");
const modal = document.getElementById("plantModal")

let cart = [];

async function loadShopCategories() {
    const res= await 
    fetch("https://openapi.programming-hero.com/api/categories")
    const data = await res.json();
    console.log(data)
    data.categories.forEach(cat => {
        const btn = document.createElement("button");
        btn.innerText = cat.category;
        btn.className= "btn btn-sm border bg-green-100 hover:bg-green-300";
        btn.onclick =() => loadPlantsByCategories(cat.category_id, btn);
        cateList.appendChild(btn);
    });
    loadAllPlants();
}

async function loadAllPlants() {
    cardContainer.innerHTML="<p>Loading plants...</p>"
    const res = await
    fetch("https://openapi.programming-hero.com/api/plants")
    const data = await res.json();
    console.log(data)
    displayPlants(data.data);
}

async function loadPlantsByCategories(id, btn) {
    cardContainer.innerHTML="<p>Loading plants...</p>"
     const res = await
    fetch(`https://openapi.programming-hero.com/api/category/1`)
    const data = await res.json();
    // console.log("Categories", data)

    Array.from(cateList.children).forEach(b => b.classList.remove("bg-black", "text-white"));
    btn.classList.add("bg-black", "text-white")
    displayPlants(data.plants)
}


function displayPlants(plants)  {
    cardContainer.innerHTML = ""; 
     if(!plants || ! Array.isArray(plants) || plants.length === 0) {
        cardContainer.innerHTML = "<p class='text-red-500'>Not found in this category.</p>";
        return;
     }
    plants.forEach(plant => {
        const card =document.createElement("div")
        card.className = "card bg-white shadow p-4"
        card.innerHTML = `
        <img src="${plant.image}" class="w-full h-40 mb-2">
        <h3 class="font-bold text-lg text-green-700 hover:underline" data-id=${plant.id}">
        ${plant.name}</h3>
        <p>${plant.short_description}</p>
        <p class = "font-semibold">Price: $${plant.price}</p>
        <button class="btn bg-[#15803D] text-white mt-2">Add to Cart</button>
        `;

        card.querySelector("h3").addEventListener("click", () => 
        showPlantDetails(plant.id));


        card.querySelector("button").addEventListener("click", () => 
        addToCart(plant.name, plant.price));

        cardContainer.appendChild(card);
    });
}

function addToCart(name, price){
    cart.push({name, price});
    ranCart();
}

function ranCart() {
    cartList.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
        const li = document.createElement("li")
        li.innerText= `${item.name} - ${item.price} 
        <button onclick="removeFromCart(${index})"
        class="text-red-500">X</button>
        `;
        cartList.appendChild(li);
        total +=item.price
    });
    totalPrice.innerText = total.toFixed(2);
}
function removeFromCart(index) {
    cart.splice(index, 1);
    ranCart()
}

async function showPlantDetails(id) {
    const res = await
    fetch(`https://openapi.programming-hero.com/api/plant/1`);
    const data = await res.json();
    console.log(data);
    const plant = data.data;
    if(!plant){
        alert("detail not available");
        return;
    }

    document.getElementById("modal-title").innerText=plant.name;
    document.getElementById("modal-img").src = plant.image
    document.getElementById("modal-des").innerText= plant.description;

    modal.showModal();
}
loadShopCategories();
