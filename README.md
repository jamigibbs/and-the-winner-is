# And the winner is...

Evaluating client-side Javascript frameworks can be difficult. This app helps make that process a little bit easier. By comparing the Github repository information for the 4 major JS frameworks ([Ember](https://github.com/emberjs/ember.js/), [React](https://github.com/facebook/react), [Angular](https://github.com/angular/angular), and [Vue](https://github.com/vuejs/vue)), we just might get a better sense of which framework is most actively being developed.

The criteria for comparing active development for each framework will be based on the following:

- Repository Watchers
- Repository Forks
- Open Issues

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
3. Download and install [Neo4j ](https://neo4j.com/download/) desktop
4. In the Neo4j deskop, create a new graph database with user `neo4j` and password `1234`.  _Note: The production environment stores sensitive information in node environment variables different from these values._
5. To start the application, run `npm run start-dev` and navigation to `http://localhost:8080/`

You can also view the deployed app at: [https://and-the-winner-is.herokuapp.com/](https://and-the-winner-is.herokuapp.com/)

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
- Passwords are salted and hashed for additional security

##### User voting system
- Each user can only vote for a single JS framework
- _But_ if later they've decided to change to a different framework (because it would be a miracle if we used only one until the end of time), there's a 24 hour waiting period until they can change their vote.
- The system keeps track of all user votes but only displays the total for each framework of the user's _latest_ vote.
- When logged in, the app will display to the user a historical list of votes

##### Framework Comparison Table
- Each framework is listed within a table with each development criteria prestend to the user
- Frameworks can be sorted by each criteria to make comparisions easier
- The user will have access to voting within the comparison table (when logged in) or asked to log in to vote.

##### Graph Database
By using a graph database, we can not only display the total number of votes each framework has collected but we can also visualize a number of interesting patterns.

Because we're tracking each user's country of origin as well as historical voting data, we could query for relationships such as:

- Which countries are voting more or less for a particular framework?
- If a user changes their vote to something else, is there a common pattern? (ie. React to Vue)
- Are there common threads between different countries?
- Is there a pattern of when different countries are changing to different frameworks and how quickly?

While that type of querying is out of scope for this project, the database scheme is designed so that it can manage those types of queries if needed.

For example, we can return specific framework voting results by country with the following api route:

[https://and-the-winner-is.herokuapp.com/api/frameworks/US/votes](https://and-the-winner-is.herokuapp.com/api/frameworks/US/votes)

[https://and-the-winner-is.herokuapp.com/api/frameworks/UK/votes](https://and-the-winner-is.herokuapp.com/api/frameworks/UK/votes)

And of course we can also query for a simple tally of total latest votes:

[https://and-the-winner-is.herokuapp.com/api/frameworks/latest/votes](https://and-the-winner-is.herokuapp.com/api/frameworks/latest/votes)

## Application Design Approach

