const Order = require("./Order");

const MainDish = [
  "Butter chicken",
  "Prawns in garlic butter",
  "Shrimp scampi",
  "Beef Wellington",
  "Lasagna",
  "Paneer masala",
  "Veggie"
]
const MainDishPrice = [
  21.99,
  22.99,
  23.99,
  27.99,
  29.99,
  19.99,
  12.09
]
const SideItems = [
  "Fries",
  "Salad",
  "Side of rice and peas",
  "Onion rings"
]
const SideItemsPrice = [
  3.99,
  4.99,
  2.99,
  2.49
]

const Dessert = ["Chocolate cake", "Cheesecake", "Tiramisu"]
const DessertPrice = [
  3.99,
  2.99,
  3.99
]

const Drinks = ['Water', 'Coke', 'Pepsi', 'Ice Tea', 'Coffee']
const DrinksPrice = [
  0.99,
  1.99,
  1.49,
  3.99,
  5.99
]

const OrderState = Object.freeze({
  WELCOMING: Symbol("welcoming"),
  MainDish: Symbol("maindish"),
  SideItems: Symbol("sideitems"),
  DessertDish: Symbol("dessertdish"),
  DRINKS: Symbol("drinks"),
  PAYMENT: Symbol("payment")
});

module.exports = class ShwarmaOrder extends Order {
  constructor(sNumber, sUrl) {
    super(sNumber, sUrl);
    this.stateCur = OrderState.WELCOMING;
    this.sMainDishName = "";
    this.sSideDishName = "";
    this.sDessertDishName = "";
    this.sDrinks = "";
    this.sItem = "";
    this.sPrice = 0;
    this.sAddress = "";
  }
  handleInput(sInput) {
    let aReturn = [];
    switch (this.stateCur) {

      case OrderState.WELCOMING:
        this.stateCur = OrderState.MainDish;
        aReturn.push("Welcome to Divyangs's Food SHOP.");
        aReturn.push("What would you like to order? ");
        let mainDish = "This is our Main Course :\n";
        for (let i = 0; i < MainDish.length; i++) {
          mainDish += `\n ${i + 1}. ${MainDish[i]} \tPrice:-${MainDishPrice[i]}`;
        }
        mainDish += `\n Enter A number from above list.`;
        aReturn.push(mainDish);
        break;

      case OrderState.MainDish:
        this.stateCur = OrderState.SideItems;
        this.sMainDishName = sInput;

        if (sInput > 0 && sInput <= MainDish.length) {
          this.sPrice += MainDishPrice[sInput - 1];
          this.sItem = this.sItem.concat(` ${MainDish[sInput]} `)

        } else {
          aReturn.push("Invalid input! Please enter a Number ");
          this.stateCur = OrderState.MainDish
          break;
        }

        aReturn.push("What Appetizers would you like?");
        let sideDish = "This is our Appetizers :\n";
        for (let i = 0; i < SideItems.length; i++) {
          sideDish += `\n ${i + 1}. ${SideItems[i]} \tPrice:-${SideItemsPrice[i]}`;
        }
        sideDish += `\n Enter A number from above listor "NO".`;
        aReturn.push(sideDish);
        break;


      case OrderState.SideItems:
        this.stateCur = OrderState.DessertDish;
        this.sSideDishName = sInput;

        if (sInput > 0 && sInput <= SideItems.length) {
          this.sPrice += SideItemsPrice[sInput - 1];
          this.sItem = this.sItem.concat(` ${SideItems[sInput]}`)

        } else if (sInput.toLowerCase() == "no") {

        } else {
          aReturn.push("Invalid input! Please enter a Number ");
          this.stateCur = OrderState.SideItems
          break;
        }

        aReturn.push("What Dessert would you like?");
        let dessertDish = "This is our Dessert :\n";
        for (let i = 0; i < Dessert.length; i++) {
          dessertDish += `\n ${i + 1}. ${Dessert[i]} \tPrice:-${DessertPrice[i]}`;
        }
        dessertDish += `\n Enter A number from above list or "NO". `;
        aReturn.push(dessertDish);
        break;

      case OrderState.DessertDish:
        this.stateCur = OrderState.DRINKS;
        this.sDessertDishName = sInput;

        if (sInput > 0 && sInput <= Dessert.length) {
          this.sPrice += DessertPrice[sInput - 1];
          this.sItem = this.sItem.concat(` with ${Dessert[sInput]}`)

        } else if (sInput.toLowerCase() == "no") {

        } else {
          aReturn.push("Invalid input! Please enter a Number ");
          this.stateCur = OrderState.DessertDish
          break;
        }

        aReturn.push("What Drink would you like?");
        let drinkDish = "This is our Drinks :\n";
        for (let i = 0; i < Drinks.length; i++) {
          drinkDish += `\n ${i + 1}. ${Drinks[i]} \tPrice:-${DrinksPrice[i]}`;
        }
        drinkDish += `\n Enter A number from above list or "NO".`;
        aReturn.push(drinkDish);
        break;

      case OrderState.DRINKS:
        this.stateCur = OrderState.PAYMENT;
        this.sDrinks = sInput;

        if (sInput > 0 && sInput <= Drinks.length) {
          this.sPrice += DrinksPrice[sInput - 1];
          this.sItem = this.sItem.concat(` with ${Drinks[sInput]}`)

        } else if (sInput.toLowerCase() == "no") {

        } else {
          aReturn.push("Invalid input! Please enter a Number ");
          this.stateCur = OrderState.DRINKS
          break;
        }

        aReturn.push("Thank-you for your order of");
        aReturn.push(`${this.sItem} `);
        aReturn.push(`Please pay for your order here Price:$${this.sPrice}`);
        aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
        break;

      case OrderState.PAYMENT:

        this.isDone(true);
        console.log(sInput);

        if (!sInput.id) {
          aReturn.push("Order payment cancelled")
        } else {
          let address = ""
          for (let i in sInput.payer.address) {
            address += `${i}: ${sInput.payer.address[i]}\n`;
          }
          aReturn.push(address)
          aReturn.push("Thank-you for your order of");
          aReturn.push(` ${this.sItem} `);
          let d = new Date();
          d.setMinutes(d.getMinutes() + 20);
          aReturn.push(`Your order will  be delivered at ${d.toTimeString()} \n address: ${address}  \n Thank you for the payment of ${this.sPrice}`);
        }
        break;
    }
    return aReturn;
  }
  renderForm(sTitle = "-1", sAmount = "-1") {
    // your client id should be kept private
    if (sTitle != "-1") {
      this.sItem = sTitle;
    }
    if (sAmount != "-1") {
      this.nOrder = sAmount;
    }
    const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
    return (`
      <!DOCTYPE html>
  
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1"> <!-- Ensures optimal rendering on mobile devices. -->
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> <!-- Optimal Internet Explorer compatibility -->
      </head>
      
      <body>
        <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
        <script
          src="https://www.paypal.com/sdk/js?client-id=${sClientID}"> // Required. Replace SB_CLIENT_ID with your sandbox client ID.
        </script>
        Thank you ${this.sNumber} for your ${this.sItem} order of $${this.nOrder}.
        <div id="paypal-button-container"></div>
        <script src ="/js/store.js" type = "module"></script>

        <script>
          paypal.Buttons({
              createOrder: function(data, actions) {
                // This function sets up the details of the transaction, including the amount and line item details.
                return actions.order.create({
                  purchase_units: [{
                    amount: {
                      value: '${this.nOrder}'
                    }
                  }]
                });
              },
              onApprove: function(data, actions) {
                // This function captures the funds from the transaction.
                return actions.order.capture().then(function(details) {
                  // This function shows a transaction success message to your buyer.
                  $.post(".", details, ()=>{
                    details.order = ${JSON.stringify(this)};
                    window.StoreData(details); 
                  });
                });
              }
          
            }).render('#paypal-button-container');
          // This function displays Smart Payment Buttons on your web page.
        </script>
      
      </body>
          
      `);

  }
}
