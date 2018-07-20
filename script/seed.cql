const { session, driver } = require('../server/db')

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

(sharkweek:User {name: 'shark-week365', username: 'shark-week365', email:'shark@week.com',password:'1234',googleId:null, createdDate: timestamp(),isAdmin:true}),
(dragonslayer:User {name:'dragon-slayer', username: 'dragon-slayer', email:'dragon@slayer.com',password:'1234',googleId:null, createdDate: timestamp(),isAdmin:false}),
(superfly:User {name:'super-fly', username: 'super-fly', email:'super@fly.com',password:'1234',googleId:null, createdDate: timestamp(), isAdmin:false}),

(React:Framework {name:'React', createdDate: timestamp()}),
(Angular:Framework {name:'Angular', createdDate: timestamp()}),
(Ember:Framework {name:'Ember', createdDate: timestamp()}),
(Vue:Framework {name:'Vue', createdDate: timestamp()}),

(US:Country {code:'US', name:'United States', createdDate: timestamp()}),
(AU:Country {code:'AU', name:'Australia', createdDate: timestamp()}),

(sharkweek)-[:LOCATION]->(US),
(swvote1:Vote {name:'Vote', status:null, createdDate: timestamp()}),
(swvote2:Vote {name:'Vote', status:null, createdDate: timestamp()}),
(swvote3:Vote {name:'Vote', status:'latest', createdDate: timestamp()}),
(sharkweek)-[:VOTES]->(swvote1)-[:VOTE]->(swvote2)-[:VOTE]->(swvote3),
(swvote1)-[:FRAMEWORK]->(React),
(swvote2)-[:FRAMEWORK]->(React),
(swvote3)-[:FRAMEWORK]->(React),

(dragonslayer)-[:LOCATION]->(US),
(dsvote1:Vote {name:'Vote', status:'latest', createdDate: timestamp()}),
(dragonslayer)-[:VOTES]->(dsvote1),
(dsvote1)-[:FRAMEWORK]->(React),

(superfly)-[:LOCATION]->(AU),
(sfvote1:Vote {name:'Vote', status:null, createdDate: timestamp()}),
(sfvote2:Vote {name:'Vote', status:'latest', createdDate: timestamp()}),
(superfly)-[:VOTES]->(sfvote1)-[:VOTE]->(sfvote2),
(sfvote1)-[:FRAMEWORK]->(Vue),
(sfvote2)-[:FRAMEWORK]->(Vue)
`)
.then((results) => {
  console.log(results.summary.counters)
  console.log('DB Successfully Seeded')
  driver.close()
  session.close()
})
