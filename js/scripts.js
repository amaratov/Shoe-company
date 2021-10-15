// constructors for Objects
function StoreItem(id,name,price,qty,max,category,shipping,reviews,description,image) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.qty = qty;
    this.max = max;
    this.category = category;
    this.shipping = shipping;
    this.reviews = reviews;
    this.description = description;
    this.image = image;
}
function CartItem(id,price,qty,shipping){
    this.id = id;
    this.price = price;
    this.qty = qty;
    this.shipping = shipping;
}

//global variables
let storeItems = [],
    cartItems = [],
    currency = "CAD";

//function that is being called on load to display time, populate array and call functions to display data
function onload(){
    getTime();
    populateStore();
    displayStore();
    displayCart();
}

function displayStore() {
    //get the category of items
    let category = document.getElementById("categories").value;

    document.getElementById('main').innerHTML = "";
    for (let i = 0; i < storeItems.length; i++) {

        if (storeItems[i].category===category || category==="all"){
            let item = document.createElement("div");
            item.classList.add("storeItem");

            let img = document.createElement("img");
            img.src = storeItems[i].image;

            let id = document.createElement("p");
            id.innerHTML = "Product ID:"+storeItems[i].id;

            let name = document.createElement("h2");
            name.innerHTML = storeItems[i].name;

            let price = document.createElement("p");
            price.innerHTML = "Price: "+storeItems[i].price+" "+currency;

            let qty = document.createElement("p");
            qty.innerHTML = "Available: "+storeItems[i].qty;

            let max = document.createElement("p");
            max.innerHTML = "Maximum per customer"+storeItems[i].max;

            let quantity = document.createElement("input");
            quantity.type="number";
            quantity.value = "1";

            let description = document.createElement("button");
            description.innerHTML = "View Description";
            description.onclick=function(){
                itemDescription(i);
            };

            let review = document.createElement("button");
            review.innerHTML = "Leave Review";
            review.onclick = function(){
                let review = prompt("Leave review");
                addReviewTo(i,review);
            };

            let button = document.createElement("button");
            button.innerHTML="Add to Cart";
            button.onclick = function(e){
                addToCart(i, quantity.value);
            };

            item.appendChild(img);
            item.appendChild(name);
            item.appendChild(id);
            item.appendChild(qty);
            item.appendChild(max);
            item.appendChild(price);
            item.appendChild(description);
            item.appendChild(review);
            item.appendChild(quantity);
            item.appendChild(button);

            document.getElementById('main').appendChild(item);
        }


    }
}
function displayCart(){
    let list = document.getElementById("listBody");
    //clear table before looping
    list.innerHTML = "";
    if(cartItems.length>0){
        for (let i = 0; i < cartItems.length; i++) {
            //insert id
            let row = list.insertRow(),
                cell = row.insertCell(),
                text = document.createTextNode(cartItems[i].id);
                cell.appendChild(text);
            //insert price
            cell = row.insertCell();
            text = document.createTextNode(cartItems[i].price);
            cell.appendChild(text);

            //insert quantity
            cell = row.insertCell();
            text = document.createTextNode(cartItems[i].qty);
            cell.appendChild(text);

            //insert subtotal
            cell = row.insertCell();
            let subtotal = parseInt(cartItems[i].qty)*parseInt(cartItems[i].price);
            text = document.createTextNode(subtotal.toString());
            cell.appendChild(text);

            //insert remove buttons
            cell = row.insertCell();
            let remove = document.createElement("button");
            remove.innerHTML="Remove";
            remove.onclick = function () {
                removeSingleItem(cartItems[i].id);
            };
            cell.appendChild(remove);
            let removeAll = document.createElement("button");
            removeAll.innerHTML = "Remove All";
            removeAll.onclick = function() {
                removeAllItems(cartItems[i].id);
            };
            cell.appendChild(removeAll);
       }
       //call function to output totalPrice
    }else{
        list.innerHTML = "No items";
    }
    calculateTotal();

}

//function to add item to the cart
function addToCart(item,qty){
    item = storeItems[item];
    qty = parseInt(qty);
    if (isNaN(qty)||qty<=0){
        console.log("NAN or 0");
        alert("Please add valid number to the cart");
        return;
    }
    if(cartItems.length>2){
        for (let i = 0; i < cartItems.length; i++) {
            if(item.id===cartItems[i].id){
                let check = qty+parseInt(cartItems[i].qty);
                if(check>parseInt(item.max)){
                    alert("can't add more than "+item.max);
                    return;
                }else{
                    cartItems[i].qty = check;
                    item.qty-=qty;
                    displayStore();
                    displayCart();
                    return;
                }
            }
        }
        let cartItem = new CartItem(item.id,item.price,qty,item.shipping);
        item.qty-=qty;
        displayStore();
        displayCart();
        cartItems.push(cartItem);
    }else{
        if(qty>item.max){
            alert("can't add more than "+item.max);
        }else{
            let cartItem = new CartItem(item.id,item.price,qty,item.shipping);
            cartItems.push(cartItem);
            item.qty-=qty;
            displayStore();
            displayCart();
        }
    }
}

//function to calculate total
function calculateTotal(){
    //calculate all the prices
    let itemsSubtotal = 0,
        shipping = 0,
        subtotal = 0,
        tax = 0,
        total = 0;
    for (let i = 0; i < cartItems.length; i++) {
        let item = cartItems[i],
            price = item.price,
            qty = item.qty;

        itemsSubtotal+=price*qty;
        shipping+=item.shipping;
        subtotal+=itemsSubtotal+shipping;
        tax = subtotal*0.13;
        total = subtotal+tax;
    }
    document.getElementById("itemsSubtotal").innerHTML=itemsSubtotal.toString();
    document.getElementById("shipping").innerHTML=shipping.toString();
    document.getElementById("subtotal").innerHTML=subtotal.toString();
    document.getElementById("tax").innerHTML=tax.toFixed(2).toString();
    document.getElementById("total").innerHTML=total.toFixed(2).toString();
}

//convert price
function convertPrice() {
    let getCurrency = document.getElementById("currency").value;
    currency = getCurrency;
    let rate;

    switch (getCurrency) {
        case "CAD":
            rate = 1.27;
            break;
        case "USD":
            rate = 0.79;
            break;
    }
    for (let i = 0; i < storeItems.length; i++) {
        storeItems[i].price = (storeItems[i].price * rate).toFixed(0);
    }
    for (let i = 0; i < cartItems.length; i++) {
        cartItems[i].price = (cartItems[i].price * rate).toFixed(0);
    }


    displayStore();
    displayCart();
}

//remove single item
function removeSingleItem(id){
    console.log(id);
    //get the ids of array of the item
    let cartItemID,
        storeItemID;
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id===id){
            cartItemID = i;
        }
    }
    for (let i = 0; i < storeItems.length; i++) {
        if (storeItems[i].id===id){
            storeItemID = i;
        }
    }


    cartItems[cartItemID].qty-=1;
    storeItems[storeItemID].qty+=1;
    if (cartItems[cartItemID].qty<=0){
        removeAllItems(id);
    }
    displayCart();
    displayStore();
}

//remove all items
function removeAllItems(id){
    console.log(id);
    let storeItemID,
        cartItemID;
    for (let i = 0; i < storeItems.length; i++) {
        if (storeItems[i].id===id){
            storeItemID = i;
        }
    }
    for (let i = 0; i < cartItems.length; i++) {
        if (cartItems[i].id===id){
            cartItemID = i;
        }
    }


    storeItems[storeItemID].qty+=cartItems[cartItemID].qty;
    cartItems.splice(cartItemID,1);
    displayCart();
    displayStore();
}

//display item description
function itemDescription(id){
    console.log(storeItems[id]);
    let item = storeItems[id],
        reviews = "";
    for (let i = 0; i < storeItems[id].reviews.length; i++) {
        reviews+="- "+storeItems[id].reviews[i]+"\n";
    }

    let message = "Item details:\n" +
        "Id: "+item.id+"\n" +
        "Product: "+item.name+ "\n" +
        "Price: $"+item.price+" "+currency+"\n" +
        "Qty Available: "+item.qty+"\n" +
        "Max Per Customer: "+item.max+"\n" +
        "Cost of Shipping: "+item.shipping+"\n" +
        "\n" +
        "Description: \n" +
        item.description+"\n" +
        "Reviews: \n"+reviews;


    alert(message);

}

//leave review
function addReviewTo(id,review){
    storeItems[id].reviews.push(review);
}

function getTime(){
    let today = new Date(),
        h = today.getHours()>12?today.getHours()-12:today.getHours(),
        m = today.getMinutes(),
        s = today.getSeconds(),
        am_pm = h>=12 ? " AM":" PM",
        y = today.getFullYear(),
        month = today.getMonth(),
        d = today.getDate(),
        br = "<br/>";


    month = checkTime(month);
    d = checkTime(d);
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('time').innerHTML =
        "TIME:"+br+
        h + ":" + m + ":" + s+am_pm+br+
        "DATE:"+br+
        y+"/"+month+"/"+d;
    setTimeout(getTime, 500);

    function checkTime(i) {
        if (i < 10) {i = "0" + i} // add zero in front of numbers < 10
        return i;
    }
}
function populateStore(){
    //insert data into array
    let description = "The Everyday Slip-On is made for (you guessed it) every day. " +
                                " Designed with a cushier sole for added support so you’ll never be grumpy on your feet again.";
    storeItems[0] = new StoreItem(
        "1first","MEN'S EVERYDAY SLIP-ONS BLACK",217,22,2,
        "basketball",20,["great","awesome","not bad"],description,"./css/images/1.jpg");


    description = "Stay light on your feet in these ultra-lightweight kicks inspired by (but not limited to) city life." +
        "And when we say lightweight, we mean it.";
    storeItems[1] = new StoreItem(
        "2second","MEN'S CITYSCAPE CHARCOAL GREY",120,10,1,
        "court",20,["great","awesome","not bad"],description,"./css/images/2.jpg");

    description = "The Everyday is made for (you guessed it) every day." +
        " Designed with a cushier sole for added support so you’ll never be grumpy on your feet again.";
    storeItems[2] = new StoreItem(
        "3third","MEN'S EVERYDAY MIDNIGHT BLACK",200,13,3,
        "sneakers",22,["great","awesome","not bad"],description,"./css/images/3.jpg");

    description = "The Glow Flame Kids Old Skool, the Vans classic skate shoe and first to bare the iconic sidestripe," +
        " is a low top lace-up featuring sturdy canvas uppers with checkerboard and glow-in-the-dark flame prints." +
        " It also includes metal eyelets, re-enforced toe caps to withstand repeated wear, padded collars for support" +
        " and flexibility, and signature rubber waffle outsoles.";
    storeItems[3] = new StoreItem(
        "4fourth","Vans Old Skool Glow Flame",80,33,5,
        "skate",15,["great","awesome","not bad"],description,"./css/images/4.png");

    description = "Originally made for basketball courts in the '70s. Celebrated by hip hop royalty in the '80s." +
        " The adidas Superstar shoe is now a lifestyle staple for streetwear enthusiasts. " +
        "The world-famous shell toe feature remains, providing style and protection." +
        " Just like it did on the B-ball courts back in the day.";
    storeItems[4] = new StoreItem(
        "5fifth","Adidas Superstar Shoes",100,23,5,
        "originals",15,["great","awesome","not bad"],description,"./css/images/5.png");

    description = "The Nike Air Max 270 combines the exaggerated tongue from the Air Max 180" +
        " and classic elements from the Air Max 93." +
        " It features a large Max Air unit for a soft ride that feels as impossible as it looks.";
    storeItems[5] = new StoreItem(
        "6sixth","Adidas Max 270 GS",140,11,2,
        "sneakers",24,["great","awesome","not bad"],description,"./css/images/6.png");

    description = "The legendary sneakers from the ZX range have returned. Why? During the 1980s," +
        " the adidas ZX sneakers were the highest performance range from adidas and they didn’t want to stay behind." +
        " Thanks to special technological changes, adidas have made the ZX sneakers a current footwear again," +
        " and they’re moving forward! ";
    storeItems[6] = new StoreItem(
        "7seventh","ADIDAS X NINJA ZX 2K BOOST",180,12,1,
        "sneakers",18,["great","awesome","not bad"],description,"./css/images/7.png");

    description = "The pairs sport elements including accentuated outlined Swoosh logos on the mid-panels that" +
        " use rubber piping to give a 3D effect, tapering off at the heel of each pair," +
        " and include a similar design on the front-quarter guard.";
    storeItems[7] = new StoreItem(
        "8eighth","Nike Blazer Mid '77 Infinite",130,11,2,
        "sneakers",18,["great","awesome","not bad"],description,"./css/images/8.png");

    description = "Titan’s rendition of the Air Jordan XXXV features a Grey tone covering the forefoot," +
        " tongue, and laces paired with Charcoal and Black in the rear and tongues. " +
        "Gold detailing is used on the Jumpman tongue, upper eyelets, heel labels," +
        " and insoles highlighted with Crimson contrasting accents.";
    storeItems[8] = new StoreItem(
        "9ninth","Jordan 35",270,8,1,
        "basketball",22,["great","awesome","not bad"],description,"./css/images/9.png");

    description = "The CA range quickly became a cult classic down the years throughout a host of subcultures," +
        " with everyone from 90s terracewear enthusiasts to late LA hip-hop legend Nipsey Hussle immortalising " +
        "the model as a certified part of sneaker history. ";
    storeItems[9] = new StoreItem(
        "10tenth","Puma CA Pro",88,14,3,
        "sneakers",22,["great","awesome","not bad"],description,"./css/images/10.png");

    description = "Kyrie Irving's ability to stop, go and cut while handling the ball is unrivalled." +
        " The Kyrie Low 3 enables agility and traction in multiple directions while helping keep quick-cutting players" +
        " locked in over the cushioning. Its low-cut design has aggressive rubber tread that wraps up the sides" +
        " and a secure midfoot strap for a secure on-court feel.";
    storeItems[10] = new StoreItem(
        "11eleventh","Kyrie Low 3",145,13,2,
        "basketball",18,["great","awesome","not bad"],description,"./css/images/11.png");

    description = "The Nite Jogger debuted in 1980, when recreational running became a popular pastime." +
        " These shoes revisit the retro style with a nylon and mesh upper that flashes reflective details." +
        " This modern version also includes responsive Boost cushioning for endless energy return";
    storeItems[11] = new StoreItem(
        "12twelfth","adidas Nite Jogger X 3M",175,6,1,
        "sneakers",22,["great","awesome","not bad"],description,"./css/images/12.png");

    description = "The Kybrid S2 combines the best of the Kyrie 4, 5 and 6 into one sensational," +
        " boundary-pushing basketball shoe. It provides a secure, lightweight fit with an overlay " +
        "that locks you in when you lace up. A Kyrie-ready Zoom Air unit and traction that wraps up" +
        " the sides help fast, quick-cutting players stay responsive and turn on their edges.";
    storeItems[12] = new StoreItem(
        "13thirteenth","Nike Kybrid S2",185,2,1,
        "basketball",17,["great","awesome","not bad"],description,"./css/images/13.png");

    description = "! Here alone the design screams: Put me on!. Who could say no to that? " +
        "The silhouette is based on a classic sports sneaker, while ingenious, colorful details," +
        " different overlays and a thick, detailed outsole give the RS Fast a very special touch." +
        " But now, if you think the PUMA RS looks only good, you were wrong. He is also really comfortable!" +
        " A lightweight IMEVA midsole, sturdy leather upper and breathable material completes the comfort package here.";
    storeItems[13] = new StoreItem(
        "14fourteenth","Puma RS-Fast",111,33,6,
        "sneakers",14,["great","awesome","not bad"],description,"./css/images/14.png");

    description = "Donovan Mitchell sees the plays before they happen, which makes him basically unstoppable." +
        " These signature shoes from adidas Basketball and one of today’s top young stars feature a lightweight," +
        " cushioned midsole that flexes with your foot as you attack the rack. " +
        "The rubber outsole provides outstanding stability so you’re free to cut, move and score at will.";
    storeItems[14] = new StoreItem(
        "15fifteenth","Adidas Men's D.O.N 2",140,22,4,
        "basketball",22,["great","awesome","not bad"],description,"./css/images/15.png");
}

window.addEventListener("load",onload,false);
document.getElementById("currency").addEventListener("change",convertPrice,false);
document.getElementById("categories").addEventListener("change",displayStore,false);
