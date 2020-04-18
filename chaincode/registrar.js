'use strict';

const {Contract} = require('fabric-contract-api');

class regnetRegistrarContract extends Contract{

  constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.property-registration-network.regnet.registrar');
	}

  /* ****** All custom functions are defined below ***** */

	// This is a basic user defined function used at the time of instantiating the smart contract
	// to print the success message on console
	async instantiate(ctx) {
		console.log('************  Regnet Registrar Smart Contract Instantiated *************');
	}

  /**
	 * Create a new student account on the network
	 * @param ctx - The transaction context object
	 * @param name - Name of the user
   * @param aadhar - Aadhar number of the user
	 * @returns
	 */

   async approveNewUser(ctx,name,aadhar){

     // Create a composite key for the new user request
     const userRequestKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.newUserRequest', [name,aadhar]);

     let request = await ctx.stub
 				.getState(userRequestKey)
 				.catch(err => console.log(err));

     // Convert the received certificate buffer to a JSON object
     const userRequest = JSON.parse(request.toString());

     // Create a user request object to be stored in blockchain
 		 let newUser = {
 			 name: userRequest.name,
 			 email: userRequest.email,
       mobile: userRequest.mobile,
       aadhar: userRequest.aadhar,
       upgradCoins: 0,
 			 createdAt: new Date(),
 		 };

     // Create a new composite key for the new user request
     const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.user', [name,aadhar]);


     // Convert the JSON object to a buffer and send it to blockchain for storage
 		 let dataBuffer = Buffer.from(JSON.stringify(newUser));
 		 await ctx.stub.putState(userKey, dataBuffer);

     // Return value of created user request object
 		 return newUser;
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
   * @param propertyID - Property ID of the user which is need to be registered
   * @returns
   */

   async approvePropertyRegistration(ctx,propertyID){
     // Create a new composite key for the new user request
     const propertyRegReqKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.users.propertyRegReq', [propertyID]);

     let request = await ctx.stub
 				.getState(propertyRegReqKey)
 				.catch(err => console.log(err));

     // Convert the received certificate buffer to a JSON object
     const propertyRequest = JSON.parse(request.toString());

     // create the new property object to be stored in the ledger
     let newProperty = {
       propertyID: propertyRequest.propertyID,
       owner: propertyRequest.userKey,
       price: propertyRequest.price,
       status: propertyRequest.status,
     }

     // Create a new composite key for the new user request
     const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.registrar.property', [propertyID,name,aadhar]);

     // Convert the JSON object to a buffer and send it to blockchain for storage
     let dataBuffer = Buffer.from(JSON.stringify(newProperty));
     await ctx.stub.putState(propertyKey, dataBuffer);

     // return the ceated request to the user
     return newProperty;

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


}
