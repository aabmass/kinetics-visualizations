import VRMLLoader from './VRMLLoader';

export default class Molecule {
  constructor(pathToVwrl) {
    this.pathToVwrl = pathToVwrl;
  }

  loadMesh(callback) {
    new VRMLLoader().load(this.pathToVwrl, callback);
  }
}
