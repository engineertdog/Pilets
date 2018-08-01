var outletRepo = [];

export default function(state = outletRepo, action) {
  switch (action.type) {
    case "Get_Outlets": {
      outletRepo = action.payload;
      return outletRepo;
    }
  }

  return outletRepo;
}