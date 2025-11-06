import Supercluster from "supercluster";

class SuperClusterAlgorithm {
  constructor({ radius = 60, maxZoom = 16, minZoom = 0 } = {}) {
    this.superCluster = new Supercluster({
      radius,
      maxZoom,
      minZoom,
    });
    this.points = [];
  }

  calculate({ points, bounds, zoom }) {
    this.points = points;
    if (points.length) {
      this.superCluster.load(points);
    }
    this.bounds = bounds;
    this.zoom = zoom;
  }

  getClusters() {
    if (!this.points.length) return [];
    if (!this.bounds) return this.points;

    return this.superCluster.getClusters(
      [
        this.bounds.sw.lng,
        this.bounds.sw.lat,
        this.bounds.ne.lng,
        this.bounds.ne.lat,
      ],
      Math.round(this.zoom),
    );
  }

  getClusterExpansionZoom(cluster) {
    return this.superCluster.getClusterExpansionZoom(cluster.id);
  }

  clearMarkers() {
    this.points = [];
  }
}

export default SuperClusterAlgorithm;
