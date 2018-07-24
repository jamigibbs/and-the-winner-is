[![Build Status](https://travis-ci.org/jamigibbs/and-the-winner-is.svg?branch=master)](https://travis-ci.org/jamigibbs/and-the-winner-is)

# And the winner is...

Evaluating client-side Javascript frameworks can be difficult. This app helps make that process a little bit easier. By comparing the Github repository information for 4 major JS frameworks ([Ember](https://github.com/emberjs/ember.js/), [React](https://github.com/facebook/react), [Angular](https://github.com/angular/angular), and [Vue](https://github.com/vuejs/vue)), we can get a better sense of which framework is most actively being developed.

The criteria for comparing active development for each framework will be based on the following:

- Repository Watchers
- Repository Forks
- Open Issues

![And the winner is](https://d.pr/i/qOMwuc+)

## Technology

This application uses the following technologies:

- React + Redux
- Node + Express
- Neo4J + Cypher
- Material.ui
- Github API
- Heroku

## Installation

To install the application on your local environment:

1. Clone or fork this repository: `git clone https://github.com/jamigibbs/and-the-winner-is`

2. Install the dependencies: `npm install`
3. Download and install the [Neo4j ](https://neo4j.com/download/) desktop
4. In the Neo4j desktop, create a new graph database with user `neo4j` and password `1234`.  _Note: In production, variables are stored as node environment variables._
5. To start the application, run `npm run start-dev` and navigate to `http://localhost:8080/`

You can also view the deployed app at: [https://and-the-winner-is.herokuapp.com/](https://and-the-winner-is.herokuapp.com/)

## Tests

To view current test status:

1. On a local environment, run `npm test`, or
2. On Travis, view testing status [here](https://travis-ci.org/jamigibbs/and-the-winner-is)

## Framework Development Criteria

The three repository values selected were chosen for the following reasons:

#### Repository Watchers
The number of watchers a repository maintains suggests that the framework has a high or low number of active participants in its development. Watching a repository means you're receiving development updates of some manner; an issue is opened, a pull request is opened, a comment is added, etc. All of these notifications indicate an active participant in the framework.

#### Repository Forks
Forking a repository usually happens when a) someone wants to use the repo as a starting point for their own project, or b) someone wants to contribute to that project. By comparing the number of forks each framework has, we can get a sense of how many developers are potentially contributing to the framework either by reporting issues, or, submitting pull requests from their fork.

#### Open Issues
Evaluating the number of open issues can be considered in two different ways. A high number of issues could mean that the framework is popular and developers are eager to report problems or submit updates. But it's possible a high number of issues could suggest a framework development team that isn't responsive or actively updating. In either case, the information is valuable in understanding how active the framework might be.

## Major Features

##### User login system

- The login system allows account creation based on a user's email.
- A user can only create a single account with their email
- A user will not be able to create multiple accounts with different emails
- On account creation, the user is asked to supply their country of origin
- Passwords are [salted and hashed](https://nodejs.org/api/crypto.html) for additional security

![user login](https://d.pr/i/Q0iOc6+)


##### User voting system
- Each user can only vote for a single JS framework
- _But_ if later they've decided to change to a different framework (because it would be a miracle if we used only one until the end of time), there's a 24 hour waiting period until they can change their vote.
- The system keeps track of all user votes but only displays the total for each framework of the user's _latest_ vote.
- When logged in, the app will display to the user a historical list of votes

![framework comparison table](https://d.pr/i/F0GNJS+)


##### Framework Comparison Table
- Each framework is listed within a table where each development criteria presented to the user
- Frameworks can be sorted by each criteria to make comparisons easier
- The user will have access to voting within the comparison table (when logged in) or asked to log in to vote.
- A voting message conditionally displays depending on if the user has voted in the last 24 hours or not.
- If a user had voted over 24 hours ago, they're given the option to change their vote to a different framework.

![framework comparison table](https://d.pr/i/a2imz5+)


##### Graph Database
By using a graph database, we can not only display the total number of votes each framework has collected but we can also visualize a number of interesting patterns.

Because we're tracking each user's country of origin as well as historical voting data, we could query for relationships such as:

- Which countries are voting more or less for a particular framework?
- If a user changes their vote to something else, is there a common pattern? (ie. React to Vue)
- Are there common threads between different countries?
- Is there a pattern of when different countries are changing to different frameworks and how quickly?
- How often does someone change to a different framework and is there a common switch?

![Graph database with seed content](https://d.pr/i/4DssdG+)

While that type of querying is out of scope for this project, the database scheme is designed so that it can manage them if needed. For example, we can return specific framework voting results by country with the following api route:

Votes from the United States:

[https://and-the-winner-is.herokuapp.com/api/frameworks/US/votes](https://and-the-winner-is.herokuapp.com/api/frameworks/US/votes)

Votes from the UK:

[https://and-the-winner-is.herokuapp.com/api/frameworks/UK/votes](https://and-the-winner-is.herokuapp.com/api/frameworks/UK/votes)

And of course we can also query for an overall tally of total latest votes:

[https://and-the-winner-is.herokuapp.com/api/frameworks/latest/votes](https://and-the-winner-is.herokuapp.com/api/frameworks/latest/votes)

![Total Votes](https://d.pr/i/86pifR+)


## Application Design Approach

#### Database

Designing the database schema was my first task as that would set the foundation for the steps following it. I spent some time considering if I could (or should) keep track of a user's voting history because a) it wasn't explicitly set in the requirements of this project and b) it would add a layer of complexity that may not be worth the effort.

Ultimately, I decided that the complexity wouldn't bring much additional overhead and I could still meet the project requirements; a single user vote tallied for each framework.

Each vote could also be given a relationship with its respective framework and adding a country node was a natural addition which allowed the graph to truly show interesting relationships between users, countries, and votes. With that decided, the Neo4j graph database seemed like a natural fit.

To meet the basic requirements of the project, each user's set of votes are treated like linked lists where we can traverse the list to the last voting node where the most recent vote would be found.

![User votes](https://d.pr/i/Mo9Cmq+)


#### Front End

Using React for the user interface, Redux for state management, and Express for API endpoints, I divided the dashboard into two types: authenticated and unauthenticated.

For authenticated users, endpoints are protected by authentication middleware to check if the correct user is logged in for the requested data.

The bulk of the components are displayed on a single dashboard page with sections conditionally displayed based on login status.

Basic design is provided by the Matieral UI library of HOCs with minor custon inline styles within individual components. If more style was required, I would have moved the inline styles to a separate SCSS folder for better management. But for the size of the current application, inline style on a component level is sufficient.

Lastly, updating framework info without a page refresh is handled on the component level with an `async` promise wrapped within a 10 minute `setInterval` to the Github API. I considered using websockets to handle the updates but ultimately decided that it would have been excessive for a minor API request. Websockets are a great choice for interactive communication sessions where you need to send and receive information but in this case, we're only requesting and receiving so a standard interval sufficed.

#### Routes

**Framework Routes**

`GET: /api/frameworks/latest/votes`

`GET: /api/frameworks/:countryCode/votes`

**Authenticated Routes**

`GET: /api/auth/user/votes/all/?email=example@email.com`

`POST: /api/auth/user/vote`

**Account Management Routes**

`POST: /signup`

`POST: /login`

`POST: /logout`
