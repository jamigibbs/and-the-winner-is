const { session, driver } = require('../server/db')
// const { seedPW } = process.env.SEEDPW || '4321'
// const crypto = require('crypto')

const now = new Date()
const dateTime = now.toString()

// const salt = crypto.randomBytes(16).toString('base64')
// const password = crypto
//   .createHash('RSA-SHA256')
//   .update(seedPW)
//   .update(salt)
//   .digest('hex')

session.run('MATCH (n) DETACH DELETE n')
.then(() => {
  driver.close()
  session.close()
} )

session.run('CREATE CONSTRAINT ON (user:User) ASSERT user.email IS UNIQUE')
.then(() => {
  driver.close()
  session.close()
} )

session.run(`CREATE
(sharkweek:User {name: 'shark@week.com', email:'shark@week.com',password: '1234', createdDate: {dateTime},isAdmin:true}),
(dragonslayer:User {name:'dragon@slayer.com', email:'dragon@slayer.com', password: '1234', createdDate: {dateTime},isAdmin:false}),
(superfly:User {name:'super@fly.com', email:'super@fly.com',password: '1234', createdDate: {dateTime}, isAdmin:false}),
(testUser:User {name:'test@user.com', email:'test@user.com',password: '1234', createdDate: {dateTime}, isAdmin:false}),
(user1:User {name:'user1@user.com', email:'user1@user.com',password: '1234', createdDate: {dateTime}, isAdmin:false}),
(user2:User {name:'user2@user.com', email:'user2@user.com',password: '1234', createdDate: {dateTime}, isAdmin:false}),
(user3:User {name:'user3@user.com', email:'user3@user.com',password: '1234', createdDate: {dateTime}, isAdmin:false}),

(user4:User {name:'user4@user.com', email:'user4@user.com',password: '1234', createdDate: {dateTime}, isAdmin:false}),
(user5:User {name:'user5@user.com', email:'user5@user.com',password: '1234', createdDate: {dateTime}, isAdmin:false}),
(user6:User {name:'user6@user.com', email:'user6@user.com',password: '1234', createdDate: {dateTime}, isAdmin:false}),
(user7:User {name:'user7@user.com', email:'user7@user.com',password: '1234', createdDate: {dateTime}, isAdmin:false}),
(user8:User {name:'user8@user.com', email:'user8@user.com',password: '1234', createdDate: {dateTime}, isAdmin:false}),
(user9:User {name:'user9@user.com', email:'user9@user.com',password: '1234', createdDate: {dateTime}, isAdmin:false}),
(user10:User {name:'user10@user.com', email:'user10@user.com',password: '1234', createdDate: {dateTime}, isAdmin:false}),

(React:Framework {name:'react', createdDate: {dateTime}}),
(Angular:Framework {name:'angular.js', createdDate: {dateTime}}),
(Ember:Framework {name:'ember.js', createdDate: {dateTime}}),
(Vue:Framework {name:'vue', createdDate: {dateTime}}),

(US:Country {code:'US', name:'United States', createdDate: {dateTime}}),
(AU:Country {code:'AU', name:'Australia', createdDate: {dateTime}}),
(UK:Country {code:'UK', name:'United Kingdom', createdDate: {dateTime}}),

(sharkweek)-[:LOCATION]->(US),
(swvote1:Vote {name:'Vote', status:'previous', createdDate: "Mon Jul 16 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(swvote2:Vote {name:'Vote', status:'previous', createdDate: "Tue Jul 17 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(swvote3:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(sharkweek)-[:VOTED]->(swvote1)-[:VOTED]->(swvote2)-[:VOTED]->(swvote3),
(swvote1)-[:FRAMEWORK]->(Angular),
(swvote2)-[:FRAMEWORK]->(React),
(swvote3)-[:FRAMEWORK]->(Vue),

(dragonslayer)-[:LOCATION]->(US),
(dsvote1:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(dragonslayer)-[:VOTED]->(dsvote1),
(dsvote1)-[:FRAMEWORK]->(React),

(superfly)-[:LOCATION]->(AU),
(sfvote1:Vote {name:'Vote', status:'previous', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(sfvote2:Vote {name:'Vote', status:'latest', createdDate: {dateTime}}),
(superfly)-[:VOTED]->(sfvote1)-[:VOTED]->(sfvote2),
(sfvote1)-[:FRAMEWORK]->(Angular),
(sfvote2)-[:FRAMEWORK]->(Vue),

(user1)-[:LOCATION]->(US),
(us1vote1:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(user1)-[:VOTED]->(us1vote1),
(us1vote1)-[:FRAMEWORK]->(Ember),

(user2)-[:LOCATION]->(US),
(us2vote1:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(user2)-[:VOTED]->(us2vote1),
(us2vote1)-[:FRAMEWORK]->(Angular),

(user3)-[:LOCATION]->(US),
(us3vote1:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(user3)-[:VOTED]->(us3vote1),
(us3vote1)-[:FRAMEWORK]->(React),

(user4)-[:LOCATION]->(UK),
(us4vote1:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(user4)-[:VOTED]->(us4vote1),
(us4vote1)-[:FRAMEWORK]->(Ember),

(user5)-[:LOCATION]->(UK),
(us5vote1:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(user5)-[:VOTED]->(us5vote1),
(us5vote1)-[:FRAMEWORK]->(React),

(user6)-[:LOCATION]->(US),
(us6vote1:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(user6)-[:VOTED]->(us6vote1),
(us6vote1)-[:FRAMEWORK]->(React),

(user7)-[:LOCATION]->(AU),
(us7vote1:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(user7)-[:VOTED]->(us7vote1),
(us7vote1)-[:FRAMEWORK]->(Vue),

(user8)-[:LOCATION]->(AU),
(us8vote1:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(user8)-[:VOTED]->(us8vote1),
(us8vote1)-[:FRAMEWORK]->(Vue),

(user9)-[:LOCATION]->(AU),
(us9vote1:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(user9)-[:VOTED]->(us9vote1),
(us9vote1)-[:FRAMEWORK]->(React),

(user10)-[:LOCATION]->(AU),
(us10vote1:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(user10)-[:VOTED]->(us10vote1),
(us10vote1)-[:FRAMEWORK]->(Angular),

(testUser)-[:LOCATION]->(AU)
`, {dateTime})
.then((results) => {
  console.log(results.summary.counters)
  console.log('DB Successfully Seeded')
  driver.close()
  session.close()
})
