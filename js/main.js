let cartItems={};
let itemsInCart=0;
let orderTotal=0;
const productsInfo={};
let emptyCart=true;
let noConfirmWindow=true;
document.addEventListener("DOMContentLoaded",()=>{
   // products comes from another file
   createEmptyList();
   createEmptyCart();
  
   
  
}
);
function startNewOrder(e){
        e.stopPropagation();
        document.body.querySelector("#finalConfirmation").remove();
        createEmptyList();
        createEmptyCart();
}
function createConfirmItems(){
        let div="<div id='confirmationItems'>";
       for (item of Object.values(cartItems)){
        
        const product=products.find(p=>p.name==item.name);
          const innerDiv=`<div id="confirmedItem">
          <img src=${product["image"]["thumbnail"]}>
          <div>
          <h3>${item.name}</h3>
          <h3>${item.amount}&nbsp; @&dollar;${item.price}</h3>
          </div>
          <div>
          <h3>&dollar;${item.price*item.amount}</h3>
          </div>
          </div>`;
          div+=innerDiv;
       }
       div+=`<div id="confirmedTotal">
       <h3>order Total</h3> <h3>&dollar;${orderTotal}</h3>
       </div>`;
       return div+"</div>"
}
function confirmOrder(e){
        //create the confirmed menu
        e.stopPropagation();
        noConfirmWindow=false;
        
        const finalConfirmation=document.createRange().createContextualFragment(
                `<section id="finalConfirmation">
                <div>
                <img  src="./assets/images/icon-order-confirmed.svg">
                </div>
                <div id="confirmationMsg">
                <h2>Order Confirmed</h2>
                <h4>we hope you enjoy your food!</h4>
                </div>
                ${createConfirmItems()}
                <div id="startNewOrder" onclick="startNewOrder(event)">
                <h2>start new order</h2>
                </div>
               
                </section>
                `
        );
        document.body.appendChild(finalConfirmation);
}
function createEmptyList(){
        const productsSection=document.querySelector("#products");
        productsSection.innerHTML=`<p id="productsTitle">Desserts</p>`;
        for (product of products){
            productsInfo[product["name"]]=product;
            let elm=document.createRange().createContextualFragment(`
            <div class="item">
            <img src=${product["image"]["desktop"]} alt=${product["name"]} class="itemImg"
            srcset='${product["image"]["desktop"]} 480w,
                    ${product["image"]["tablet"]} 424w 428h,
                    ${product["image"]["mobile"]} 424w 654h' >
            <div class="itemHandler addToCart"
            onclick="noConfirmWindow && increaseProduct(event,event.currentTarget)"
             data-name='${product["name"]}' >
            <img src="./assets/images/icon-add-to-cart.svg" alt="add to cart icon">
             <h4> Add to Cart</h4>
            </div>
            <div class="itemInfo">
            <h4>${product["category"]}</h4>
            <h2>${product["name"]}</h2>
           <h3>&dollar;${product["price"]} </h3>
          </div>
          </div>`);
          
     
         productsSection.appendChild(elm);
        }
}
function createEmptyCart(){
  cartItems={};
  itemsInCart=0;
  orderTotal=0;
  emptyCart=true;
  noConfirmWindow=true;
  const cartSection=document.querySelector("#cart");
  cartSection.className="";
  let elm=document.createRange().createContextualFragment(`
  <p id="cartTotal">Your Cart(${itemsInCart})</p>
  <div id="emptyCartDeclaration">
  <img id="emptyCartImg" src="./assets/images/illustration-empty-cart.svg">
 <h4 id="emptyCartMessage"> Your added items will appear here</h4>
  </div>
  `);
  cartSection.innerHTML="";
  cartSection.appendChild(elm);
}
function createNonEmptyCart(){
 const cartSection=document.querySelector("#cart");
 cartSection.className="nonEmptyCart";
 const emptyCartDeclaration=cartSection.querySelector("#emptyCartDeclaration");
 emptyCartDeclaration.remove();
 
 let itemsSection=document.createRange().createContextualFragment(`<div id="itemsSection"></div>`);
 cartSection.appendChild(itemsSection);
 let orderSection=document.createRange().createContextualFragment(`
 <div id="orderSection">
 <div id="orderTotal">
 <h3>Order Total</h3>
 <h3>&dollar;${orderTotal}</h3>
 </div>
 <div id="carbonNeutral">
 <img src="./assets/images/icon-carbon-neutral.svg">
 <h4> this is a carbon-neutral delivery</h4>
 </div>
 <div id="confirmOrder">
 <h2 onclick="noConfirmWindow && confirmOrder(event)">Confirm Order</h2>
 </div>
 </div>
 `);
 cartSection.appendChild(orderSection);
}
function removeProduct(e,product){
   e.stopPropagation();
   const productName=product.dataset.name;
   orderTotal-= (cartItems[productName]["amount"]*cartItems[productName]["price"]);
   itemsInCart-=cartItems[productName]["amount"];
   delete cartItems[productName];
   removeFromCart(product);
}
function decreaseProduct(e,product){
        e.stopPropagation();
        itemsInCart-=1;
        const productName=product.dataset.name;
        orderTotal-=productsInfo[productName]["price"];
        cartItems[productName].amount-=1;
        if(cartItems[productName].amount > 0){
        
         updateProduct(product);
        }
        else{  
                delete cartItems[productName];
                removeFromCart(product);
        }
}
function increaseProduct(e,product){
        e.stopPropagation();
        itemsInCart+=1;
        const productName=product.dataset.name;
        orderTotal+=productsInfo[productName]["price"];
        if(cartItems[productName]){
         cartItems[productName].amount+=1;
         updateProduct(product);
        }
        else{
                
                cartItems[productName]={
                        name:productName,
                        price:productsInfo[productName]["price"],
                        amount:1
                };
        if(emptyCart){
                // just before adding the item not to be slow
                createNonEmptyCart();
                emptyCart=false;

               
        }
        
        addToCart(product);
        }
}
function addToCartChangeProducts(product){
        
        const productName=product.dataset.name;
        product.onclick="";
        product.className="itemHandler inCart";
        product.innerHTML=`
        <div class="iconContainer"
         onclick="noConfirmWindow && decreaseProduct(event,event.currentTarget.parentElement)">
        <img src="./assets/images/icon-decrement-quantity.svg"
        alt="decrease amount">
        </div>
        <h4 class="itemAmount">${cartItems[productName]["amount"]}</h4>
        <div class="iconContainer"
         onclick="noConfirmWindow && increaseProduct(event,event.currentTarget.parentElement)">
        <img src="./assets/images/icon-increment-quantity.svg"
        alt="increase amount">
        </div>
        `;
}
function addToCartChangeCart(product){
        const itemsSection=document.querySelector("#itemsSection");
        let productName=product.dataset.name;
        let item=document.createRange().createContextualFragment(`
        <div data-name="${productName}" class="cartItem" >
        
        <h3 class="cartItemName">
        ${productName}
        </h3>
        
        <img  src="./assets/images/icon-remove-item.svg"  
        class="iconRemoveContainer"
        onclick="noConfirmWindow && removeProduct(event,event.currentTarget.parentElement)">
        
        
        <h4 class="cartItemBuyInfo">
        ${cartItems[productName]["amount"]}x &nbsp; @&dollar;${cartItems[productName]["price"]}
        &nbsp;&dollar;${cartItems[productName]["amount"]*cartItems[productName]["price"]}
        </h4>
        
        
        </div>
        `);
        itemsSection.appendChild(item);
        updateCartTotal();
        updateOrderTotal();
}
function updateProductProducts(product){
        const amount=product.querySelector(".itemAmount");
        amount.innerHTML=`${cartItems[product.dataset.name].amount}`;
}
function updateProductCart(product){
        let productName=product.dataset.name;
        const itemsSection=document.querySelector("#itemsSection");
        const item=itemsSection.querySelector(`[data-name="${productName}"]`);
        const buyingInfo=item.querySelector('.cartItemBuyInfo');
        buyingInfo.innerHTML=`  ${cartItems[productName]["amount"]}x 
        &nbsp; @&dollar;${cartItems[productName]["price"]}
        &nbsp;&dollar;${cartItems[productName]["amount"]*cartItems[productName]["price"]}
        </h4>`;
        updateCartTotal();
        updateOrderTotal();
}
function removeFromCartProducts(product){
        const productName=product.dataset.name;
        const productsSection=document.querySelector("#products");
        const removedProduct=productsSection.querySelector(`[data-name="${productName}"]`);
        removedProduct.className="itemHandler addToCart";
        removedProduct.onclick=()=>noConfirmWindow && increaseProduct(event,event.currentTarget);
        removedProduct.innerHTML=`
        <img src="./assets/images/icon-add-to-cart.svg" alt="add to cart icon">
         <h4> Add to Cart</h4>`;
       
       
      
}
function removeFromCartCart(product){
        const productName=product.dataset.name;
        const itemsSection=document.querySelector("#itemsSection");
        const item=itemsSection.querySelector(`[data-name="${productName}"]`);
        item.remove();
        if(itemsInCart ==0){
                createEmptyCart();
        }
        else{
        updateCartTotal();
        updateOrderTotal();
        }
}

function addToCart(product){
        addToCartChangeProducts(product);
        addToCartChangeCart(product);
        

          
}
function updateProduct(product){
        updateProductProducts(product);
        updateProductCart(product);
}
function removeFromCart(product){
        removeFromCartProducts(product);
        removeFromCartCart(product);
}
function updateCartTotal(){
        document.querySelector("#cartTotal").innerHTML=`Your Cart(${itemsInCart})`;
}
function updateOrderTotal(){
        document.querySelector("#orderTotal").innerHTML=`
        <h3>Order Total</h3>
        <h3>&dollar;${orderTotal}</h3>
        `;
}
