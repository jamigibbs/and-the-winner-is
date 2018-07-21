const { session, driver } = require('../server/db')
const now = new Date()
const dateTime = now.toString()

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
(sharkweek:User {name: 'shark@week.com', email:'shark@week.com',password:'1234',googleId:null, createdDate: {dateTime},isAdmin:true}),
(dragonslayer:User {name:'dragon@slayer.com', email:'dragon@slayer.com', password:'1234',googleId:null, createdDate: {dateTime},isAdmin:false}),
(superfly:User {name:'super@fly.com', email:'super@fly.com',password:'1234',googleId:null, createdDate: {dateTime}, isAdmin:false}),
(testUser:User {name:'test@user.com', email:'test@user.com',password:'1234',googleId:null, createdDate: {dateTime}, isAdmin:false}),

(React:Framework {name:'react', createdDate: {dateTime}}),
(Angular:Framework {name:'angular.js', createdDate: {dateTime}}),
(Ember:Framework {name:'ember.js', createdDate: {dateTime}}),
(Vue:Framework {name:'vue', createdDate: {dateTime}}),

(US:Country {code:'US', name:'United States', createdDate: {dateTime}}),
(AU:Country {code:'AU', name:'Australia', createdDate: {dateTime}}),

(sharkweek)-[:LOCATION]->(US),
(swvote1:Vote {name:'Vote', status:'previous', createdDate: "Mon Jul 16 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(swvote2:Vote {name:'Vote', status:'previous', createdDate: "Tue Jul 17 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(swvote3:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(sharkweek)-[:VOTED]->(swvote1)-[:VOTED]->(swvote2)-[:VOTED]->(swvote3),
(swvote1)-[:FRAMEWORK]->(React),
(swvote2)-[:FRAMEWORK]->(React),
(swvote3)-[:FRAMEWORK]->(React),

(dragonslayer)-[:LOCATION]->(US),
(dsvote1:Vote {name:'Vote', status:'latest', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(dragonslayer)-[:VOTED]->(dsvote1),
(dsvote1)-[:FRAMEWORK]->(React),

(superfly)-[:LOCATION]->(AU),
(sfvote1:Vote {name:'Vote', status:'previous', createdDate: "Wed Jul 18 2018 12:51:50 GMT-0500 (Central Daylight Time)" }),
(sfvote2:Vote {name:'Vote', status:'latest', createdDate: {dateTime}}),
(superfly)-[:VOTED]->(sfvote1)-[:VOTED]->(sfvote2),
(sfvote1)-[:FRAMEWORK]->(Vue),
(sfvote2)-[:FRAMEWORK]->(Vue),

(testUser)-[:LOCATION]->(AU)
`, {dateTime})
.then((results) => {
  console.log(results.summary.counters)
  console.log('DB Successfully Seeded')
  driver.close()
  session.close()
})
