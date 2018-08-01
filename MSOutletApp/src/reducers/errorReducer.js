var errorInfo = [];

export default function(state = errorInfo, action) {
  switch (action.type) {
    case "Error_API": {
        errorInfo = action.payload;
        return errorInfo;
    }
  }

  return errorInfo;
}