class Invitation {
  constructor(trip, tripName, sender, senderName, receiver, sendTimestamp) {
    this.trip = trip;
    this.tripName = tripName;
    this.sender = sender;
    this.senderName = senderName;
    this.receiver = receiver;
    this.sendTimestamp = sendTimestamp;
  }
}

export default Invitation;
