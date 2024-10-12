export class JokeTexts {
  static readonly ATTEMPT_FIND_ALL = 'Attempt to list all jokes.';
  static readonly ATTEMPT_FIND_ONE = 'Attempt to get a joke.';
  static readonly ATTEMPT_FIND_RANDOM_ONE = 'Attempt to get a random joke.';
  static readonly ATTEMPT_FIND_DAILY_ONE = 'Attempt to get daily joke.';
  static readonly ATTEMPT_CREATE = 'Attempt to create a joke.';
  static readonly ATTEMPT_UPDATE = 'Attempt to update a joke.';
  static readonly ATTEMPT_DELETE = 'Attempt to delete a joke.';
  static readonly FOUND_ALL = 'MongoDb responded, found jokes.';
  static readonly FOUND_ONE = 'MongoDb responded, found joke.';
  static readonly CREATED_ONE = 'MongoDb responded, created joke.';
  static readonly UPDATED_ONE = 'MongoDb responded, updated joke.';
  static readonly DELETE_ONE = 'MongoDb responded, deleted joke.';
  static readonly NOT_FOUND = 'Joke not found.';
  static readonly FROM_YESTERDAY_NOT_FOUND =
    'Daily joke from yesterday not found.';
  static readonly ERROR_REMOVING_DUPLICATE = 'Error removing duplicate jokes.';
  static readonly NO_DUPLICATES = 'No duplicate jokes to be removed.';
}
