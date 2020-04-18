'use strict';

const {Contract} = require('fabric-contract-api');

class regnetUsersContract extends Contract{

  constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.property-registration-network.regnet.users');
	}

  /* ****** All custom functions are defined below ***** */

	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('************  Regnet Smart Contract Instantiated *************');
	}

  /**
	 * Create a new student account on the network
	 * @param ctx - The transaction context object
	 * @param name - Name of the user
	 * @param email - Email ID of the user
   * @param mobile - Mobile number of the user
   * @param aadhar - Aadhar number of the user
	 * @returns
	 */

   async requestNewUser(ctx,name,email,mobile,aadhar){

     // Create a new composite key for the new user request
 		const userRequestKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.newUsersRequest', [name,aadhar]);

    // Create a user request object to be stored in blockchain
		let newUserRequest = {
			name: name,
			email: email,
      mobile: mobile,
      aadhar: aadhar,
			createdAt: new Date(),
		};

    // Convert the JSON object to a buffer and send it to blockchain for storage
		let dataBuffer = Buffer.from(JSON.stringify(newUserRequest));
		await ctx.stub.putState(userRequestKey, dataBuffer);

    // Return value of created user request object
		return newUserRequest;

   }

   /**
 	 * Create a new student account on the network
 	 * @param ctx - The transaction context object
 	 * @param name - Name of the user
   * @param aadhar - Aadhar number of the user
   * @param bankTxID - Bank Transaction ID, paid by the user to the bank
 	 * @returns
 	 */

  async rechargeAccount(ctx,name,aadhar,bankTxID){
    var bankTxs = ["upgrad100","upgrad500","upgrad1000"];

    // check whether the bankTXID is valid or not
    if(bankTxs.includes(bankTxID){

      // Create a new composite key for the new user request
      const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.user', [name,aadhar]);

      // fetch the corresponding user object from the ledger
      let user1 = await ctx.stub
  				.getState(userKey)
  				.catch(err => console.log(err));

      // Convert the received certificate buffer to a JSON object
      let user = JSON.parse(user1.toString());

      // check the amount to be recharged
      if(bankTxID == "upgrad100"){
        user.upgradCoins += 100;
      }
      else if (bankTxID == "upgrad500") {
        user.upgradCoins += 500;
      }
      else{
        user.upgradCoins += 1000;
      }

      // Convert the JSON object to a buffer and send it to blockchain for storage
  		let dataBuffer = Buffer.from(JSON.stringify(user));
  		await ctx.stub.putState(userKey, dataBuffer);

    }
    else{
      // if the sent bankTXID is doesnt match, throw this
      throw new Error('*** Invalid Bank Transaction ID ***');
    }

  }

  /**
  * Create a new student account on the network
  * @param ctx - The transaction context object
  * @param name - Name of the user
  * @param aadhar - Aadhar number of the user
  * @returns
  */

  async viewUser(ctx,name,aadhar){

    // Create a new composite key for the new user request
    const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.user', [name,aadhar]);

    // fetch the corresponding user object from the ledger
    let user1 = await ctx.stub
        .getState(userKey)
        .catch(err => console.log(err));

    // check whether user is registered or not
    if(user1 == undefined){
      throw new Error('*** user have not registered yet ****');
    }
    else{

      // return the fetched user object
      return JSON.parse(user1.toString());
    }
  }

  /**
  * Create a new student account on the network
  * @param ctx - The transaction context object
  * @param name - Name of the user
  * @param aadhar - Aadhar number of the user
  * @param propertyID - Property ID of the user which is need to be registered
  * @param price - Price of the propertyID
  * @param status - Status of the property
  * @returns
  */

  async propertyRegistrationRequest(ctx,name,aadhar,propertyID,price,status){
    // Create a new composite key for the new user request
    const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.user', [name,aadhar]);

    // fetch the corresponding user object from the ledger
    let user1 = await ctx.stub
        .getState(userKey)
        .catch(err => console.log(err));

    // check whether user is registered or not
    if(user1 == undefined){
      throw new Error('*** user have not registered yet ****');
    }
    else{

      // create a new property Registration request object
      let propertyRegistrationReq = {
        propertyID: propertyID,
        owner: userKey,
        price: price,
        status: "registered",
      };

      // Create a new composite key for the new user request
      const propertyRegReqKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.propertyRegReq', [propertyID]);

      // Convert the JSON object to a buffer and send it to blockchain for storage
  		let dataBuffer = Buffer.from(JSON.stringify(propertyRegistrationReq));
  		await ctx.stub.putState(propertyRegReqKey, dataBuffer);

      // return the ceated request to the user
      return propertyRegistrationReq;

    }
  }

  /**
  * Create a new student account on the network
  * @param ctx - The transaction context object
  * @param name - Name of the user
  * @param aadhar - Aadhar number of the user
  * @param propertyID - Property ID of the user
  * @returns
  */

  async viewProperty(ctx,name,aadhar,propertyID){
    // Create a new composite key for the new user request
    const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.property', [propertyID,name,aadhar]);

    // fetch the corresponding property object from the ledger
    let property = await ctx.stub
        .getState(propertyKey)
        .catch(err => console.log(err));

    // check whether the requested property is present in the ledger or not
    if(property == undefined){
      throw new Error('***** Property has not registered yet *****');
    }
    else{

      // return the fetched property object
      return JSON.parse(property.toString());
    }

  }

  /**
  * Create a new student account on the network
  * @param ctx - The transaction context object
  * @param name - Name of the user
  * @param aadhar - Aadhar number of the user
  * @param propertyID - Property ID of the user
  * @param status - Status of the property to be updated
  * @returns
  */

  async updateProperty(ctx,name,aadhar,propertyID,status){
    // Create a new composite key for the new user request
    const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.property', [propertyID,name,aadhar]);

    // fetch the corresponding property object from the ledger
    let property1 = await ctx.stub
        .getState(propertyKey)
        .catch(err => console.log(err));

    // convert it to JSON object
    let property = JSON.parse(property1.toString());

    // Create a new composite key for the new user request
    const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.user', [name,aadhar]);

    // check whether the requested yser is the owner of the property
    if(property.owner == userKey){

      // update the status
      property.status = status;

      // Convert the JSON object to a buffer and send it to blockchain for storage
      let dataBuffer = Buffer.from(JSON.stringify(property));
      await ctx.stub.putState(propertyKey, dataBuffer);

      // return the updated property to the user
      return property;
    }
    else{
      throw new Error('**** User is not the owner of the property *****');
    }

  }

  /**
  * Create a new student account on the network
  * @param ctx - The transaction context object
  * @param name - Name of the user
  * @param aadhar - Aadhar number of the user
  * @param propertyID - Property ID of the user
  * @returns
  */

  async purchaseProperty(ctx,name,aadhar,propertyID){
    // Create a new composite key for the new user request
    const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.property', [propertyID,name,aadhar]);

    // fetch the corresponding property object from the ledger
    let property1 = await ctx.stub
        .getState(propertyKey)
        .catch(err => console.log(err));

    // convert it to JSON object
    let property = JSON.parse(property1.toString());

    // check if property is for sale or not
    if(property.status == "onSale"){

      // Create a composite key for the buyer user
      const buyerKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.user', [name,aadhar]);

      // fetch the corresponding buyer object from the ledger
      let user1 = await ctx.stub
          .getState(buyerKey)
          .catch(err => console.log(err));

      // convert it to JSON object
      let buyer = JSON.parse(user1.toString());

      let propertyPrice = property.price;

      // check whether the buyer has enough money to buy
      if(buyer.upgradCoins >= property.price){

        // Deduct the money from the buyer
        buyer.upgradCoins -= propertyPrice;

        // put back the buyer object back to the ledger
        // Convert the JSON object to a buffer and send it to blockchain for storage
        let dataBuffer = Buffer.from(JSON.stringify(buyer));
        await ctx.stub.putState(buyerKey, dataBuffer);

        // credit the money to the seller

        let sellerKey = property.owner;

        // fetch the corresponding seller object from the ledger
        let user2 = await ctx.stub
            .getState(sellerKey)
            .catch(err => console.log(err));

        // convert it to JSON object
        let seller = JSON.parse(user2.toString());

        // Add the mmoney to the seller
        seller.upgradCoins += propertyPrice;

        // put back the seller object back to the ledger
        // Convert the JSON object to a buffer and send it to blockchain for storage
        let dataBuffer = Buffer.from(JSON.stringify(seller));
        await ctx.stub.putState(sellerKey, dataBuffer);

        // Update the property ownership to buyers Name
        property.owner = buyerKey;

        //update the status of the property as regsitered
        property.status = "registered";

        // put back the property object back to the ledger
        // Convert the JSON object to a buffer and send it to blockchain for storage
        let dataBuffer = Buffer.from(JSON.stringify(property));
        await ctx.stub.putState(propertyKey, dataBuffer);

      }
      else{
        throw new Error('***** Insufficient balance *****');
      }
    }
    else{
      throw new Error('***** Property is not for sale *****');
    }
  }

}
