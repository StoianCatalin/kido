export class Marker{
  latitude: number;
  longitude: number;
  type: string;
  name: string;
  id: number;

  constructor(id, name, type, latitude, longitude) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
