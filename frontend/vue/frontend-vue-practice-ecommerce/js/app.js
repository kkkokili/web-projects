var vm=new Vue({
    el: '#app',
    data: {
        notShowingCart: true,
        cartItems: {
            items:[],
            total:0
        },
        products: [
            {
                id: 1,
                name: 'MacBook Pro (15 inch)',
                description: 'This laptop has a super crisp Retina display. Yes, we know that it\'s overpriced...',
                price: 2999,
                inStock: 50
            },
            {
                id: 2,
                name: 'Samsung Galaxy Note 7',
                description: 'Unlike the overpriced MacBook Pro, we\'re selling this one a bit cheap, as we heard it might explode...',
                price: 299,
                inStock: 755
            },
            {
                id: 3,
                name: 'HP Officejet 5740 e-All-in-One-printer',
                description: 'This one might not last for so long, but hey, printers never work anyways, right?',
                price: 149,
                inStock: 5
            },
            {
                id: 4,
                name: 'iPhone 7 cover',
                description: 'Having problems keeping a hold of that phone, huh? Ever considered not dropping it in the first place?',
                price: 49,
                inStock: 42
            },
            {
                id: 5,
                name: 'iPad Pro (9.7 inch)',
                description: 'We heard it\'s supposed to be pretty good. At least that\'s what people say.',
                price: 599,
                inStock: 0
            },
            {
                id: 6,
                name: 'OnePlus 3 cover',
                description: 'Does your phone spend most of its time on the ground? This cheap piece of plastic is the solution!',
                price: 19,
                inStock: 81
            }
        ]
    },
    methods: {
        addItem: function(addInProduct) {
            this.cartItems.total++
            if (this.cartItems.items.find(item=>item.id==addInProduct.id)!=undefined) {
                this.cartItems.items.find(item=>item.id==addInProduct.id).quantity++       
            } else {
                this.cartItems.items.push({...addInProduct, quantity: 1})
            }
        },

        increaseItem: function(item) {
            item.quantity++;
            this.cartItems.total++;
        },

        decreaseItem: function(item) {
            item.quantity--;
            this.cartItems.total--;
            if (item.quantity==0) {
                this.removeItem(item);
            }
        },

        removeItem: function (item) {
            const index=this.cartItems.items.indexOf(item);
            this.cartItems.items.splice(index,1);
        },

        checkOut: function () {
            if (confirm('Are you sure that you are going to purchase all the products in the cart?')) {
                this.cartItems.total=0;
                this.cartItems.items.forEach(item=> {
                    const id=item.id;
                    this.products.forEach(productItem=>{
                        if (productItem.id==id){
                            productItem.inStock-=item.quantity;
                        }
                    })

                })
                this.cartItems.items=[];
            } 

        }
    },
    computed: {
        totalAmount: function() {
            return this.cartItems.items.reduce(function (accumulator, current) {
                return accumulator+(current.price*current.quantity)
            },0)
        },

        tax: function() {
            return (this.totalAmount*0.1).toFixed(2);
        },

        grandTotal: function() {
            return((+this.totalAmount)+(+this.tax));
        }
    }
});

console.log(vm)