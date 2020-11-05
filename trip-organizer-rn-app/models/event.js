class Event {
  constructor(name, desc, date, time, tripParent) {
    this.name = name;
    this.desc = desc;
    this.date = date;
    this.time = time;
    this.tripParent = tripParent;
  }
}

export default Event;
