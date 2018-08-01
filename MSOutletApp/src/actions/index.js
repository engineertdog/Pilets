export function getOutlets(response) {
  return {
    type: 'Get_Outlets',
    payload: response
  }
}

export function errorAPI(response) {
  return {
    type: 'Error_API',
    payload: response
  }
}

export function getRepoThunk(url, key, token) {
  return async dispatch => {
    fetch(url + "status.php?api_key=" + key + "&api_token=" + token)
    .then(e => e.json())
      .then(function(response) {
        if (typeof(response) !== "string") {
          return dispatch(getOutlets(response))
        } else {
          return dispatch(errorAPI(response))
        }
      }).catch((error) => {
        console.error(error,"ERRRRRORRR");
      });
  }
}

export function updateRepo(url, key, token, id, command) {  
  return async dispatch => {
    fetch(url + "update.php?api_key=" + key + "&api_token=" + token + "&id=" + id + "&command=" + command)
    .then(e => e.json())
      .then(function(response) {
        if (typeof(response) !== "string") {
          return dispatch(getOutlets(response))
        } else {
          return dispatch(errorAPI(response))
        }
      }).catch((error) => {
        console.error(error,"ERRRRRORRR");
      });
  }
}
