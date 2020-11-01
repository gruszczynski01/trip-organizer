class Trip {
  constructor(owner, name, destination, tripBeginning, tripEnding, toDoList) {
    this.owner = owner;
    this.name = name;
    this.destination = destination;
    this.tripBeginning = tripBeginning;
    this.tripEnding = tripEnding;
    this.members = { owner };
    this.toDoList = toDoList;
    this.events = {};
  }
}

export default Trip;
