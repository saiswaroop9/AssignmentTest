const { chai, server, should } = require("./testConfig");
const ProductModel = require("../models/ProductModel");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", true);

/**
 * Test cases to test all the product APIs
 * Covered Routes:
 * (1) Add Product
 * (2) List Product
 * (3) Add Item to Cart
 * (4) Get Cart Item By UserID
 */

describe("Product", () => {
	//Before each test we empty the database
	before((done) => { 
		ProductModel.deleteMany({}, (err) => { 
			done();           
		});        
	});

	// Prepare data for testing
	const userTestData = {
		"password":"Test@123",
		"email":"maitraysuthar@test12345.com"
	};

	// Prepare data for testing
	const testData = {
		"name":"testing camera",
		"description":"testing camera desc",
		"price": 45,
		"make": 2019
	};

	var cartItems = []

	/*
  * Test the /POST route
  */
	describe("/POST Login", () => {
		it("it should do user Login", (done) => {
			chai.request(server)
				.post("/api/loginuser")
				.send({"email": userTestData.email,"password": userTestData.password})
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Login Success.");
					userTestData.token = res.body.data.token;
					userTestData.id = res.body.data._id;
					done();
				});
		});
	});

	/*
  * Test the /POST route
  */
	describe("/POST Product", () => {
		it("It should send validation error for product", (done) => {
			chai.request(server)
				.post("/api/productAdd")
				.send()
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});

	/*
  * Test the /POST route
  */
	describe("/POST Product", () => {
		it("It should store product", (done) => {
			chai.request(server)
				.post("/api/productAdd")
				.send(testData)
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Product add Success.");
					done();
				});
		});
	});

	/*
  * Test the /GET route
  */
	describe("/GET All Product", () => {
		it("it should GET all the products", (done) => {
			chai.request(server)
				.get("/api/listallproduct")
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation success");
					var info = res.body.data
					var ids = info.map(e => e._id)
					for (const iterator of ids) {
						cartItems.push({
							product_id: iterator,
							quantity: 2
						})
					}
					done();
				});
		});
	});


	/*
	* Test the /POST route
	*/
	describe("/POST add cart", () => {
		it("It should through validation error", (done) => {
			chai.request(server)
				.post("/api/addtocart")
				.send({
					cartItems: cartItems,
					id: userTestData.id + "1234"
				})
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(400);
					done();
				});
		});
	});

	/*
	* Test the /POST route
	*/
	describe("/POST add cart", () => {
		it("It should add product to cart of user", (done) => {
			chai.request(server)
				.post("/api/addtocart")
				.send({
					cartItems: cartItems,
					id: userTestData.id 
				})
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Cart update Success.");
					done();
				});
		});
	});

	/*
	* Test the /POST route
	*/
	describe("/POST Get Cart", () => {
		it("It should get product in cart of user", (done) => {
			chai.request(server)
				.post("/api/cartforuser")
				.send({
					id: userTestData.id
				})
				.set("Authorization", "Bearer "+ userTestData.token)
				.end((err, res) => {
					res.should.have.status(200);
					res.body.should.have.property("message").eql("Operation success");
					done();
				});
		});
	});

});