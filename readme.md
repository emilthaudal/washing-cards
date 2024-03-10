# Megawash Implementation Notes

## Approach

My solution will focus on a vertically sliced NodeJS application. I'm using Express for the REST API functionality.

The card data for the game will be read from the Megawash Data.csv and the game state will only be stored in memory in the initial version. This will be done through a repository pattern to allow for easy swapping of the data source in the future.

My approach is to do a very agile and iterative process. I'm setting up the endpoints and integration tests for those as early as possible. Then i will iterate on the handlers and models as i go to support the goals from the requirements.

The following are my subgoals for the implementation:

### 1. Initialize repository with cards from .csv file

For simplicity we store the cards in memory. In the future we can swap this out for a database or other data source.

### 2. Add _Create Game_ endpoint to create a new game and return the game state.

This endpoint will create a new game, add players to the game. If no PlayerIDs are provided new players will be generated in memory. Distribute cards between players randomly.

### 3. Add _Play Round_ endpoint that will play the selected round.

This endpoint will play a round of the game. It takes a game ID and a card feature as input and then processes the game another round forward and returns the updated game state. This also checks for elimination of players and ends the game if only one player is left.

## Abstractions

### Player / User domain

For simplicity I have not gone into detail on the player domain. A participant in a game is a Player and it would be possible to make a leaderboard for each player since we have an ID for them in the games.

### Event Sourcing

Normally for a project like this i would use event sourcing to store the game state. This would allow us to replay the game from the start and also allow us to store the game state in a database. For simplicity I have chosen to store the game state in memory using simple objects.
